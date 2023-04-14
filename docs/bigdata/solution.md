# 解决方案

[toc]

## 数据架构方案

### 贝壳基于Druid的OLAP引擎应用实践

[贝壳基于Druid的OLAP引擎应用实践](https://mp.weixin.qq.com/s/girNB7c_5jM2-TPCCIkc3Q)

#### 架构

![image](https://static.lovedata.net/21-04-02-ab0d9a731b82a6148c2ba11049d2f1d7.png)

#### Druid替换kylin原因

![image](https://static.lovedata.net/21-04-02-24afa1a4d3d5f28cbc57a9c8028e8112.png)

![image](https://static.lovedata.net/21-04-02-15da3c7c9541a8c436e73b5a81f0fc56.png)

![image](https://static.lovedata.net/21-04-02-e2e0ef29339b61827aa6f7a2170c5bea.png)



#### Druid架构

![image](https://static.lovedata.net/21-04-02-3a1f1e7b9cedb2222838c3e017005a2e.png)



### 大数据量漏斗查询

[每天数百亿用户行为数据，美团点评怎么实现秒级转化分析？ - 美团技术团队](https://tech.meituan.com/2018/03/20/user-funnel-analysis-design-build.html)

### Impala + Kudu 

Kudu+Impala为实时数据仓库存储提供了良好的解决方案。这套架构在支持随机读写的同时还能保持良好的Scan性能，同时其对Spark等流式计算框架有官方的客户端支持。这些特性意味着数据可以从Spark实时计算中实时的写入Kudu，上层的Impala提供BI分析SQL查询，对于数据挖掘和算法等需求可以在Spark迭代计算框架上直接操作Kudu底层数据。

[使用Apache Kudu和Impala实现存储分层 - 大鹏的个人空间 - OSCHINA - 中文开源技术交流社区](https://my.oschina.net/dabird/blog/3051625)

### 得到的实时大数据运营设计

> [第16期实录：用户分群 -- 得到实时大数据运营探索](https://mp.weixin.qq.com/s/yz3GCgAY1t8cTbviaNtnFQ)

 ![image](https://static.lovedata.net/20-07-03-cd6ce673112f45040cb8aeb138acd3e3.png)

###  Merge流程

1. 首先对Binlog按 **主键+事件类型** group by，取出**delete** 事件与**存量数据**进行left outer join，这样就从存量数据中剔除了删除数据；
2. 对剩余Binlog数据进行二次筛选，按主键 **group by 取最新的Binlog**，无论是**insert或是update**；
3. 将步骤2中生成的数据与存量数据合并，生成最新数据。如图中的黄色的1、2是受Binlog的update重放影响的，绿色的4是insert新增的。

![image](https://static.lovedata.net/20-07-03-d99d464e7c25bea52f2cd0e3dfc879a5.png)

![image](https://static.lovedata.net/20-07-03-174c85904728226c3d499924c23d9ef5.png)





## 数据同步

### Flink + Canal  增量同步

[基于Canal与Flink实现数据实时增量同步(一)]([https://jiamaoxiang.top/2020/03/05/%E5%9F%BA%E4%BA%8ECanal%E4%B8%8EFlink%E5%AE%9E%E7%8E%B0%E6%95%B0%E6%8D%AE%E5%AE%9E%E6%97%B6%E5%A2%9E%E9%87%8F%E5%90%8C%E6%AD%A5-%E4%B8%80/](https://jiamaoxiang.top/2020/03/05/基于Canal与Flink实现数据实时增量同步-一/))

[基于Canal与Flink实现数据实时增量同步(二) | Jmx's Blog](https://jiamaoxiang.top/2020/03/24/%E5%9F%BA%E4%BA%8ECanal%E4%B8%8EFlink%E5%AE%9E%E7%8E%B0%E6%95%B0%E6%8D%AE%E5%AE%9E%E6%97%B6%E5%A2%9E%E9%87%8F%E5%90%8C%E6%AD%A5-%E4%BA%8C/)

### Mysql数据同步到数据仓库

[美团DB数据同步到数据仓库的架构与实践 - 美团技术团队](https://tech.meituan.com/2018/12/06/binlog-dw.html)

![image](https://static.lovedata.net/21-03-30-cb3b5841fe59a7c647565c1c07d3f538.png)

[Apache Flink 中文用户邮件列表 - flink mysql cdc + hive streaming疑问](http://apache-flink.147419.n8.nabble.com/flink-mysql-cdc-hive-streaming-td8223.html)

[canal初体验 - 同步binlog到hive | 鱼儿的博客](https://yuerblog.cc/2020/12/30/canal%E5%88%9D%E4%BD%93%E9%AA%8C-%E5%90%8C%E6%AD%A5binlog%E5%88%B0hive/)

 	1. 增量同步
 	2. 使用hive进行合并 rownum over 



