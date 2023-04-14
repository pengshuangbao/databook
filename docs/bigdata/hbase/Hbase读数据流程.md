# Hbase读数据流程

[toc]

## 参考

1. [图解HBase读取流程-Nosql漫谈](https://mp.weixin.qq.com/s/0wVff17Yl5qLB80vZcQbIQ)
2. [HBase原理－数据读取流程解析](http://hbasefly.com/2016/12/21/hbase-getorscan/)
3. [HBase原理－迟到的‘数据读取流程’部分细节](http://hbasefly.com/2017/06/11/hbase-scan-2/)
4. [一条数据的HBase之旅，简明HBase入门教程-Write全流程-Nosql漫谈](https://mp.weixin.qq.com/s/ctnCm3uLCotgRpozbXmVMg)



## HBase原理－数据读取流程解析

## 

> 查询比较复杂，一是因为整个HBase存储引擎基于LSM-Like树实现   其二是因为HBase中更新操作以及删除操作实现都很简单，更新操作并没有更新原有数据  是插入了一条打上”deleted”标签的数据，而真正的数据删除发生在系统异步执行Major_Compact的时候 但是对于数据读取来说却意味着套上了层层枷锁

![image](https://static.lovedata.net/jpg/2018/6/20/d0f9a3466084169a700b73db005584d6.jpg)

![image](https://static.lovedata.net/jpg/2018/6/20/d358a28eb3558b62c1ee23169f5b0620.jpg)

![客户端缓存RegionServer地址信息](https://static.lovedata.net/jpg/2018/6/20/3f6ec491d3504cbb4a163fa7ff7b0998.jpg)

scan数据就和开发商盖房一样，也是分成两步：组建施工队体系，明确每个工人的职责；一层一层盖楼。

 scanner体系的核心在于三层scanner：RegionScanner、StoreScanner以及StoreFileScanner。三者是层级的关系，一个RegionScanner由多个StoreScanner构成，一张表由多个列族组成，就有多少个StoreScanner负责该列族的数据扫描。一个StoreScanner又是由多个StoreFileScanner组成。每个Store的数据由内存中的MemStore和磁盘上的StoreFile文件组成，相对应的，StoreScanner对象会雇佣一个MemStoreScanner和N个StoreFileScanner来进行实际的数据读取，每个StoreFile文件对应一个StoreFileScanner，注意：StoreFileScanner和MemstoreScanner是整个scan的最终执行者。 

![image](https://static.lovedata.net/jpg/2018/6/20/931c83f325dd513936b66fafdf085282.jpg)

 HBase中KeyValue是什么样的结构？

 ![image](https://static.lovedata.net/jpg/2018/6/20/9d1f2731d5383ed8461fdf2a8908ee8c.jpg)



## 图解HBase读取流程-Nosql漫谈



![image](https://static.lovedata.net/21-06-24-a980e1d378a31f83997a352e603bbee9.png)



![image](https://static.lovedata.net/21-06-24-e04a9ab190bd2340e2315d4679bbc82c.png)



**每一个MemStore中可能涉及一个Active Segment，以及一个或多个Immutable Segments**

![image](https://static.lovedata.net/21-06-24-e02b2e3aa80752094b03343cfe2f5eb2.png)



![image](https://static.lovedata.net/21-06-24-4a2716c56c2e0761503aed899ea9368f.png)





**HFile由Block构成，默认地，用户数据被按序组织成一个个64KB的Block**

**基于一个给定的RowKey，HFile中提供的索引信息能够快速查询到对应的Data Block**。

![image](https://static.lovedata.net/21-06-24-ce61b9c3f3613f9bd4836904bc70aa61.png)



### 读命题

如何从1个或多个列族(1个或多个MemStore Segments+1个或多个HFiles)所构成的Region中读取用户所期望的数据？这些数据默认必须是未被标记删除的、未过期的而且是最新版本的数据。

#### 将Get看作一类特殊的Scan

可以将Get看作是一种特殊的Scan，只不过它的StartRow与StopRow重叠，事实上，RegionServer侧处理Get请求时的确先将Get先转换成了一个Scan操作。



### Scan操作各种Scanner

- 关于一个Region的读取，被封装成一个RegionScanner对象。
- 每一个Store/Column Family的读取操作，被封装在一个StoreScanner对象中。
- SegmentScanner与StoreFileScanner分别用来描述关于MemStore中的Segment以及HFile的读取操作。
- StoreFileScanner中关于HFile的实际读取操作，由HFileScanner完成。



![image](https://static.lovedata.net/21-06-24-5b05029a6640d9310443deee95d59ffa.png)



![image](https://static.lovedata.net/21-06-24-9e75bb80d2b8327a9dcc98a776776310.png)



<mark>  每一个Scanner内部有一个指针指向当前要读取的KeyValue，KeyValueHeap的核心是一个**优先级队列**(**PriorityQueue**)在这个PriorityQueue中，按照每一个Scanner当前指针所指向的KeyValue进行排序</mark>

<mark>同样的，RegionScanner中的多个StoreScanner，也被组织在一个KeyValueHeap对象中：</mark>

![image](https://static.lovedata.net/21-06-24-50525d8c20a4ca4c4e519798c26156f4.png)



### Scanner体系



KeyValueScanner定义了读取KeyValue的基础接口：

![image](https://static.lovedata.net/21-06-24-4ecabdabfc1e1c9046d1b4420c13c7eb.png)



实现了KeyValueScanner接口类的主要Scanner包括：

- StoreFileScanner
- SegmentScanner
- StoreScanner



### Scanner初始化



![image](https://static.lovedata.net/21-06-24-beded7875b969f9c14de93ddc7931bbe.png)



通过next请求获取一个个keyvalue

![image](https://static.lovedata.net/21-06-24-670ac415d463bed50b0efe15cdc3fbd1.png)

每一个Scanner中都有一个current指针指向下一个即将要读取的KeyValue，**KeyValueHeap中的PriorityQueue正是按照<mark>每一个Scanner的current所指向的KeyValue</mark>进行排序**。

下一次next请求，将会返回ScannerB中的KeyValue.....周而复始，直到某一个Scanner所读取的数据耗尽，该Scanner将会被close，不再出现在上面的PriorityQueue中。



#### 多个版本

![image](https://static.lovedata.net/21-06-24-1312054fdd36d80004b5859a8e0e9990.png)





#### 如某次Scan在允许读多个版本的同时，限定了只读取C1~C3

![image](https://static.lovedata.net/21-06-24-f087a2c44c5047f9e56c9c58da3fd88e.png)



#### 最普通的Scan

![image](https://static.lovedata.net/21-06-24-50106e48f4c18e4873030db35bdeb340.png)



### Scanner基础能力



如果只需要当前列的最新版本，那么Scanner应该可以跳过当前列的其它版本，而且将指针移到下一列的开始位置。

如果当前行的所要读取的列都已读完，那么，Scanner应该可以跳过该行剩余的列，将指针移动到下一行的开始位置。



#### 如何决策跳转

**ScanQueryMatcher**

**INCLUDE_AND_SEEK_NEXT_ROW**

*包含当前KeyValue，并提示Scanner当前行已无需继续读取，请Seek到下一行。*

**INCLUDE_AND_SEEK_NEXT_COL**

*包含当前KeyValue，并提示Scanner当前列已无需继续读取，请Seek到下一列。*







