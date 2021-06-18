# My Interview

[toc]

## 找靓机

### 20210617电一

1. 对数据中台和数据仓库的理解
2. 对离线数仓的理解？怎么实施？
3. 对实时数仓的理解？怎么实施
4. flink的watermark的理解？是什么？做什么用的？
5. 元数据管理怎么做？



## 平安科技

### 20210616电一

1. 介绍下项目

2. 为什么两套架构并存

3. kylin的cube是怎么构建的？

   1. [kylin的构建原理](/bigdata/kylin/#kylin的构建原理)

4. hbase的bulkload是怎么实现的

   1. [bulkload](/bigdata/hbase/#bulkload)

5. flink是怎么实现仅一次的，如何checkpoint

   1. [Flink中如何保证ExactlyOnce？（上）](/bigdata/flink/Flink实战与性能优化/Flink中如何保证ExactlyOnce？（上）.html)
   2. [Flink中如何保证ExactlyOnce？（下）](/bigdata/flink/Flink实战与性能优化/Flink中如何保证ExactlyOnce？（下）.html)

6. jvm什么时候出发FullGC

   1. [MontorGC,MajorGC,FullGC](/java/jvm内存与垃圾回收/08堆.html#monitor-gc、major-gc、full-gc)
      1. ![image](https://static.lovedata.net/20-11-20-cde2c2d83f91f38ed479ea9d1aefbb7e.png-wm)

7. java的hashmap原理 hash函数是怎么实现的

   1. [HashMap 的工作原理?](/java/java.html#hashmap-的工作原理)

8. linux的上下文切换，切换了什么？

    [上下文切换](/computer/cpu.html#上下文切换)

## YY

### 20181213电一

1. spark 代码层面的优化有做过吗？
2. 时间区间sql 
3. 两个大文件，都是数字，如何取出交集
4. 两个文件，比较是否一致，是否修复



## Sheyin

### 20181213现一

1. hashmap 线程安全吗，为什么线程不安全，
2. hashmap什么时候回线程思索
3. hashmap 和 concurrenthashmap 的区别
4. hbase 删除，什么时候会在磁盘真正删除哟
5. spark rdd 的内部逻辑？
6. impala的架构模型？
7. spark 推测执行



## 货拉拉

### 20181214现一

1. 什么代码让你印象深刻 split
2. 你的职业规划，别被坑了
3. impala的优化 sql优化，配置优化
4. hiveserver2 的配置优化
5. spark 运行过程中常见的错误
6. 为什么用 impala 而不用hive
7. 总的数据量有多少？大概有多少的量
8. 用的什么社区版本？
9. 用的Ambari ，为什么这么选择？ 选型的标准是什么
10. spark 的一些优化
11. hdfs resourcemanager 的ha 高可用，配置的是什么url，客户端该怎么连接这些url哟？
12. hbase hive spark kafka 机器什么时候回出现问题？怎么定位的 ？ 有什么现象？
13. kafka 数据如何保证有序？
14. kafka 一次且仅一次的处理？





## 大宇无限

### 20181214现一

1. 链表的反转 编程
2. spark 算 pv uv 编程
3. 两个数组的合并 编程



## 我来贷

### 20181217现一

1. 如何加快速度
2. 行式 数据库和列式数据库的优缺点
3. flink 如何保证仅一次消费
4. kylin 的合并
5. hbase 如何查询最近一周的订单，怎么设计
6. 讲一下对hbase 的理解
7. 一个keyvalue的查找流程

## vivo

### 20181211现一

1. jvm 对象生存周期
2. spark 内存的划分
3. kylin的优化
4. flink的代码，flink的架构 check point
5. 布隆过滤器实现
6. spark shuffle的原理
7. java类加载原理
8. 定位内存使用过高的问你
9.  es reindex 使用
10. flume flie channel 和 memchannel 的区别
11. spark streaming kafka 两种读取方式的区别
12. lock 和 synchronize 的区别 使用场景

## 有赞

### 20181211现一

1.  布隆过滤器的实现
2. hive 累计积分怎么做的
3. rollup with cube 的实现
4. spark partition 优化



### 20181211HR

1. 领导怎么看你
2. 绩效如何？ 为什么打A 
3. 与其他的区别在哪里，差别在哪里



## 腾讯

### 20180704现一

面试问题：

1. 布隆过滤器的实现原理
2. HyperLog的实现原理
3. Bitmap的实现原理
4. 自己写一个大数据分析平台
5. Mysql 如何实现水平扩容
6. Mongodb如何实现水平扩容
7. 问题全都不知道。我靠





## 友信金融

### 20181205现一

1. 内存溢出了怎么去定位？

   1. [Java内存溢出定位和解决方案（new）](https://www.cnblogs.com/snowwhite/p/9471710.html " ")
   2. [Java 出现内存溢出的定位以及解决方案](https://www.cnblogs.com/zhchoutai/p/7270886.html "")

2. 什么时候会堆栈溢出

3. 线程间如何通讯

   1. CountDownLatch 利用它可以实现类似计数器的功能。比如有一个任务A，它要等待其他4个任务执行完毕之后才能执行，此时就可以利用CountDownLatch来实现这种功能了。

      CyclicBarrier 字面意思回环栅栏，通过它可以实现让**一组线程等待至某个状态之后**再全部同时执行。叫做回环是因为当所有等待线程都被释放以后，**CyclicBarrier可以被重用**。我们暂且把这个状态就叫做barrier，当调用await()方法之后，线程就处于barrier了

      [Java并发编程：CountDownLatch、CyclicBarrier和Semaphore](https://www.cnblogs.com/dolphin0520/p/3920397.html)

      [Java 里如何实现线程间通信](http://www.importnew.com/26850.html)

      [java线程间通信](https://blog.csdn.net/u011514810/article/details/77131296)

4. Hive优化，调优

5. spark 集群 100g内存 有两百g文件，去读取，有什么问题。

6. 1. [内存有限的情况下 Spark 如何处理 T 级别的数据 - abcde - CSDN博客](https://blog.csdn.net/asdfsadfasdfsa/article/details/78606365) 
   2. 只有在用户要求Spark cache该RDD，且storage level要求在内存中cache时，Iterator计算出的结果才会被保留，通过cache manager放入内存池

7. 数据质量监控怎么去做？

8. Hive 列转行

9. 1. [Hive--行转列（Lateral View explode()）和列转行（collect_set() 去重） - Oner.wv的专栏 - CSDN博客](https://blog.csdn.net/Xw_Classmate/article/details/49864095) 
   2. [hive-列转行和行转列 - JThink Blog - CSDN博客](https://blog.csdn.net/JThink_/article/details/38853573) 

10.  map 和hashmap的区别

11. Java 线程和进程的区别，线程通信和进程的通信？





## 其他

### 20180620

#### 问题

1. 字节序 ip 字节序
2. count(distinct ip) 的UDAF函数
3. 排序一百个数据 冒泡排序
4. kafka什么情况下会丢数据
5. 列式存储和行式存储的区别
6. p-1-2-null p2-2-3-null 求和得到 

#### 其他问题

1.  rdd 宽依赖，窄依赖
2. 为什么离职
3. 有什么想问的
4. redis内存满了之后会怎么样
5. 工作内容
6. 有什么输出，有什么收获
7. 覆盖、重载、重写的区别
8. kylin的构建过程
9. 大数据流程



## 阿里巴巴

### 20180801交叉面试

1. 如何做数据迁移？数据整合？
2. 如何做到高可用？ 保证高可用 ？容量的暴增？
3. 职业规划?
4. 每次离职的动机是什么？
5. 其他产品 比如天猫，物流的业务逻辑是什么？









