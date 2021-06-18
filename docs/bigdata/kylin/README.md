# Kylin

[toc]

## kylin 概述

Hadoop平台上的开源OLAP引擎,多维立方体预计算技术，将sql提升到亚秒级别

![image](https://static.lovedata.net/jpg/2018/7/4/4bb2dc72ea9e7c1ca0fe7f39b39ee58a.jpg-wm)

空间换时间，线性增加的资源需求到线性降低的查询时间

## kylin的构建原理

1. Apache Kylin Cube 构建原理

   1. > [编程小梦|Apache Kylin Cube 构建原理](https://blog.bcmeng.com/post/kylin-cube.html)

   2. ![image](https://static.lovedata.net/jpg/2018/7/10/05133de3b393e6366d11797a2386987b.jpg-wm)

   3. ![image](https://static.lovedata.net/jpg/2018/7/10/da963f940d5ec0716df33433d0d5811d.jpg-wm)

1. Apache Kylin On Druid Storage 原理与实践

   1. > [编程小梦|Apache Kylin On Druid Storage 原理与实践](https://blog.bcmeng.com/post/kylin-on-druid-storage.html#4-%E7%A7%BB%E9%99%A4kylin%E6%9F%A5%E8%AF%A2%E6%97%B6%E7%9A%84%E6%A0%B8%E5%BF%83%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84gtrecord)

2. Kylin构建Cube过程详解

   1. >  [Kylin构建Cube过程详解](https://juejin.cn/post/6844903967671975943)

   2. 理念：空间换时间

   3. HTable对应的RowKey，就是各种维度组合，指标存在Column中

   4. 将不同维度组合查询SQL，转换成基于RowKey的范围扫描，然后对指标进行汇总计算，以实现快速分析查询

   5. ![image](https://static.lovedata.net/21-06-17-fae29d95e812359f8bce6d36a5c0b199.png-wm)

   6. 步骤：

      1. 创建Hive事实表中间表。hive 外部表。根据cube定义，查询出度量 维度 插入到新表去
      2.  重新分配中间表 文件的有的大有的小，不均匀，重分区，一百万行一个文件
      3. 提取事实表不同列值。计算出每一个出现在事实表中的维度列的distinct值 写入文件，如果有的列dinstinct值过大，就会OOM
      4. 创建维度字典 上一步生成的distinct column文件和维度表计算出所有维度的子典信息，并以字典树的方式压缩编码，生成维度字典，目的是节约空间
      5. 保存Cuboid的统计信息
      6. 创建HTable。 列族的设置，默认是一个列族， 默认使用lzo压缩 kylin强依赖于HBase的coprocessor，所以需要在创建HTable为该表部署coprocessor，这个文件会首先上传到HBase所在的HDFS上，然后在表的元信息中关联
      7. 构建 spark or mr ，由底层向顶层构建，直到一个不带group by的sql
      8. 将Cuboid数据转换成HFile 接口插入性能差，使用 将Cuboid数据转换成HFile， bulkLoad的方式将文件和HTable进行关联，这样可以大大降低Hbase的负载
      9. 导HFile入HBase表 将HFile文件load到HTable中，这一步完全依赖于HBase的工具
         1. key的格式由cuboid编号+每一个成员在字典树的id组成，value可能保存在多个列组里，包含在原始数据中按照这几个成员进行GROUP BY计算出的度量的值
      10. 更新Cube信息
      11. 清理

## kylin的查询流程?

1. Kylin执行查询流程分析

   1. > [Kylin执行查询流程分析 - CSDN博客](https://blog.csdn.net/yu616568/article/details/50838504)