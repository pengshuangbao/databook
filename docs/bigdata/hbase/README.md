# Hbase

[toc]

![知识图谱](https://static.lovedata.net/jpg/2018/6/20/7620334c24d3e79d5ec4954bd5003e87.jpg-wm)

## hbase 架构讲解

![image](https://static.lovedata.net/jpg/2018/6/20/08bd66f5cd400fe609a745de9bd16dab.jpg-wm)

参考
[深入HBase架构解析（一） - 上善若水 - BlogJava](http://www.blogjava.net/DLevin/archive/2015/08/22/426877.html)

## Hbase  热点现象及解决办法

## RowKey的设计原则?

rowkey的设计原则：各个列簇数据平衡，长度原则、相邻原则，创建表的时候设置表放入regionserver缓存中，避免自动增长和时间，使用字节数组代替string，最大长度64kb，最好16字节以内，按天分表，两个字节散列，四个字节存储时分毫秒。

## HBase和传统数据库的区别；

## Hbase BlockCache的理解

BlockCache也称为读缓存，HBase会将一次文件查找的Block块缓存到Cache中，以便后续同一请求或者邻近数据查找请求直接从内存中获取，避免昂贵的IO操作，重要性不言而喻。BlockCache有两种实现机制：LRUBlockCache和BucketCache（通常是off-heap）

1. BlockCache的内容

## 行式存储和列式存储的优劣势?



## Hbase 二级索引实现

1. [技术分享 | HBase二级索引实现方案 - 后端 - 掘金](https://juejin.im/entry/5bae42f7f265da0aa5291913)
   1. ![image](https://static.lovedata.net/20-06-30-d0a62c86d8017f664384df7850ea85c9.png-wm)
   2. **IndexTable的创建过程如下：**
      1. 获取DataTable的所有RegionInfo，得到所有DataTable Region的StartKey。
      2. 结合索引定义和DataTable Region的StartKey信息，调用HBaseAdmin的createTable(final HTableDescriptor desc, byte [][] splitKeys)方法创建索引表。
      3. 通过以上两步便建立了IndexTable Region和DataTable Region的以StartKey为依据的一一对应关系。
   3.   **IndexTable RowKey**
      1. ![image](https://static.lovedata.net/20-06-30-a687eca5fb78d81e08f143ba69b47dc6.png-wm)



## HBase Master和Regionserver的交互；

## HBase的HA,Zookeeper在其中的作用；

## Master宕机的时候,哪些能正常工作,读写数据；

## region分裂的过程?

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

## 

## bulkload原理？

1. HBase BulkLoad批量写入数据实战

   1. > [HBase BulkLoad批量写入数据实战 - 哥不是小萝莉 - 博客园](https://www.cnblogs.com/smartloli/p/9501887.html)

   2. ![image](https://static.lovedata.net/21-06-17-ae9f2d5008d9edfbf10bec552bc9e0b7.png-wm)

   3. hbase底层文件夹格式 " /hbase/data/default/<tbl_name>/<region_id>/\<cf\>/<hfile_id>"

   4. 按照hbase的底层文件存储在hdfs的原理，使用MR直接生成HFile格式的数据文件 然后通过RS将hfile移动到对应的region中去,HFileOutputFormat2.configureIncrementalLoad(job, table);













