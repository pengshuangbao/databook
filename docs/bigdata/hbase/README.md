# Hbase

[toc]

![知识图谱](https://static.lovedata.net/jpg/2018/6/20/7620334c24d3e79d5ec4954bd5003e87.jpg-wm)

## hbase 架构讲解

![image](https://static.lovedata.net/jpg/2018/6/20/08bd66f5cd400fe609a745de9bd16dab.jpg-wm)

参考
[深入HBase架构解析（一） - 上善若水 - BlogJava](http://www.blogjava.net/DLevin/archive/2015/08/22/426877.html)

## Hbase  热点现象及解决办法

## RowKey的设计原则？

rowkey的设计原则：各个列簇数据平衡，长度原则、相邻原则，创建表的时候设置表放入regionserver缓存中，避免自动增长和时间，使用字节数组代替string，最大长度64kb，最好16字节以内，按天分表，两个字节散列，四个字节存储时分毫秒。

## HBase和传统数据库的区别；

## Hbase 优化

###  GC优化

BucketCache中offheap模式来讲，即使HBase数据块是缓存在堆外内存的，但是在读取的时候还是会首先将堆外内存中的block加载到JVM内存中

在大多数对延迟敏感的业务场景下（比如HBase），建议使用如下JVM参数，-XX:+UseParNewGC和XX:+UseConcMarkSweepGC，其中前者表示对新生代执行并行的垃圾回收机制，而后者表示对老生代执行并行标记－清除垃圾回收机制

- 调小 -XX:CMSInitiatingOccupancyFraction 值 调整为60
- -XX: UseCMSCompactAtFullCollection 在Full GC后使用合并内存碎片

调优

![image](https://static.lovedata.net/jpg/2018/7/3/5c09485d9305477941bffcd45b75dcfd.jpg-wm)

![image](https://static.lovedata.net/jpg/2018/7/3/04fe6da6ad071a7178c031b794386f55.jpg-wm)
**可见BucketCache模式比LruBlockCache模式GC表现好很多，强烈建议线上配置BucketCache模式**

需要加上-XX:+PrintTenuringDistribution 才能打印对应日志

阶段二：NewParSize调优

 NewParSize表示young区大小，而young区大小直接决定minor gc的频率。minor gc频率一方面决定单次minor gc的时间长短，gc越频繁，gc时间就越短；一方面决定对象晋升到老年代的量，gc越频繁，晋升到老年代的对象量就越大。解释起来就是：

1. 增大young区大小，minor gc频率降低，单次gc时间会较长（young区设置更大，一次gc就需要复制更多对象，耗时必然比较长），业务读写操作延迟抖动较大。反之，业务读写操作延迟抖动较小，比较平稳。

2. 减小young区大小，minor gc频率增快，但会加快晋升到老年代的对象总量（每gc一次，对象age就会加一，当age超过阈值就会晋升到老年代，因此gc频率越高，age就增加越快），潜在增加old gc风险。

因此 **设置NewParSize需要进行一定的平衡，不能设置太大，也不能设置太小。** 

Xmn设置过小会导致CMS GC性能较差，而设置过大会导致Minor GC性能较差，因此建议在JVM Heap为64g以上的情况下设置Xmn在1～3g之间，在32g之下设置为512m～1g；具体最好经过简单的线上调试；需要特别强调的是，笔者在很多场合都看到很多HBase线上集群会把Xmn设置的很大，比如有些集群Xmx为48g，Xmn为10g，查看日志发现GC性能极差：单次Minor GC基本都在300ms～500ms之间，CMS GC更是很多超过1s。 **在此强烈建议，将Xmn调大对GC（无论Minor GC还是CMS GC）没有任何好处，不要设置太大。**

阶段三：增大Survivor区大小（减小SurvivorRatio） & 增大MaxTenuringThreshold

MaxTenuringThreshold=15已经相对比较大，

#### CMS调优结论

1. 缓存模式采用BucketCache策略Offheap模式

2. 对于大内存（大于64G），采用如下配置：

-Xmx64g -Xms64g -Xmn2g -Xss256k -XX:MaxPermSize=256m -XX:SurvivorRatio=2  -XX:+UseConcMarkSweepGC -XX:+UseParNewGC 
-XX:+CMSParallelRemarkEnabled -XX:MaxTenuringThreshold=15 -XX:+UseCMSCompactAtFullCollection  -XX:+UseCMSInitiatingOccupancyOnly        
-XX:CMSInitiatingOccupancyFraction=75 -XX:-DisableExplicitGC

其中Xmn可以随着Java分配堆内存增大而适度增大，但是不能大于4g，取值范围在1~3g范围；SurvivorRatio一般建议选择为2；MaxTenuringThreshold设置为15；

3 对于小内存（小于64G），只需要将上述配置中Xmn改为512m-1g即可 

参考
[HBase最佳实践－CMS GC调优 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/08/09/hbase-cms-gc/)

![image](https://static.lovedata.net/jpg/2018/7/3/84a839d36fbeae1fdda1751f58b99c00.jpg-wm)

[HBase GC的前生今世 – 身世篇 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/05/21/hbase-gc-1/)

[HBase GC的前生今世 – 演进篇 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/05/29/hbase-gc-2/)

###  列族设计优化

1. BlockSize设置 块大小是HBase的一个重要配置选项，默认块大小为64K。对于不同的业务数据，块大小的合理设置对读写性能有很大的影响。而对块大小的调整，主要取决于两点 1 用户平均读取数据的大小 2 数据平均键值对规模
2. 数据编码/压缩  Compress/DeCompress ![image](https://static.lovedata.net/jpg/2018/7/4/7f1b7a9dbc7212a7dcfe4033df9b063b.jpg-wm)  
    1. 可见，压缩特性就是使用CPU资源换取磁盘空间资源，对读写性能并不会有太大影响。HBase目前提供了三种常用的压缩方式：GZip | LZO | Snappy ![image](https://static.lovedata.net/jpg/2018/7/4/a953dabaad6041703d6a5f91128de571.jpg-wm)  Snappy的压缩率最低，但是编解码速率最高，对CPU的消耗也最小，目前一般建议使用Snappy。
3. Encode/Decode
   1. ![image](https://static.lovedata.net/jpg/2018/7/4/c1a4dd238f14c8e72933f0cc57b689dd.jpg-wm) 
   2.   因此一般建议使用PREFIX_TREE编码压缩

[HBase最佳实践－列族设计优化 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/07/02/hbase-pracise-cfsetting/)

###  读性能优化

 一般情况下，读请求延迟较大通常存在三种场景，分别为：
1. 仅有某业务延迟较大，集群其他业务都正常
2. 整个集群所有业务都反映延迟较大
3. 某个业务起来之后集群其他部分业务延迟较大

优化项

 HBase客户端优化
1. scan缓存是否设置合理？
    1. 优化建议：大scan场景下将scan缓存从100增大到500或者1000，用以减少RPC次数 
2. get请求是否可以使用批量请求？  优化建议：使用批量get进行读取请求 
3. 请求是否可以显示指定列族或者列？ 可以指定列族或者列进行精确查找的尽量指定查找
4. 离线批量读取请求是否设置禁止缓存   优化建议：离线批量读取请求设置禁用缓存，scan.setBlockCache(false)

HBase服务器端优化   一般服务端端问题一旦导致业务读请求延迟较大的话，通常是集群级别的，即整个集群的业务都会反映读延迟较大。可以从4个方面入手： 

1. 读请求是否均衡？ RowKey必须进行散列化处理（比如MD5散列），同时建表必须进行预分区处理
2. BlockCache是否设置合理？ JVM内存配置量 < 20G，BlockCache策略选择LRUBlockCache；否则选择BucketCache策略的offheap模式；期待HBase 2.0的到来！
3. HFile文件是否太多？ hbase.hstore.compactionThreshold和hbase.hstore.compaction.max.size，前者表示一个store中的文件数超过多少就应该进行合并，后者表示参数合并的文件大小最大是多少  hbase.hstore.compactionThreshold设置不能太大，默认是3个；设置需要根据Region大小确定，通常可以简单的认为hbase.hstore.compaction.max.size = RegionSize / hbase.hstore.compactionThreshold
4. Compaction是否消耗系统资源过多？

HBase列族设计优化

1. Bloomfilter是否设置？是否设置合理？ 优化建议：任何业务都应该设置Bloomfilter，通常设置为row就可以，除非确认业务随机查询类型为row+cf，可以设置为rowcol

HDFS相关优化

1. Short-Circuit Local Read功能是否开启？  当前HDFS读取数据都需要经过DataNode，客户端会向DataNode发送读取数据的请求，DataNode接受到请求之后从硬盘中将文件读出来，再通过TPC发送给客户端。Short Circuit策略允许客户端绕过DataNode直接读取本地数据。（具体原理参考此处）优化建议：开启Short Circuit Local Read功能，具体配置戳这里 
2. Hedged Read功能是否开启？
3. 数据本地率是否太低？数据本地率低的原因一般是因为Region迁移（自动balance开启、RegionServer宕机迁移、手动迁移等）,因此一方面可以通过避免Region无故迁移来保持数据本地率，另一方面如果数据本地率很低，也可以通过执行major_compact提升数据本地率到100%。   优化建议：避免Region无故迁移，比如关闭自动balance、RS宕机及时拉起并迁回飘走的Region等；在业务低峰期执行major_compact提升数据本地率

![image](https://static.lovedata.net/jpg/2018/7/3/453bce3c61d13bdc252ac602d17b85d0.jpg-wm)

![image](https://static.lovedata.net/jpg/2018/7/3/6aa1c1434d723ccfe84d37039e961032.jpg-wm)

[HBase最佳实践－读性能优化策略 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/11/11/hbase%e6%9c%80%e4%bd%b3%e5%ae%9e%e8%b7%b5%ef%bc%8d%e8%af%bb%e6%80%a7%e8%83%bd%e4%bc%98%e5%8c%96%e7%ad%96%e7%95%a5/)

###  写性能优化

HBase数据写入通常会遇到两类问题，一类是写性能较差，另一类是数据根本写不进去。这两类问题的切入点也不尽相同，如下图所示：

![image](https://static.lovedata.net/jpg/2018/7/3/a93d759e4458811e7aa76535125c65c4.jpg-wm)

1. 是否需要写WAL？WAL是否需要同步写入？  ，比如某些推荐业务，这类业务即使丢失一部分用户行为数据可能对推荐结果并不构成很大影响   优化推荐：根据业务关注点在WAL机制与写入吞吐量之间做出选择 
2. Put是否可以同步批量提交？  HBase分别提供了单条put以及批量put的API接口，使用批量put接口可以减少客户端到RegionServer之间的RPC连接数，提高写入性能。另外需要注意的是，批量put请求要么全部成功返回，要么抛出异常。  **优化建议：使用批量put进行写入请求** 
3. Put是否可以异步批量提交？  业务如果可以接受异常情况下少量数据丢失的话，还可以使用异步批量提交的方式提交请求。提交分为两阶段执行：用户提交写请求之后，数据会写入客户端缓存，并返回用户写入成功；当客户端缓存达到阈值（默认2M）之后批量提交给RegionServer。需要注意的是，在某些情况下客户端异常的情况下缓存数据有可能丢失。**优化建议：在业务可以接受的情况下开启异步批量提交**
4. 在Num(Region of Table) < Num(RegionServer)的场景下切分部分请求负载高的Region并迁移到其他RegionServer
5. 写入请求是否不均衡？ 检查RowKey设计以及预分区策略，保证写入请求均衡。
6. 写入KeyValue数据是否太大？ 
    1. 目前针对这种较大KeyValue写入性能较差的问题还没有直接的解决方案，好在社区已经意识到这个问题，在接下来即将发布的下一个大版本HBase 2.0.0版本会针对该问题进行深入优化，详见HBase MOB，优化后用户使用HBase存储文档、图片等二进制数据都会有极佳的性能体验。
    2. 大字段scan导致RegionServer宕机
        1. 目前针对该异常有两种解决方案，其一是升级集群到1.0，问题都解决了。其二是要求客户端访问的时候对返回结果大小做限制(scan.setMaxResultSize(2*1024*1024))、并且对列数量做限制(scan.setBatch(100))，当然，0.98.13版本以后也可以对返回结果大小在服务器端进行限制，设置参数hbase.server.scanner.max.result.size即可
7. Memstore设置是否会触发Region级别或者RegionServer级别flush操作？
    1. 以RegionServer级别flush进行解析，HBase设定一旦整个RegionServer上所有Memstore占用内存大小总和大于配置文件中upperlimit时，系统就会执行RegionServer级别flush，flush算法会首先按照Region大小进行排序，再按照该顺序依次进行flush，直至总Memstore大小低至lowerlimit。
8. Store中HFile数量是否大于配置参数blockingStoreFile?

[HBase最佳实践－写性能优化策略 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/12/10/hbase-parctice-write/)

## HBase Master和Regionserver的交互；

## HBase的HA，Zookeeper在其中的作用；

## Master宕机的时候，哪些能正常工作，读写数据；

## region分裂的过程？

## Hbase 列簇的设计原则

列族的设计原则：尽可能少（按照列族进行存储，按照region进行读取，不必要的io操作），经常和不经常使用的两类数据放入不同列族中，列族名字尽可能短。

## hbase性能解决方案：

1、hbase怎么给web前台提供接口来访问?
hbase有一个web的默认端口60010，是提供客户端用来访问hbase的

2、hbase有没有并发问题?

3、Hbase中的metastore用来做什么的?
Hbase的metastore是用来保存数据的，其中保存数据的方式有有三种第一种与第二种是本地储存，第三种是远程储存这一种企业用的比较多

4、HBase在进行模型设计时重点在什么地方?一张表中定义多少个Column Family最合适?为什么?
具体看表的数据，一般来说划分标准是根据数据访问频度，如一张表里有些列访问相对频繁，而另一些列访问很少，这时可以把这张表划分成两个列族，分开存储，提高访问效率

5、如何提高HBase客户端的读写性能?请举例说明。
①开启bloomfilter过滤器，开启bloomfilter比没开启要快3、4倍
②Hbase对于内存有特别的嗜好，在硬件允许的情况下配足够多的内存给它
③通过修改hbase-env.sh中的
export HBASE_HEAPSIZE=3000 #这里默认为1000m
④增大RPC数量
通过修改hbase-site.xml中的
hbase.regionserver.handler.count属性，可以适当的放大。默认值为10有点小

6、直接将时间戳作为行健，在写入单个region 时候会发生热点问题，为什么呢?
HBase的rowkey在底层是HFile存储数据的，以键值对存放到SortedMap中。并且region中的rowkey是有序存储，若时间比较集中。就会存储到一个region中，这样一个region的数据变多，其它的region数据很好，加载数据就会很慢。直到region分裂可以解决。

## HBase － 数据写入流程解析

> HBase默认适用于写多读少的应用

客户端

1. 用户提交put请求后，HBase客户端会将put请求添加到本地buffer中，符合一定条件就会通过AsyncProcess异步批量提交 HBase默认设置autoflush=true 可设置为false,没有保护机制
2. 在提交之前，HBase会在元数据表.meta.中根据rowkey找到它们归属的region server，这个定位的过程是通过HConnection的locateRegion方法获得的
3. HBase会为每个HRegionLocation构造一个远程RPC请求MultiServerCallable，然后通过rpcCallerFactory.newCaller()执行调用

服务端

> 服务器端RegionServer接收到客户端的写入请求后，首先会反序列化为Put对象，然后执行各种检查操作，比如检查region是否是只读、memstore大小是否超过blockingMemstoreSize 

![image](https://static.lovedata.net/jpg/2018/6/20/183daf0ec61cdcf47aaff6fe85ae9389.jpg-wm)

1. 获取行锁、Region更新共享锁 同行数据的原子性
2. 开始写事务：获取write number，用于实现MVCC，实现数据的非锁定读，在保证读写一致性的前提下提高读取性能
3. 写缓存memstore：HBase中每列族都会对应一个store，用来存储该列数据。每个store都会有个写缓存memstore，用于缓存写入数据。HBase并不会直接将数据落盘，而是先写入缓存，等缓存满足一定大小之后再一起落盘。
4. Append HLog：HBase使用WAL机制保证数据可靠性，即首先写日志再写缓存，即使发生宕机，也可以通过恢复HLog还原出原始数据。
5. 释放行锁以及共享锁
6. Sync HLog：HLog真正sync到HDFS，在释放行锁之后执行sync操作是为了尽量减少持锁时间，提升写性能 如果Sync失败，执行回滚操作将memstore中已经写入的数据移除。
7. 结束写事务
8. flush memstore：当写缓存满64M之后，会启动flush线程将数据刷新到硬盘

参考
[HBase － 数据写入流程解析 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/03/23/hbase_writer/)

## HBase 数据读取流程

> 查询比较复杂，一是因为整个HBase存储引擎基于LSM-Like树实现   其二是因为HBase中更新操作以及删除操作实现都很简单，更新操作并没有更新原有数据  是插入了一条打上”deleted”标签的数据，而真正的数据删除发生在系统异步执行Major_Compact的时候 但是对于数据读取来说却意味着套上了层层枷锁

![image](https://static.lovedata.net/jpg/2018/6/20/d0f9a3466084169a700b73db005584d6.jpg-wm)

![image](https://static.lovedata.net/jpg/2018/6/20/d358a28eb3558b62c1ee23169f5b0620.jpg-wm)

![客户端缓存RegionServer地址信息](https://static.lovedata.net/jpg/2018/6/20/3f6ec491d3504cbb4a163fa7ff7b0998.jpg-wm)

scan数据就和开发商盖房一样，也是分成两步：组建施工队体系，明确每个工人的职责；一层一层盖楼。

 scanner体系的核心在于三层scanner：RegionScanner、StoreScanner以及StoreFileScanner。三者是层级的关系，一个RegionScanner由多个StoreScanner构成，一张表由多个列族组成，就有多少个StoreScanner负责该列族的数据扫描。一个StoreScanner又是由多个StoreFileScanner组成。每个Store的数据由内存中的MemStore和磁盘上的StoreFile文件组成，相对应的，StoreScanner对象会雇佣一个MemStoreScanner和N个StoreFileScanner来进行实际的数据读取，每个StoreFile文件对应一个StoreFileScanner，注意：StoreFileScanner和MemstoreScanner是整个scan的最终执行者。 

![image](https://static.lovedata.net/jpg/2018/6/20/931c83f325dd513936b66fafdf085282.jpg-wm)

 HBase中KeyValue是什么样的结构？

 ![image](https://static.lovedata.net/jpg/2018/6/20/9d1f2731d5383ed8461fdf2a8908ee8c.jpg-wm)

参考
[HBase原理－迟到的‘数据读取流程’部分细节 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2017/06/11/hbase-scan-2/)
[HBase原理－数据读取流程解析 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/12/21/hbase-getorscan/)

## Hbase BlockCache的理解

BlockCache也称为读缓存，HBase会将一次文件查找的Block块缓存到Cache中，以便后续同一请求或者邻近数据查找请求直接从内存中获取，避免昂贵的IO操作，重要性不言而喻。BlockCache有两种实现机制：LRUBlockCache和BucketCache（通常是off-heap）

1. BlockCache的内容

## 行式存储和列式存储的优劣势？



## Hbase 二级索引实现

1. [技术分享 | HBase二级索引实现方案 - 后端 - 掘金](https://juejin.im/entry/5bae42f7f265da0aa5291913)
   1. ![image](https://static.lovedata.net/20-06-30-d0a62c86d8017f664384df7850ea85c9.png-wm)
   2. **IndexTable的创建过程如下：**
      1. 获取DataTable的所有RegionInfo，得到所有DataTable Region的StartKey。
      2. 结合索引定义和DataTable Region的StartKey信息，调用HBaseAdmin的createTable(final HTableDescriptor desc, byte [][] splitKeys)方法创建索引表。
      3. 通过以上两步便建立了IndexTable Region和DataTable Region的以StartKey为依据的一一对应关系。
   3.   **IndexTable RowKey**
      1. ![image](https://static.lovedata.net/20-06-30-a687eca5fb78d81e08f143ba69b47dc6.png-wm)

