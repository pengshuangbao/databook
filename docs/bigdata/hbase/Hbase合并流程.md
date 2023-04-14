# Hbase合并流程

[toc]

## 参考

1. [HBase Compaction的前生今世－身世之旅 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/07/13/hbase-compaction-1/)
2. [HBase Compaction的前生今世－改造之路 – 有态度的HBase/Spark/BigData](http://hbasefly.com/2016/07/25/hbase-compaction-2/?bilohw=1yhui2)



## HBase Compaction的前生今世－身世之旅-hbasefly

MinorCompaction和MajorCompaction

- Minor Compaction是指选取一些小的、相邻的StoreFile将他们合并成一个更大的StoreFile，在这个过程中不会处理已经Deleted或Expired的Cell。一次Minor Compaction的结果是更少并且更大的StoreFile。
- Major Compaction是指将所有的StoreFile合并成一个StoreFile，这个过程还会清理三类无意义数据：<mark>被删除的数据、TTL过期数据、版本号超过设定版本号的数据。</mark>另外，一般情况下，Major Compaction时间会持续比较长，整个过程会消耗大量系统资源，对上层业务有比较大的影响。因此线上业务都会将关闭自动触发Major Compaction功能，改为手动在业务低峰期触发。



### Compaction流程 

整个Compaction始于特定的触发条件，<mark>比如flush操作、周期性地Compaction检查操作等</mark>

![image](https://static.lovedata.net/21-06-25-921db3b2ce49093cb0e3436d272d8014.png)



#### 触发机制

1. Memstore Flush
   1. memstore flush会产生HFile文件，文件越来越多就需要compact。因此在每次执行完Flush操作之后，都会对当前Store中的文件数进行判断
   2. <mark>在Flush触发条件下，整个Region的所有Store都会执行compact，所以会在短时间内执行多次compaction。</mark>
2. 后台线程周期性检查：后台线程CompactionChecker定期触发检查是否需要执行compaction
3. 手动触发 手动触发compaction通常是为了执行major compaction
   1. 性能考虑
   2. alter表后希望立刻生效
   3. 磁盘容量不够



#### 选择合适HFile合并

最理想的情况是，这些文件承载了大量IO请求但是大小很小，这样compaction本身不会消耗太多IO，而且合并完成之后对读的性能会有显著提升。

排除不满足条件的文件

1. 排除当前正在执行compact的文件及其比这些文件更新的所有文件
2. 排除某些过大的单个文件

再判断是否major

1. 强制执行major compaction
2. 长时间没有进行compact

不满足major compaction条件，就必然为minor compaction



#### **挑选合适的线程池** 

线程内部构造了多个线程池：largeCompactions、smallCompactions以及splits等  ，其中前者用来处理大规模compaction，后者处理小规模compaction。

#### **执行HFile文件合并** 

1. 分别读出待合并hfile文件的KV，并顺序写到位于./tmp目录下的临时文件中
2. 将临时文件移动到对应region的数据目录
3. 将compaction的输入文件路径和输出文件路径封装为KV写入WAL日志，并打上**compaction**标记，最后强制执行sync
4. 将对应region数据目录下的compaction输入文件全部删除

<mark>是很严谨的，具有很强的容错性和完美的幂等性：</mark>

1. 如果RS在步骤2之前发生异常，本次**compaction**会被认为失败，如果继续进行同样的compaction，上次异常对接下来的compaction不会有任何影响，也不会对读写有任何影响。唯一的影响就是**多了一份多余的数据**。

2. 如果RS在步骤2之后、步骤3之前发生异常，同样的，仅仅会多一份冗余数据。

3. 如果在步骤3之后、步骤4之前发生异常，RS在重新打开region之后首先会从WAL中看到标有compaction的日志，因为此时输入文件和输出文件已经持久化到HDFS，因此只需要根据WAL移除掉compaction输入文件即可





## HBase Compaction的前生今世－改造之路-hbasefly

**HBase对于compaction的设计总是会追求一个平衡点，一方面需要保证compaction的基本效果，另一方面又不会带来严重的IO压力**

### 0.96版本中HBase调整

1. 一方面提供了Compaction插件接口 根据自身场景定义
2. 0.96版本之后Compaction可以支持table/cf粒度的策略设置

### 优化compaction的共性特征

- 减少参与compaction的文件数
- 不要合并那些不需要合并的文件
- 小region更有利于compaction：大region会生成大量文件，不利于compaction；相反，小region只会生成少量文件，这些文件合并不会引起很大的IO放大

### FIFO Compaction

参考了[rocksdb的实现](https://github.com/facebook/rocksdb/wiki/FIFO-compaction-style) 选择那些过期的数据文件，即该文件内所有数据都已经过期 对应业务的列族必须设置TTL，否则肯定不适合该策略

策略： 收集所有已经过期的文件并删除 

#### 适用场景

1. 大量短时间存储的原始数据，比如推荐业务 nginx 日志；
2.  所有数据能够全部加载到block cache 假如HBase有1T大小的SSD作为block cache，理论上就完全不需要做合并，因为所有读操作都是内存操作。



### Tier-Based Compaction

根据候选文件的新老程度将其分为多个不同的等级，每个等级都有对应等级的参数，比如参数Compation Ratio，表示该等级文件选择时的选择几率，Ratio越大，该等级的文件越有可能被选中参与Compaction。而等级数、每个等级参数都可以通过CF属性在线更新

### Stripe Compaction

major compaction都是无法绕过的，很多业务都会执行delete/update操作，并设置TTL和Version，这样就需要通过执行major compaction清理被删除的数据以及过期版本数据、过期TTL数据。

为了彻底消除major compaction所带来的影响，hbase社区提出了strip compaction方案。

解决major compaction的最直接办法是减少region的大小，最好整个集群都是由很多小region组成，这样参与compaction的文件总大小就必然不会太大。可是，region设置小会导致region数量很多，这一方面会导致hbase管理region的开销很大，另一方面，region过多也要求hbase能够分配出来更多的内存作为memstore使用，否则有可能导致整个regionserver级别的flush，进而引起长时间的写阻塞。因此单纯地通过将region大小设置过小并不能本质解决问题。

stripe compaction会将整个store中的文件按照Key划分为多个Range，在这里称为stripe，stripe的数量可以通过参数设定，相邻的stripe之间key不会重合。实际上在概念上来看这个stripe类似于sub-region的概念，即将一个大region切分成了很多小的sub-region。

随着数据写入，memstore执行flush之后形成hfile，这些hfile并不会马上写入对应的stripe，而是放到一个称为L0的地方，用户可以配置L0可以放置hfile的数量。

一旦L0放置的文件数超过设定值，系统就会将这些hfile写入对应的stripe：**首先读出hfile的KVs，再根据KV的key定位到具体的stripe**，**将该KV插入对应stripe的文件中**即可，如下图所示。之前说过stripe就是一个个小的region，所以在stripe内部，依然会像正常**region一样执行minor compaction和major compaction**，可以预想到，stripe内部的major compaction并不会太多消耗系统资源。另外，数据读取也很简单，系统可以根据对应的Key查找到对应的stripe，然后在stripe内部执行查找，因为stripe内数据量相对很小，所以也会一定程度上提升数据查找性能。



#### 擅长的业务

1. 大Region。小region没有必要切分为stripes，一旦切分，反而会带来额外的管理开销。一般默认如果region大小小于2G，就不适合使用stripe compaction。
2. RowKey具有统一格式，stripe compaction要求所有数据按照Key进行切分，切分为多个stripe。如果rowkey不具有统一格式的话，无法进行切分。

### **Limit Compaction Speed** 

该优化方案通过感知Compaction的压力情况自动调节系统的Compaction吞吐量，在压力大的时候降低合并吞吐量，压力小的时候增加合并吞吐量。基本原理为：
1. 在正常情况下，用户需要设置吞吐量下限参数“hbase.hstore.compaction.throughput.lower.bound”(默认10MB/sec) 和上限参数“hbase.hstore.compaction.throughput.higher.bound”(默认20MB/sec)，而hbase实际会工作在吞吐量为lower + (higer – lower) * ratio的情况下，其中ratio是一个取值范围在0到1的小数，它由当前store中待参与compation的file数量决定，数量越多，ratio越小，反之越大。
2. 如果当前store中hfile的数量太多，并且超过了参数blockingFileCount，此时所有写请求就会阻塞等待compaction完成，这种场景下上述限制会自动失效。









































