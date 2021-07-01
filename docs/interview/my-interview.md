# 我的面经

[toc]



## 字节跳动

### 20210623视一

1. flink的状态机制？
2. flink的状态是怎么存储的？怎么持久化的？
3. flink 状态修改了是怎么处理的？
4. flink怎么实现反压的？
5. flink的两阶段提交是怎么实现的？
6. kafka的事物是怎么处理？flink是怎么实现的？ 
   1. 参考
      1. [Kafka 事务性之幂等性实现 | Matt's Blog](http://matt33.com/2018/10/24/kafka-idempotent/#%E5%B9%82%E7%AD%89%E6%80%A7%E8%A6%81%E8%A7%A3%E5%86%B3%E7%9A%84%E9%97%AE%E9%A2%98)
      2. [Kafka Exactly-Once 之事务性实现 | Matt's Blog](http://matt33.com/2018/11/04/kafka-transaction/)
7. 事物的原理？什么是事物？特性怎么实现的？
8. hbase的读数据流程？
   1. [Hbase读数据流程-databook](/bigdata/hbase/Hbase读数据流程)
9. blockcache是干什么的？
10. hbase对于不同版本的key是怎么合并的？
    1. 参考
       1. [一条数据的HBase之旅，简明HBase入门教程-Flush与Compaction-Nosql漫谈](https://mp.weixin.qq.com/s/ctnCm3uLCotgRpozbXmVMg)
11. 项目中有做过什么关于hdfs和yarn的优化？

## OPPO

### 20210621视一

1. flink 状态的序列化和反序列化机制，增加算子后，怎么扩容

   1. 参考
      1. [什么是 Flink State Evolution? | 时间与精神的小屋](http://www.whitewood.me/2019/03/17/%E4%BB%80%E4%B9%88%E6%98%AF-Flink-State-Evolution/)
   2. Kyro 快速高效的java序列化框架，可以自动执行深度拷贝（克隆） 浅拷贝
   3. 参考书上的

2. java的序列化和反序列化有什么问题？

   1. 必须实现Serializable，使用ObjectInputStream 和 ObjectOutputStream
   2. JAVA自带的序列化框架，不支持跨语言的序列化和反序列化
   3. 不用借助其他类包，但是语法生硬，比较难
   4. 通过serialVersionUID控制序列化版本，如果版本不一致，会抛出异常，如果没有定义，是通过jdk hash生成，所以容易导致不一致
   5. 性能非常一般
   6. 参考
      1. [几种Java常用序列化框架的选型与对比 - SegmentFault 思否](https://segmentfault.com/a/1190000039934578)

3. flink 的反压有了解过吗

   1. [如何处理FlinkJobBackPressure（反压）问题](/bigdata/flink/Flink实战与性能优化/如何处理FlinkJobBackPressure（反压）问题？.html)

4. flink状态存储类型

   1. [如何选择Flink状态后端存储](/bigdata/flink/Flink实战与性能优化/如何选择Flink状态后端存储.html)

5. flink的双流join有了解过吗？ 在生产中会有什么问题？

   1. 参考

      1. [Flink SQL 实战：双流 join 场景应用-阿里云开发者社区](https://developer.aliyun.com/article/780048)

   2. regular join 

      1. 最通用的Join类型，不支持窗口是时间属性

      2. 任何一侧有数据流更改都是可见的

      3. 如果一侧有新数据，就会将另一侧所有的过去的和将来的数据合并在一起，因为regular join 没有提出策略

      4. 支持数据流的任何更新操作

      5. 支持离线场景和小数据量场景

      6. ```sql
         SELECT columns
         FROM t1  [AS <alias1>]
         [LEFT/INNER/FULL OUTER] JOIN t2
         ON t1.column1 = t2.key-name1
         ```

   3. interval join

      1. 利用窗口给两个输入表的Join设定一个世间界限，超过时间范围的数据对join不可见，并可以被清理掉

      2. 避免需要大量的资源和没有剔除数据造成的结果误差

      3. 需要定义时间属性字段 PT 或者 ET

      4. inner ,left outer, right outer , full outer 

      5. 只需要缓存时间边界内的数据，占用空间小，结果更精确

      6. ```sql
         -- 写法1
         SELECT columns
         FROM t1  [AS <alias1>]
         [LEFT/INNER/FULL OUTER] JOIN t2
         ON t1.column1 = t2.key-name1 AND t1.timestamp BETWEEN t2.timestamp  AND  BETWEEN t2.timestamp + + INTERVAL '10' MINUTE;
         
         -- 写法2
         SELECT columns
         FROM t1  [AS <alias1>]
         [LEFT/INNER/FULL OUTER] JOIN t2
         ON t1.column1 = t2.key-name1 AND t2.timestamp <= t1.timestamp and t1.timestamp <=  t2.timestamp + + INTERVAL ’10' MINUTE ;
         ```

      7. 适用于双流Join

   4. temproal table join

      1. interval join 更准确，资源占用更小，但是有个问题，两个join，必须要有时间属性，需要明确时间的下界，用来提出数据

      2. 不适合维度join，因为维度join没有时间界限

      3. regular join 和interval join的两侧是平等的，任何一侧的更新都会跟另外一侧的历史记录去进行匹配，

      4. temproal table 的更新对另一表在该时间之前的记录是不可见的

      5. ```sql
         SELECT columns
         FROM t1  [AS <alias1>]
         [LEFT] JOIN t2 FOR SYSTEM_TIME AS OF t1.proctime [AS <alias2>]
         ON t1.column1 = t2.key-name1
         ```

         

6. mysql的聚族索引和普通索引的区别 ？

   1. 参考

      1. [说一下聚簇索引 & 非聚簇索引](https://juejin.cn/post/6844903845554814983)

   2. ```
      普通索引：没有限制
      CREATE INDEX indexName ON tablename(column1[,column2,……])
      
      唯一索引：不允许重复，允许空值
      CREATE UNIQUE INDEX indName ON tablename(column1[,column2,……])
      
      主键索引： 一种特殊的唯一索引，不允许有空值，一般是在建表的时候指定了主键，就会创建主键索引。
      CREATEINDEX indName ON tablename(column1[,column2,……])
      
      组合索引：多个列的索引组合起来
      全文索引：FULLTEXT，目前只有Innodb和MyISAM引擎主持，在全文搜索，仅适用于 CHAR， VARCHAR和 TEXT列。
      ```

   3. B+树是mysql的数据结构，数据是存储在叶子结点上，非叶子结点只存储key

   4. 聚族索引和非聚族索引是由索引的顺序是否和索引的物理数据顺序相同来共同决定的，是，则是聚族索引

   5. “聚簇”的意思是数据行被按照一定顺序一个个紧密地排列在一起存储

   6. InnoDB的默认数据结构是聚簇索引，而MyISAM是非聚簇索引。

   7. 不仅仅是一种索引类型，而是一种数据存储方式

   8. 一张表只允许有一个聚族索引

7. spring mvc 和 spring boot的区别？

8. kudu做了什么优化？

   1. 参考
      1. [impala + kudu一些优化心得 - 简书](https://www.jianshu.com/p/a49e68c0015b)
   2. --memory_limit_hard_bytes 能大就大
   3. --maintenance_manager_num_threads 提高数据从内存写入磁盘的效率
   4. compute stats  
   5. 慢sql 要 explain ，有没有 kudu predicates 执行summray命令，重点查看单点峰值内存和时间比较大的点，对相关的表做优化，解决数据倾斜问题
   6. 

9. java怎么实现线程安全的？

   1. 参考：

      1. [07 | 安全性、活跃性以及性能问题-极客时间](https://time.geekbang.org/column/article/85702)

   2. 什么是线程安全呢？其实本质上就是正确性，而正确性的含义就是**程序按照我们期望的执行**，不要让我们感到意外。

   3. 并发 Bug 的三个主要源头：**原子性问题、可见性问题和有序性问题**

   4. 理论上线程安全的程序，就要**避免出现原子性问题、可见性问题和有序性问题。**

   5. **存在共享数据并且该数据会发生变化，通俗地讲就是有多个线程会同时读写同一数据** 就需要分析上面的问题，例如 例如线程本地存储（Thread Local Storage，TLS）、不变模式等等

   6. 当多个线程同时访问同一数据，并且至少有一个线程会写这个数据的时候，如果我们不采取防护措施，那么就会导致并发 Bug，对此还有一个专业的术语，叫做数据竞争

   7. **竞态条件（Race Condition）**。所谓竞态条件，指的是程序的执行结果依赖线程执行的顺序

   8. 理解竞态条件。在并发场景中，程序的执行依赖于某个状态变量，也就是类似于下面这样：

      1. ```java
         
         if (状态变量 满足 执行条件) {
           执行操作
         }
         ```

   9. 都可以采用互斥的方法解决，统一归为**锁**

   10. 性能问题

       1. 使用无锁的算法和数据结构了。
       2. 减少锁持有的时间
          1. 细粒度的锁，一个典型的例子就是 Java 并发包里的 ConcurrentHashMap
          2. 读写锁，读不用加锁

10. mysql binlog的格式？

11. java锁的AQS有了解过吗？

    1. AQS(AbstractQueuedSynchronizer 抽象队列同步器)
    2. AQS内部维护一个state状态位，尝试加锁的时候通过CAS(CompareAndSwap)修改值，如果成功设置为 1，并且把当前线程ID赋值，则代表加锁成功，一旦获取到锁，其他的线程将会被阻塞进入阻塞队列自 旋，获得锁的线程释放锁的时候将会唤醒阻塞队列中的线程，释放锁的时候则会把state重新置为0，同 时当前线程ID置为空。
    3. ![image](https://static.lovedata.net/21-06-22-3818fbf53d6df1979625a66de8db4b3a.png-wm)

## 富途

### 20210622电一

1. java的反射机制是怎样的

2. flink的checkpoint 机制？

3. hbase的读写流程？

4. java的hashmap实现原理？

5. kafka是如何实现高可用的？

6. **两个有序的数组，怎么找到中位数？**

   1. 参考

      1. 

   2. 这个题目非常复杂，就是想到了先归并，然后在去中位数

   3. ```java
      //前提是两个有序数组，有序数组（如此）可直接用此方法
      func sortArray(arr1: [Int], arr2: [Int]) -> [Int] {
          var resultArray: [Int] = []
          var index1 = 0
          var index2 = 0
          while index1 < arr1.count && index2 < arr2.count {
              if arr1[index1] < arr2[index2] {
                  resultArray.append(arr1[index1])
                  index1 += 1
              } else {
                  resultArray.append(arr2[index2])
                  index2 += 1
              }     
          }
          while index1 < arr1.count {
              resultArray.append(arr1[index1])
              index1 += 1
          }
          while index2 < arr2.count {
              resultArray.append(arr2[index2])
              index2 += 1
          }
          return resultArray
      }
      ```

7. **一个数组长度为n，怎么找到其中随机的m个数？**

   1. 参考

      1. [写一个函数，随机地从大小为n的数组中选取m个整数。要求每个元素被选中的概率相等](https://my.oschina.net/u/2822116/blog/795323)

   2. ```java
         public static int[] selectM(int[] arr,int m){  
              int len=arr.length;  
              if(m>arr.length)  
                  throw new RuntimeException("e");  
              int[] res=new int[m];  
              for(int i=0;i<m;i++){  
                  //核心关键在下面这行代码，为什么要len-i，因为要依次缩小这个随机数的范围 i++ len-i 就越来越小
                  // 后面为什么要 len-1-random,因为，上面 Random().nextInt(len-i)得到的是 0 到 len-i 这个范围内的
                  // 所以 len -1 - (random) 得到的就是 i 到 len-1 这个范围内的啦
                  int randomIndex=len-1-new Random().nextInt(len-i);  
                  res[i]=arr[randomIndex];  
                  int tmp=arr[randomIndex];  
                  arr[randomIndex]=arr[i];  
                  arr[i]=tmp;  
           }  
           return res;  
       }  
      ```

8. linux的常用命令

9. 怎么查看当前cpu 磁盘 内存的 负载情况

10. 怎么查看端口的？

## 深信服

### 20210618电一

1. flink如何实现精准一次消费？

2. hive是怎么转换为MR程序的？

   1. [Hive底层执行逻辑深度剖析](/bigdata/hive/Hive底层执行逻辑深度剖析.html)

3. kylin的构建原理？

   1. [kylin的构建原理](/bigdata/kylin/#kylin的构建原理)

4. CMS 和 G1垃圾回收器的差别？

5. 一个数组四千个数字，除了两个是单独的数，其他都是成对出现的，怎么找出这单独的两个数？

   1. 参考

      1. [剑指offer：一个整型数组里除了两个数字之外，其他的数字都出现了两次。请写程序找出这两个只出现一次的数字](https://blog.csdn.net/gaozhuang63/article/details/108873633)

   2. 首先：位运算中异或的性质：两个相同数字异或=0，一个数和0异或还是它本身。

      当只有一个数出现一次时，我们把数组中所有的数，依次异或运算，最后剩下的就是落单的数，因为成对儿出现的都抵消了。

      依照这个思路，我们来看两个数（我们假设是AB）出现一次的数组。我们首先还是先异或，剩下的数字肯定是A、B异或的结果，这个结果的二进制中的1，表现的是A和B的不同的位。我们就取第一个1所在的位数，假设是第3位，接着把原数组分成两组，分组标准是第3位是否为1。如此，相同的数肯定在一个组，因为相同数字所有位都相同，而不同的数，肯定不在一组。然后把这两个组按照最开始的思路，依次异或，剩余的两个结果就是这两个只出现一次的数字。

      ```java
      public class Solution {
          public void FindNumsAppearOnce(int [] array,int num1[] , int num2[]) {        
              int result = 0;
              int len = array.length;
              for(int i = 0 ; i < len ; i++){
                  result ^=array[i];
              }        
              int index = findFirst1(result);        
              for(int i = 0; i<len ; i++){
                  if(isBit1(array[i] , index)){
                      num1[0] ^=array[i];
                  }else{
                      num2[0] ^= array[i];
                  }
              }
          }    
          private int findFirst1(int bitResult){
              int index = 0;
              while(((bitResult & 1) == 0) && index <32){
                  bitResult >>= 1;
                  index++;
              }
              return index;
          }    
          private boolean isBit1(int target, int index){
              return((target >> index)&1) ==1;
          }
      }
      ```

      

   3. 衍生题目，只有一个是不一样的，怎么找出来？

      1. 参考

         1. [136. 只出现一次的数字](https://leetcode-cn.com/problems/single-number/solution/zhi-chu-xian-yi-ci-de-shu-zi-by-leetcode-solution/)

      2. 不考虑时间复杂度和空间复杂度

         1. 集合存储数字，遍历，没有就加入，有就删除，到最后剩下的就是
         2. 哈希表存储 次数
         3. 集合存储数组，计算数组元素只和，在用集合数字的两倍减去数组只和，就是剩下的数

      3. Leetcode

         1. 位运算，异或运算 \oplus⊕ 异或运算有以下特性

            1. 任何数和 00 做异或运算，结果仍然是原来的数，
            2. 任何数和其自身做异或运算，结果是 00，
            3. 异或运算满足交换律和结合律，
            4. ![image](https://static.lovedata.net/21-06-23-e8542f3923427caec4ccd5d9357b92d6.png-wm)

         2. ```java
            class Solution {
                public int singleNumber(int[] nums) {
                    int single = 0;
                    for (int num : nums) {
                        single ^= num;
                    }
                    return single;
                }
            }	
            ```

      



### 20210620视二

1. Arraylist的add方法实现
2. jvm相关
3. 1. gc原理
   2. 垃圾回收器
   3. 生产问题怎么定位
4. kylin的构建原理，发展趋势
5. kylin的不足
6. 选择impala+kudu的原因
7. hive可以被替换吗？



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









