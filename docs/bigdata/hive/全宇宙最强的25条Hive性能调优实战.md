

# 全宇宙最强的25条Hive性能调优实战

[toc]

## Hive介绍

![image](https://static.lovedata.net/21-05-28-542d36d9735162c96429d0463fbd6686.png-wm)

### 总结

1、Hive的内置四大组件(Driver， Compiler, optimizer, Executor) 完成HQL到MapReduce的转换
2、在Hive执行HQL编译过程中，会从元数据库获取表结构和数据存储目录等相关信息
3、Hive 只是完成对存储在HDFS上的结构化数据的管理，并提供一种类SQL 的操作方式来进行海量数据运行，底层支持多
种分布式计算引擎。

## 调优概述

Hive作为大数据领域常用的数据仓库组件,在平时设计和查询时要特别注意效率。影响Hive效率的几乎从不是数据量过大，而是**数据倾斜、数据冗余、Job或I/0过多、 MapReduce 分配不合理**等等。对Hive的调优既包含Hive的建表设计方面，对HiveHQL语句本身的优化，也包含Hive配置参数和底层引擎MapReduce方面的调整。

所以此次调优主要分为以下四个方面展开:
1、Hive的建表设计层面
2、HQL语法和运行参数层面
3、Hive架构层面
4、Hive数据倾斜

**总之，Hive调优的作用:在保证业务结果不变的前提下，降低资源的使用量，减少任务的执行时间。**



## .调优须知

1、对于大数据计算引|擎来说**:数据量大不是问题，数据倾斜是个问题**。
2、Hive的复 杂HQL底层会转换成多个MapReduce Job并行或者串行执行，**Job数比较多的作业运行效率相对比较**
**低**，比如即使只有几百行数据的表,如果多次关联多次汇总,产生十几个job,耗时很长。原因是MapReduce作
业初始化的时间是比较长的。
3、在进行Hive大数据分析时，常见的聚合操作比如sum，count, max, min, UDAF等，不怕数据倾斜问题,
MapReduce在Mappe阶段的**预聚合**操作，使数据倾斜不成问题。
4、好的**建表设计，模型设计**事半功倍。
5、设置**合理的MapReduce的Task并行度**，能有效提升性能。(比如， 10w+数据量级别的计算,用100个.
reduceTask,那是相当的浪费，1个足够，但是如果是亿级别的数据量,那么1个Task又显得捉襟见肘)
6、**了解数据分布**，自己动手解决数据倾斜问题是个不错的选择。这是通用的算法优化,但算法优化有时不能适应
特定业务背景，开发人员了解业务，了解数据，可以通过业务逻辑精确有效的解决数据倾斜问题。
7、数据量较大的情况下，慎用**count(distinct), group by**容易产生倾斜问题。
8、对**小文件进行合并**，是行之有效的提高调度效率的方法，假如所有的作业设置合理的文件数,对任务的整体调
度效率也会产生积极的正向影响
9、优化时把握整体，**单个作业最优不如整体最优。**



## Hive建表设计层面

关于hive的表的类型有哪些?
1、分区表
2、分桶表

Hive的建表设计层面调优，主要讲的怎么样合理的组织数据，方便后续的高效计算。比如建表的类型，文件存储
格式，是否压缩等等。

### 利用分区表优化

分区表是在某一个或者几个维度 上对数据进行分类存储，一个分区对应一个目录。如果筛选条件里有分区字段,那么Hive只需要遍历对应分区目录下的文件即可，不需要遍历全局数据，使得处理的数据量大大减少，从而提高查询效率。

也就是说:当-一个Hive表的查询大多数情况下，会根据某一个字段进行筛选时， 那么非常适合创建为分区表，该字段即为分区字段。

在创建表时通过启用partitioned by实现，用来partition的维度并不是实际数据的某一-列， 具体分区的标志是由插入内容时给定的。当要查询某一分区的内容时可以采用where语句，形似where tabTename. partition_ column = a来实现。



#### 1、创建含分区的表:

```sql
CREATE TABLE page_ _view(viewTime INT, userid BIGINT ,
page_ url STRING, referrer. _url STRING,
ip STRING COMMENT 'IP Address of the User')
PARTITIONED BY(date STRING, country STRpING)
ROW FORMAT DELIMITED FIELDS TERMINATED BY' 1'
STORED AS TEXTFILE;
```

#### 2、载入内容，并指定分区标志:

```sql
1oad data 1ocal inpath ' /home/bi gdata/pv_ _2018-07-08_ _us. txt' into table page_ _view
partition(date= ' 2018-07-08', country='us');
```



#### 3、查询指定标志的分区内容:

```sql
SELECT page_ views.* FROM page_ vi ews
WHERE page_ views.date >= ' 2008-03-01'
AND page_ views.date <=' 2008-03-31' I
AND page_ views. referrer. _ur1 1ike ' %xyz. com';
```



简单总结:
1、当你意识到一个字段经常用来做where，建分区表，使用这个字段当做分区字段
2、在查询的时候，使用分区字段来过滤，就可以避免全表扫描。只需要扫描这张表的一个分区的数据即可



### 利用分桶表优化

跟分区的概念很相似，都是把数据分成多个不同的类别，区别就是规则不- -样!
1、分区:按照字段值来进行:一个分区，就只是包含这个这一个值的所有记录 不是当前分区的数据一定不在当前分区当前分区也只会包含当前这个分区值的数据
2、分桶:默认规则: Hash散列. 一个分桶中会有多个不同的值. 如果一个分桶中，包含了某个值，这个值的所有记录，必然都在这个分桶


Hive Bucket,分桶，是指将数据以指定列的值为key进行hash, hash 到指定数目的桶中，这样做的目的和分区表类似，使得筛选时不用全局遍历所有的数据，只需要遍历所在桶就可以了。这样也可以支持高效采样。

1、采样
2、join

如下例就是以userid这一-列为 bucket的依据，共设置32个buckets

```sql
CREATE TABLE page_view(viewTime INT, userid BIGINT ,
page_url STRING, referrer. _url STRING,
ip STRING COMMENT' IP Address of the User' )
COMMENT' This is the page view table '
PARTITIONED BY(dt STRING, country STRING)
CLUSTERED BY(userid) SORTED JBY(viewTime) INTO 32 BUCKETS
ROW FORMAT DELIMITED
FIELDS TERMINATED BY' 1
COLLECTION ITEMS TERMINATED BY' 2 '
MAP KEYS TERMINATED BY' 3 '
STORED AS SEQUENCEFILE;
```



分桶的语法:
CLUSTERED BY(userid) SORTED BY(viewTime) INTO 32 BUCKETS

CLUSTERED BY(userid) 表示按照userid 来分桶

SORTED BY(viewTime) 按照viewtime来进行桶内排序

INTO 32 BUCKETS   分成多少个桶

两个表以相同方式(相同字段)划分桶，两个表的桶个数是倍数关系

```sql
create table order(cid int,price f1oat) clusteredyby(cid) into 32 buckets;
create table customer(id int,first string) clustered by(id) into 32 buckets;
select price from order t join customer s on t.cid = s.id
```



总结三种采祥方式:

```sql

分桶抽祥:
select * from student tab 1esamp1e(bucket 3 out of 32);
随机采祥: randO函数
select * from student order by rand( limit 100;
//效率低
select * from student distribute by randO sort by randO limit 100; // 推荐使用込神
数据抉抽祥: tablesamp1eO 函数
select * from student tab1esamp1e(10 percent); #百分比
select * from student tab1esamp1e(5 rows); #行数
select * from student tab1esamp1e(5 M) ; #大小
```



### 选择合适的文件存储格式

在HiveSQL的create table 语句中，可以使用stored as ... 指定表的存储格式。Apache Hive支持Apache Hadoop中使用的几种熟悉的文件格式，比如TextFile、SequenceFile、 RCFile、 Avro、 ORC、ParguetFile等。

存储格式一般需要根据业务进行选择,在我们的实操中,绝大多数表都采用TextFile与Parquet两种存储格式之一。TextFile是 最简单的存储格式，它是纯文本记录，也是Hive的默认格式。虽然它的磁盘开销比较大，查询效率也低，但它更多地是作为跳板来使用。RCFile、 ORC、 Parquet等格式的表都不能由文件直接导入数据，必须由TextFile来做中转。Parquet和ORC都是Apache旗 下的开源列式存储格式。列式存储比起传统的行式存储更适合批量OLAP查询，并且也支持更好的压缩和编码。

创建表时，特别是宽表，**尽量使用ORC、PargquetFile 这些列式存储格式**，因为列式存储的表，每一-列的数
据在物理.上是存储在一起的，Hive查询时会 只遍历需要列数据，大大减少处理的数据量。



第一种: TextFile 
1、存储方式:行存储。默认格式，如果建表时不指定默认为此格式。，
2、每一行都是一条记录，每行都以换行符"\n"结尾。数据不做压缩时，磁盘会开销比较大，数据解析开销也比较大。
3、可结合Gzip、Bzip2等压缩方式一起使用(系统会自动检查，查询时会自动解压) ,推荐选用可切分的压缩算法。

第二种: Sequence File
1、一种Hadoop API提供的二进制文件，使用方便、可分割、可压缩的特点。
2、支持三种压缩选择: NONE、RECORD、BLOCK。 RECORD压缩率低，一般建议使用BLOCK压缩。

第三种: RC File
1、存储方式:数据按行分块，每块按照列存储。
	A、首先，将数据按行分块，保证同一个record在一个块上，避免读一个记录需要读取多个block。
	B、其次，块数据列式存储，有利于数据压缩和快速的列存取。
2、相对来说，RCFile对于提升任务执行性能提升不大，但是能节省一些存储空间。可以使用升级版的0RC格式。



第四种: ORC File
1、存储方式:数据按行分块，每块按照列存储
2、Hive提供的新格式，属于RCFile的升级版，性能有大幅度提升，而且数据可以压缩存储，压缩快，快速列存取。
3、ORC File会基于列创建索引，当查询的时候会很快。

第五种: Parquet File
1、存储方式:列式存储。
2、Parquet对于大型查询的类型是高效的。对于扫描特定表格中的特定列查询，Parquet特别有用。 Parquet-般使用Snappy、Gzi p压缩。默认Snappy。
3、Parquet支持Impala查询引擎。
 4、表的文件存储格式尽量采用Parquet或ORC，不仅降低存储量，还优化了查询，压缩，表关联等性能。



### 选择合适的压缩格式

Hive语句最终是转化为MapReduce程序来执行的，而MapReduce的性能瓶颈在与网络I0和磁盘I0,要解决性能瓶颈，最主要的是减少数据量,对数据进行压缩是个好方式。压缩虽然是减少了数据量,但是压缩过程要消耗CPU,但是在Hadoop中，往往性能瓶颈不在于CPU, CPU力并不大，所以压缩充分利用了比较空闲的CPU。

![image](https://static.lovedata.net/21-05-30-2b005d738b2001c5a0da88b373217b1e.png-wm)



如何选择压缩方式

1、压缩比率
2、压缩解压速度
3、是否支持split
支持分割的文件可以并行的有多个mapper程序处理大数据文件，大多数文件不支持可分刮四为达三义什只比从头开始读。

是否压缩
1、计算密集型，不压缩，否则进一 步增加了CPU的负担
2、网络密集型，推荐压缩，减小网络数据传输



Job输出文件按照Block以GZip的方式进行压缩:

```shell
##默认值是false
set mapreduce.output.fileoutputformat. compress=true;
##默认值是Record
set mapreduce. output.fileoutputformat. compress.type=BLOCK
##默认值是org. apache. hadoop. io. compress. Defaultcodec
set mapreduce. output.fileoutputformat. compress.codec=org. apache . hadoop. io. compress.GzipCodec
```



Map输出结果也以Gzip进行压缩:

```sql
##启用map端输出压缩
set mapred. map. output. compress=true
##默认值是org. apache . hadoop. io. compress . DefaultCodec
set mapreduce. map. output. compress. codec=org. apache . hadoop. io. compress. GzipCodec
```



对Hive输出结果和中间都进行压缩:

```sql
set hive. exec. compress. output=true  ##默认值是false,不压缩
set hive. exec. compress. i nte rmediate=true  ##默认值是false，为true时MR设置的压缩才启用
```



## HQL语法和运行参数层面

HQL语法和运行参数层面，主要跟大家讲讲如果写出高效的HQL，以及如果利用一-些控制参数来调优HQL的执行。这是HQL调优的一一个大头。

### 6.2.1.查看Hive执行计划

Hive的SQL语句在执行之前需要将SQL语句转换成MapReduce任务,因此需要了解具体的转换过程，可以在SQL语句中输入如下命令查看具体的执行计划。

```sql
##查看执行计划，添加extended关键字可以查看更加详细的执行计划
expjain [extended] query
```



### 6.2.2.列裁剪

列裁剪就是在查询时只读取需要的列，分区裁剪就是只读取需要的分区。当列很多或者数据量很大时，如果select * 或者不指定分区，全列扫描和全表扫描效率都很低。

Hive在读数据的时候，可以只读取查询中所需要用到的列，而忽略其他的列。这样做可以节省读取开销:中间表存储开销和数据整合开销。

```sql
set hive. optimize.cp = true;  ##列裁剪，取数只取查询中需要用到的列，默认是true
```



### 6.2.3.谓词下推

将SQL语句中的where谓词逻辑都尽可能提前执行，减少下游处理的数据量。对应逻辑优化器是 PredicatePushDown.

```sql
set hive. optimize. ppd=true; ##默认是true
```

示例程序:

```sql
select a.*， b.* from a join b on a.id = b.id where b.age > 20;
select a.*， c.* from a join (select * from b where age > 20) C on a.id = c.id;
```

### 分区裁剪

列裁剪就是在查询时只读取需要的列，分区裁剪就是只读取需要的分区。当列很多或者数据量很大时，如果select * 或者不指定分区，全列扫描和全表扫描效率都很低。 在查询的过程中，只选择需要的分区，可以减少读入的分区数目,减少读入的数据量。 Hive中与分区裁剪优化相关的则是:

```sql
set hive. optimize. pruner=true;  ##默认是true 
```

在HiveQL解析阶段对应的则是GolumnPruner逻辑优化器。

### 合并小文件

如果一个mapreduce job碰到一 对小文件作为输入，一个小文件启动一个Task

####  Map输入合并 

在执行MapReduce程序的时候，- -般情况是一个文件的一个数据分块需要一个 mapTask来处理。但是如果数据 源是大量的小文件，这样就会启动大量的mapTask任务，这样会浪费大量资源。可以将输入的小文件进行合并,从而减少mapTask任务数量。

```sql
#### Map端输入、合并文件之后按照b1ock的大小分割(默认)

set hive. input. format=org. apache . hadoop. hive. q1. io. CombineHiveInputFormat; 

#### Map端输入，不合并

set hive. input. format=org. apache. hadoop. hive. q1. io. HiveInputFormat;
```

#### Map/Reduce输出合并

大量的小文件会给HDFS带来压力,影响处理效率。可以通过合并Map和Reduce的结果文件来消除影响。

```sql
##是否合并Map输出文件，默认值为true
set hive . merge . mapfiles=true;
##是否合并Reduce端输出文件，默认值为false
set hive . merge . mapredfiles=true ;
##合并文件的大小，默认值为25600000
set hive . merge. size. per. task=256000000;
##每个Map最大分割大小
set mapred. max. split. size=2560000p0;
##一个节点上split的最少值
set mapred. min. split. size. per. node=1; // 服务器节点
##一个机架上split的最少值
set mapred. min.split.size. per. rack=1; //服务器机架
```

hive.merge.size.per .task和mapred.min.split.size.per.node 联合起来:

1、默认情况先把这个节点上的所有数据进行合并，如果合并的那个文件的大小超过了256M就开启另外一个文件继续合并
2、如果当前这个节点上的数据不足256M，那么就都合并成一个 逻辑切片。

现在有100个Task,总共有10000M的数据，平均- -下，每个Task执行100M的数据的计算。假设只启动10个Task,每个Task就要执行1000M的数据。如果只有2个Task， 5000M



### 合理设置MapTask并行度

#### 第一: MapReduce中的Map Task的并行度机制

Map数过大:当输入文件特别大，MapTask 特别多,每个计算节点分配执行的MapTask都很多，这时候可以考
虑减少MapTask的数量。增大每个MapTask处理的数据量。而且MapTask过多，最终生成的结果文件数也太
多。

1、Map阶段输出文件太小，产生大量小文件
2、初始化和创建Map的开销很大

Map数太小:当输入文件都很大，任务逻辑复杂，MapTask 执行非常慢的时候，可以考心項加Iviapiaor奴，不使得每个MapTask处理的数据量减少，从而提高任务的执行效率。

1、文件处理或查询并发度小，Job执行时间过长
2、大量作业时，容易堵塞集群

在MapReduce的编程案例中，我们得知，- -个MapReduce Job 的MapTask数量是由输入分片InputSplit 决定的。而输入分片是由FilelnputFormat.getSplit()决定的。一个输入分片对应一个MapTask,而输入分片是由三个参数决定的:

![image](https://static.lovedata.net/21-05-30-07754921f3973f963c64e326c4b12921.png-wm)



输入分片大小的计算是这么计算出来的:
1ong splitsize = Math. max (minSize，Math. mi n(maxsize，b1ockSize))

默认情况下，输入分片大小和HDFS集群默认数据块大小-致，也就是默认-一个数据块,启用-一个MapTask进行处理，这样做的好处是避免了服务器节点之间的数据传输,提高job处理效率

两种经典的控制MapTask的个数方案:减少MapTask数 或者增加MapTask数

1、减少MapTask数是通过合并小文件来实现，这一点主要是针对数据源
2、增加MapTask数可以通过控制上一个job 的reduceTask 个数

**重点注意:不推荐把这个值进行随意设置1**
**推荐的方式:使用默认的切块大小即可。如果非要调整，最好是切块的N倍数**

#### 第二:合理控制MapTask数量

1、减少MapTask数可以通过合并小文件来实现
2.增加MapTask数可以通过控制上一个ReduceTask默认的MapTask个数
计算方式
输入文件总大小: total_ size
HDFS设置的数据块大小: dfs_ _block_ size
default_ mapper_ _num = total_ size / dfs_ _block_ size

MapReduce中提供了如下参数来控制map任务个数，从字面上看，貌似是可以直接设置MapTask个数的样子，但是很遗憾不行，这个参数设置只有在大于default_mapper_ num的时候，才会生效。

```shell
set mapred. map. tasks=10;  ##默认值是2
```



那如果我们需要减少MapTask数量，但是文件大小是固定的，那该怎么办呢?
可以通过mapred. min. split.size设置每个任务处理的文件的大小，这个大小只有在大于dfs_ b1ock size 的时候才会生效

```sql
split_size = max (mapred. min.split.size, dfs_ b1ock_ _sịze)
split_ num = total_ _size 1 split_ size
compute map_ num = Math. min(split_ num, Math. max(default_ mapper_ num, mapred. map. tasks))
```

送村就可以佩少MopTask散暈て。
怠結一-下控制mapper个数的方法:
1、如果想増加MapTask 个数，可以役置mapred. map. tasks カ一 个较大大的值

2. 如果想减少MapTask个数，可以设置maperd.map.spitsize 谓一个较大的值

MapTask数量与输入文件的split 数息息相关,在Hadoop源码 org. apache . hadoop. mapreduce.1ib. input. FileInputFormat类中可以看到split划分的具体逻辑。可以直接 通过参数mapred. map. tasks (默认值2) 来设定MapTask数的期望值，但它不一定会生效。



### 6.2.7.合理设置ReduceTask并行度

如果ReduceTask数量过多,一个ReduceTask会产生-一个结果文件,这样就会生成很多小文件,那么如果这些结果文件会作为下一个Job的输入，则会出现小文件需要进行合并的问题,而且启动和初始化ReduceTask需要耗费资源。

如果ReduceTask数量过少,这样一个ReduceTask就需要处理大量的数据，并且还有可能会出现数据倾斜的问题，使得整个查询耗时长。默认情况下，Hive 分配的reducer个数由下列参数决定:

Hadoop MapReduce程序中，ReducerTask 个数的设定极大影响执行效率，ReducerTask 数量与输出文件的数量相关。如果ReducerTask数太多,会产生大量小文件，对HDFS造成压力。如果ReducerTask数太少，每个ReducerTask要处理很多数据，容易拖慢运行时间或者造成00M。这使得Hive怎样决定ReducerTask个数成为一个关键问题。遗憾的是Hive的估计机制很弱，不指定ReducerTask个数的情况下，Hive 会猜测确定一个ReducerTask个数，基于以下两个设定:

参数1: hive. exec. reducers . bytes. per. reducer (默认256M)
参数2: hive. exec. reducers . max (默认为1009)
参数3: mapreduce. job. reduces (默认值为-1，表示没有设置，那么就按照以上两个参 数进行设置)



ReduceTask的计算公式为:
N = Math. min(参数2，总输入数据大小/参数1)

可以通过改变上述两个参数的值来控制ReduceTask的数量。也可以通过
set mapred. map. tasks=10;
set mapreduce. job. reduces=10;

通常情况下，有必要手动指定ReduceTask个数。考虑到Mapper阶段的输出数据量通常会比输入有大幅减少，因此即使不设定ReduceTask个数，重设参数2还是必要的。依据经验，可以将参数2设定为M * (0.95 * N)(N为集群中NodeManager个数)。一般来说，NodeManage 和
DataNode的个数是一样的。





### 6.2.8. Join优化

#### Join优化整体原则:

1、优先过滤后再进行Join操作，最大限度的减少参与joi n的数据量
2、小表join大表，最好启动mapjoin, hive 自动启用mapjoin，小表不能超过25M，可以更改
3、Join on的条件相同的话，最好放入同一个job，并且joi n表的排列顺序从小到大: select a.*，b.*，c.* from a join b on a.id=b.id join C on a.id=c.i
4、如果多张表做join,如果多个链接条件都相同，会转换成一个J0b

#### 优先过滤数据

尽量减少每个阶段的数据量，对于分区表能用上分区字段的尽量使用，同时只选择后面需要使用到的列，最大限度的减少参与Join的数据量。

#### 小表join大表原则

小表join大表的时应遵守小表join大表原则，原因是join 操作的reduce 阶段，位于join 左边的表内容会被加载进内存，将条目少的表放在左边，可以有效减少发生内存溢出的几率。join中执行顺序是从左到右生成Job， 应该保证连续查询中的表的大小从左到右是依次增加的。
使用相同的连接键



#### 使用相同的连接键

在hive中，当对3个或更多张表进行join 时，如果on条件使用相同字段，那么它们会合并为一个MapReduceJob，利用这种特性，可以将相同的join on放入一个job 来节省执行时间。

#### 尽量原子操作

尽量避免一↑SQL包含复杂的逻辑，可以使用中间表来完成复杂的逻辑。

#### 大表Join大表

1、空key过滤:有时joi n超时是因为某些key对应的数据太多，而相同key对应的数据都会发送到相同的reducer上，从而导致内存不够。此时我们应该仔细分析这些异常的key，很多情况下，这些key对应的数据是异常数据，我们需要在SQL语句中进行过滤。
2、空key转换: 有时虽然某个key为空对应的数据很多，但是相应的数据不是异常数据，必须要包含在join的结果中，此时我们可以表a中key为空的字段赋一个随机的值，使得数据随机均匀地分不到不同的reducer上



### .启用MapJoin

***这个优化措施，但凡能用就用!大表 join 小表小表满足需求: 小表 数据小于控制条件时***

Maploin是将join 双方比较小的表直接分发到各个map进程的内存中，在map进程中进行join操作，这样就不用进行reduce步骤，从而提高了速度。只有join操作才能启用Mapjoin.

```sql
##是否根据输入小表的大小，自动将reduce端的common join 转化为map join, 将小表刷入内存中。
##对应逻辑优化器 是MapJoi nProcessor
set hive. auto. convert.join = true;
##刷入内存表的大小(字节)
set hive. mapjoin. smalltable. filesize = 25000000;

## hive 会基于表的size自动的将普通joi n转换成mapjoin
set hive. auto. convert. join. nocondi ti onaltask=true;
##多大的表可以自动触发放到内层LocalTask中，默认大小10M
set hive. auto. convert. join. noconditiona 1task. size=10000000;
```



Hive可以进行多表Join。Join 操作尤其是Join大表的时候代价是非常大的。Maploin 特别适合大小表join的情况。在Hive join场景中，- -般总有一-张相对小的表和一 -张相对大的表,小表叫build table,大表叫probe table。Hive在解析带join的SQL语句时，会默认将最后-个表作为probe table,将前面的表作为build table并试图将它们读进内存。如果表顺序写反，probe table在前面，引发00M的风险就高了。在维度建模数据仓库中，事实表就是probe table,维度表就是build table。这种Join方式在map端直接完成join过程，消灭了reduce,效率很高而且Manloin还支持非等值连接



当Hive执行Join时，需要选择哪个表被流式传输(stream) ，哪个表被缓存(cache) 。Hive 将JOIN语句中的最后一个表用于流式传输，因此我们需要确保这个流表在两者之间是最大的。如果要在不同的key.上join 更多的表,那么对于每个join集，只需在ON条件右侧指定较大的表。
也可以手动开启mapjoin:

```sql
--SQL方式，在SQL 语句中添加MapJoin标记(mapjoin hint )
--将小表放到内存中，省去shff1e操作
SELECT sma11Table.key， bigTable.value FROM smallTable JOIN bigTable ON smal1Tab1e.key = bigTable. key;
```



![image](https://static.lovedata.net/21-05-30-5f48ce38ca2faa8b3075105fe68aa80a.png-wm)

![image](https://static.lovedata.net/21-05-30-1b9ad2f97535fbfc2c5a41937c1e7411.png-wm)



#### Sort-Merge-Bucket(SMB) Map Join



它是另一种Hive Join优化技术,使用这个技术的前提是所有的表都必须是分桶表(bucket) 和分桶排序的
(sort)。分桶表的优化!

具体实现: .
1、针对参与jqi n的这两张做相同的hash散列，每个桶里面的数据还要排序
2、这两张表的分桶个数要成倍数。
3、开启SMB join的开关!  set hive. auto. convert. sortmerge. join=true ;



一些常见参数设置:

```sql
##当用户执行bucket map join的时候， 发现不能执行时，禁止查询
set hive. enforce. sortmergebucketmapjoin=false;
##如果join的表通过sort merge join的条件， join是否会自动转换为sort merge join
set hive. auto. convert. sortmerge. join=true ;
##当两个分桶表join时，如果join on的是分桶字段，小表的分桶数是大表的倍数时，可以启用mapjoin 来提高
效率。

# bucket map join优化，默认值是false

set hive . optimize. bucketmapjoin=false;

## bucket map join 优化，默认值是false

set hive. optimize . bucketmapjoin. sortedmerge=false;
```



### Join数据倾斜优化

在编写Join查询语句时，如果确定是由于join出现的数据倾斜，那么请做如’下设置:

```sql
# join的键对应的记录条数超过这个值则会进行分拆，值根据具体数据量设置

set hive. skewjoin. key=100000;

#如果是join过 程出现倾斜应该设置为true
set hive. optimize. skewjoin=false;
```



如果开启了，在Join过程中Hive会将计数超过阈值hive.skewjoin.key (默认100000)的倾斜key对应的行临时写进文件中，然后再启动另一个job做map join生成结果。

通过hive. skewjoin. mapjoin. map. tasks参数还可以控制第1 =个job的mapper数量，默认10000。

```sql
set hive. skewjoin. mapjoin. map. tasks=10000;
```



###  CBO优化

join的时候表的顺序的关系:前面的表都会被加载到内存中。后面的表进行磁盘扫描
select a.*，b.*，c.* from a join b on a.id = b.id join C on a.id = C. id;

Hive自0.14.0开始，加入了-项"Cost based Optimizer"来对HQL执行计划进行优化，达T功北通过 "hive.cbo.enable"来开启。在Hive 1.1.0之后，这个feature是默认开启的，它可以自动优化HQL中多个Join的顺序，并选择合适的Join算法。CBO,成本优化器，代价最小的执行计划就是最好的执行计划。传统的数据库，成本优化器做出最优化的执行计划是依据统计信息来计算的。Hive 的成本优化器也- -样。

 Hive在提供最终执行前，优化每个查询的执行逻辑和物理执行计划。这些优化工作是交给底层来完成的。根据查询成本执行进一步的优化, 从而产生潜在的不同决策:如何排序连接,执行哪种类型的连接，并行度等等。

要使用基于成本的优化(也称为CBO)， 请在查询开始设置以下参数:

```sql
set hive. cbo. enab1e=true;
set hive. compute. query. using. stats=true;
set hive. stats. fetch. column. stats=true;
set hive. stats. fetch. partition. stats=true;
```



### 怎样做笛卡尔积

当Hive设定为严格模式(hive.mapred.mode-strict) 时，不允许在HQL语句中出现笛卡尔积，这实际说明了Hive对笛卡尔积支持较弱。因为找不到Join key, Hive 只能使用1个reducer来完成笛卡尔积。当然也可以使用limit的办法来减少某个表参与join 的数据量,但对于需要笛卡尔积语义的需求来说，经常是一个大表和一个小表的Join操作，结果仍然很大(以至于无法用单机处理)，这时 Maploin才是最好的解决办法。Maploin,顾名思义，会在Map端完成Join操作。这需要将Join 操作的一个或多个表完全读入内存。

PS: Maploin在子查询中可能出现未知BUG。在大表和小表做笛卡尔积时，规避笛卡尔积的方法是,给Join添加-一个Join key,原理很简单:将小表扩充- -列join key,并将小表的条目复制数倍，join key各不相同;将大表扩充- -列join key为随机数。

精髓就在于复制几倍，最后就有几个reduce来做，而且大表的数据是前面小表扩张key值范围里面随机出来的，所以复制了几倍n,就相当于这个随机范围就有多大n,那么相应的，大表的数据就被随机的分为了n份。并且最后处理所用的reduce数量也是n,而且也不会出现数据倾斜。



![image](https://static.lovedata.net/21-05-30-90acbd2bc260fd62abc8c7f7652f3eb0.png-wm)





### Group By优化

默认情况下，Map阶段同-一个Key的数据会分发到-一个Reduce上,当-一个Key的数据过大时会产生数据倾斜。 进行group by操作时可以从以下两个方面进行优化:

#### Map端部分聚合

事实上并不是所有的聚合操作都需要在Reduce部分进行，很多聚合操作都可以先在Map端进行部分聚合,然后在Reduce端的得出最终结果。

```sql
##开启Map端聚合参数设置
set hive. map. aggr=true;

#设置map端预聚 合的行数阈值，超过该值就会分拆job, 默认值100000
set hive. groupby . mapaggr . checki nterva1=100000
```



#### 有数据倾斜时进行负载均衡


当HQL语句使用group by时数据出现倾斜时,如果该变量设置为true,那么Hive会自动进行负载均衡。策略就是把MapReduce任务拆分成两个:第-一个先做预汇总，第二个再做最终汇总。

```sql
#自动优化，有数据倾斜的时候进行负载均衡(默认是false)

```

当选项设定为true时，生成的查询计划有两个MapReduce任务。


1、在第一个MapReduce任务中，map 的输出结果会随机分布到reduce 中，每个reduce 做部分聚合操作，并输出结果，这样处理的结果是相同的group by key有可能分发到不同的reduce 中，从而达到负载均衡的目的;

2、第二个MapReduce 任务再根据预处理的数据结果按照group by key 分布到各个reduce 中，最后完成最终的聚合操作。

Map端部分聚合:并不是所有的聚合操作都需要在Reduce端完成，很多聚合操作都可以先在Map端进行部分聚合，最后在Reduce端得出最终结果，对应的优化器为GroupByQptimizer.



### 6.2.14. Order By优化

order by 只能是在一个reduce进程中进行,所以如果对一个大数据集进行order by,会导致一一个reduce进程:
中处理的数据相当大，造成查询执行缓慢。

1、在最终结果上进行order by，不要在中间的大数据集上进行排序。如果最终结果较少，可以在一个reduce上进行排序时，那么就在最后的结果集上进行order by。
2、如果是取排序后的前N条数据，可以使用distribute by 和sort by在各个reduce.上进行排序后前N条，然后再对各个reduce的结果集合合并后在一个reduce中全局排序，再取前N条，因为参与全局排序的order by的数据量最多是reduce个数* N，所以执行效率会有很大提升。

在Hive中，关于数据排序,提供了四种语法，- -定要区分这四种排序的使用方式和适用场景。
1、order by:全局排序，缺陷是只能使用一个reduce
2、sort by: 单机排序，单个reduce结果有序
3、cluster by:对同一- 字段分桶并排序，不能和sort by连用
4、distribute by + sort by:分桶，保证同一字段值只存在一 个结果 文件当中，结合sort by保证每个reduceTask结果有序

Hive HQL中的order by与其他SQL方言中的功能一样，就是将结果按某字段全局排序,这会导致所有map端.
数据都进入-个reducer中，在数据量大时可能会长时间计算不完。

如果使用sort by,那么还是会视情况启动多个reducer进行排序,并且保证每个reducer内局部有序。为了控制map端数据分配到reducer的key,往往还要配合distribute by一同使用。如果不加distribute by的话，map端数据就会随机分配到reducer。



提供一种方式实现全局排序:两种方式: 

1、建表导入数据准备

```sql
create table if not exists student(id int，name string， sex string， age int，department string) row format de1imited fields terminated by ",";
load data 1ocal inpath "/home/bi gdata/students. txt" into table student;
```



2、第一种方式

```sql
-- 直接使用order by来做。如果结果数据量很大，这个任务的执行效率会非常低
select id,name,age from student order by age;
```

3、第二种方式.

```sql
-- 使用distribute by + sort by 多个reduceTask， 每个reduceTask分别有序
set mapreduce.job.reduces=3;
drop tab1e student_orderby_result;

-- 范围分桶0<18<1<20<2
create table student_ _orderby_ result as 
select * from student distribute by (case when age > 20 then 0 when age < 18 then 2 else 1 end) sort by  (age desc);
```



### Count Distinct

当要统计某一-列去重数时，如果数据量很大，count(distinct) 就会非常慢，原因与order by类似，count(distinct)逻辑只会有很少的reducer来处理。这时可以用group by来改写:

```sql
-- 先 group by 再  count
select count(1) from (
 select age from student
 where department >= "MA"
group by age
) t;
```



再来一个例子:
优化前，-一个普通的只使用一-个reduceTask来进行count(distinct)操作

```sql
--优化前(只有一个reduce，先去重再count负担比较大) :
select count(distinct id) from tablename;
```



优化后，但是这样写会启动两个MR job ( 单纯distinct只会启动一个)，所以要确保数据量大到启动job的overhead远小于计算耗时，才考虑这种方法。当数据集很小或者key的倾斜比较明显时，group by还可能会比distinct 慢

```sql
-- 优化后(启动两个job，一个job负责子查询(可以有多个reduce)，另一个job负责count(1)):
select count(1) from (select distinct id from tablename) tmp;
select count(1) from (select id from tablename group by id) tmp;
```



### 6.2.16.怎样写in/exists语句

在Hive的早期版本中，in/elxists语法是不被支持的，但是从hive-0.8x以后就开始支持这个语法。但是不推荐使用这个语法。虽然经过测验，Hive-2.3.6 也支持in/exists操作,但还是推荐使用Hive的-一个高效替代方案: left semi join
比如说:

```sql
-- in / exists 实现
select a.id, a.name from a where a.id in (select b. id from b);
select a.id, a.name from a where exists (select id from b where a.id = b.id);
-- 应该转换成: .
-- 1eft semi join 实现
select a.id，a.name from a 1eft semi join b on a.id = b.id;
```

 

### 6.2.17. 使用 vectorization 技术

在计算类似scan, filter, aggregation的时候，vectorization 技术以设置批处理的增量大小为1024行单次来达到. 比单条记录单次获得更高的效率。

```sql
set hive. vectorized. execution. enabled=true ; 
set hi ve. vectorized. execution. reduce. enab led=true;
```



### 多重模式

如果你碰到一堆SQL， 并且这一堆SQL的模式还一 样。 都是从同一个表进行扫描，做不同的逻辑。 有可优化的地方:如果有n条SQL，每个SQL执行都会扫描一次这张表 。

如果一一个HQL底层要执行10个Job,那么能优化成8个- -般来说，肯定能有所提高，多重插入就是一个非常实用的技能。- -次读取，多次插入,有些场景是从- -张表读取数据后，要多次利用，这时可以使用multi insert 语法：

```sql
from sale_ _detail
insert overwrite table sale_ _detail_ _multi partition (sale_ _date= ' 2019', region='china' )
select shop_ name, customer_ _id, total_ _price where
insert overwrite table sale_ _detail_ _mu1ti partition (sale_ _date=' 2020', region= 'china' )
select shop_ _name, customer_ id, total_ _price where
```



说明: multi insert语法有一些限制。

1. 一般情况下，单个SQL 中最多可以写128路输出，超过128路，则报语法错误。

2.  在一个 multi insert下 :
   对于分区表，同一个目标分区不允许出现多次。
   对于未分区表，该表不能出现多次。
3. 对于同一张分区表的不同分区，不能同时有insert overwrite和insert into操作，否则报错返回。Multi-Group by是Hive的一个非常好的特性，它使得Hive中利用中间结果变得非常方便。例如:

Multi-Group by是Hive的一个非常好的特性，它使得Hive中利用中间结果变得非常方便。例如:

```sql
from select
a. status, b. school, b. gender FROM status_ updates a JOIN profiles b ON
(a.userid = b.userid and a.ds=' 2019-03-20' )) subq1
INSERT OVERWRITE TABLE gender_ _summary PARTITION(ds= ' 2019-03-20')
SELECT subq1. gender, COUNT(1) GROUP BY subq1. gender
INSERT OVERWRITE TABLE school _ _summary PARTITION(ds= ' 2019-03-20')
SELECT subq1. school, COUNT(1) GROUP BY subq1. school;
```

上述查询语句使用了Multi-Group by特性连续group by了2次数据，使用不同的Multi-Group by。这一特性可 以减少- -次MapReduce操作。



### 6.2.19.启动中间结果压缩

#### map输出压缩

set mapreduce . map. output. compress=true;
set mapreduce . map. output . compress . codec=org. apache . hadoop. io. compress . SnappyCodec ;

#### 中间数据压缩

中间数据压缩就是对hive查询的多个Job之间的数据进行压缩。最好是选择一个节省CPU耗时的压缩方式。 可以 采用snappy压缩算法，该算法的压缩和解压效率都非常高。
set hive. exec. compress. inte rmediate=true ;
set hive. inte rmedi ate. compression. codec=org. apache . hadoop. io. compress. SnappyCodec;
set hive. i ntermediate. compression. type=BLOCK;

### 结果数据压缩

最终的结果数据(Reducer输出数据)也是可以进行压缩的，可以选择一个压缩效果比较好的，可以减少数据的大小和数据的磁盘读写时间;注:常用的gzip, snappy 压缩算法是不支持并行处理的，如果数据源是gzijp/snappy压缩文件大文件，这样只会有有个mapper来处理这个文件，会严重影响查询效率。所以如果结果数据需要作为其他查询任务的数据源，可以选择支持splitable的LZ0算法,这样既能对结果文件进行压缩，还可以并行的处理，这样就可以大大的提高job执行的速度了。



set hive. exec. compress. output=true;
set mapreduce. output. fileoutputformat. compress=true;
setmapreduce. output. fileoutputformat. compress. codec=org. apache . hadoop. io. compress. Gzi pCodec;
set mapreduce . output. fi leoutputformat . compress. type=BLOcK; 

#### Hadoop集群支持的压缩算法: .

org. apache. hadoop. io. compress . Defaultcodec
org. apache. hadoop. io. compress. Gzi pCodec
org. apache. hadoop. io. compress. BZi p2Codec
org. apache . hadoop. io. compress. Deflatecodec
org. apache . hadoop. io. compress. SnappyCodec
org. apache . hadoop. io. compress. Lz4codec
com. hadoop. compression.1zo. LzoCodec
com. hadoop. compress ion.1zo. LzopCodec



## Hive架构层面

### 6.3.1.启用本地抓取



Hive的某些SQL语句需要转换成MapReduce的操作，某些SQL语句就不需要转换成MapReduce操作,但是同学们需要注意，理论上来说，所有的SQL语句都需要转换成MapReduce操作，只不过Hive在转换SQL语句的过程中会做部分优化，使某些简单的操作不再需要转换成MapReduce,例如: 

1、只是select*的时候
2、where条件针对分区字段进行筛选过滤时
3、带有limit分支语句时↑

Hive从HDFS中读取数据，有两种方式:启用MapReduce读取和直接抓取。直接抓取数据比MapReduce方式读取数据要快的多，但是只有少数操作可以使用直接抓取方式。可以通过hive. fetch. task. conversion参数来配置在什么情况下采用直接抓取方式:

minimal:只有select *、在分区字段上where过滤、有1imit这三种场景下才启用直接抓取方式。
more:在select、 where筛选、limit时，都启用直接抓取方式。

查看Hive的抓取策略:



```sql

##查看
set hive. fetch. task. conversion;
```

设置Hive的抓取策略:

```sql

##默认more
set hive. fetch. task. conversi on=more; 
```





### 6.3.2.本地执行优化



Hive在集群上查询时，默认是在集群.上多台机器上运行，需要多个机器进行协调运行,这种方式很好的解决了大
数据量的查询问题。但是在Hive查询处理的数据量比较小的时候，其实没有必要启动分布式模式去执行，因为以
分布式方式执行设计到跨网络传输、多节点协调等，并且消耗资源。对于小数据集，可以通过本地模式，在单台机
器上处理所有任务,执行时间明显被缩短。
启动本地模式涉及到三个参数:

```sql
##打开hive自动判断是否启动本地模式的开关
set hive. exec. mode.1oca1. auto=true;

## map任务数最大值，不启用本地模式的task最大个数

set hive. exec. mode.1oca1. auto. input. files. max=4;

## map输入文件最大大小，不启动本地模式的最大输入文件大小

set hive. exec. mode.1oca1. auto. inputbytes . max=134217728;

```



### 6.3.3. JVM重用


Hive语句最终会转换为一系列的MapReduce任务,每- -个MapReduce 任务是由一系列的MapTask和ReduceTask组成的，默认情况下，MapReduce 中-一个MapTask或者ReduceTask就会启动-一个 JVM进程，一个Task执行完毕后，JVM 进程就会退出。这样如果任务花费时间很短，又要多次启动JVM的情况下，JVM 的启动时间会变成一个比较大的消耗，这时，可以通过重用JVM来解决。

set mapred. job. reuse. jvm. num. tasks=5;

JVM也是有缺点的，开启JVM重用会-直占用使用到的task的插槽，以便进行重用，直到任务完成后才会释放。如果某个不平衡的job中有几个reduce task执行的时间要比其他的reduce task消耗的时间要多得多的话，那么保留的插槽就会一直空闲却无法被其他的 job使用，直到所有的task都结束了才会释放。根据经验，- -般来说可以使用一个gpu core启动一个JVM,假如服务器有16个gpucore，但是这个节点，可能
会启动32个mapTask,完全可以考虑:启动- -个JVM，执行两个Task





### 6.3.4.并行执行

有的查询语句，Hive 会将其转化为-一个或多个阶段，包括: MapReduce 阶段、抽样阶段、合并阶段、limit 阶段等。默认情况下，一次只执行一个阶段。但是,如果某些阶段不是互相依赖，是可以并行执行的。多阶段并行是比较耗系统资源的。

-个Hive SQL语句可能会转为多个MapReduceJob,每-一个 job就是-一个stage,这些Job顺序执行，这个在cli的运行日志中也可以看到。但是有时候这些任务之间并不是是相互依赖的，如果集群资源允许的话，可以让多个并不相互依赖stage并发执行，这样就节约了时间，提高了执行速度，但是如果集群资源匮乏时，启用并行化反倒是会导致各个Job相互抢占资源而导致整体执行性能的下降。启用并行化:

```sql
##可以开启并发执行。
set hive. exec. para11e1=true;
##同一个sq1允许最大并行度， 默认为8。
set hive. exec. paralle1. thread. number=16;
```





### 6.3.5.推测执行

在分布式集群环境下，因为程序Bug (包括Hadoop本身的bug)，负载不均衡或者资源分布不均等原因，会造成同一个作业的多个任务之间运行速度不一致，有些任务的运行速度可能明显慢于其他任务(比如一个作业的某个任 务进度只有50%，而其他所有任务已经运行完毕)，则这些任务会拖慢作业的整体执行进度。为了避免这种情况发生，Hadoop采用了推测执行(Speculative Execution)机制，它根据一定的法则推测出”拖后腿”的任务， 并为这样的任务启动一个备份任务，让该任务与原始任务同时处理同-份数据，并最终选用最先成功运行完成任务的计算结果作为最终结果。



```sql
#启动mapper阶段的推测执行机制
set mapreduce . map. speculative=true ;
#启动reducer阶段的推测执行 机制
set mapreduce. reduce. speculative=true; 
```



建议:
如果用户对于运行时的偏差非常敏感的话，那么可以将这些功能关闭掉。如果用户因为输入数据量很大而需要执行长时间的MapTask或者ReduceTask的话，那么启动推测执行造成的浪费是非常巨大大。设置开启推测执行参数: Hadoop的mapred-site.xml文件中进行配置

![image](https://static.lovedata.net/21-05-31-6f5d157b9d75d216eab9ef74203b1ea8.png-wm)

![image](https://static.lovedata.net/21-05-31-e7fbe3a63ccc34db02938de7984bcabd.png-wm)




关于调优这些推测执行变量，还很难给一个具体的建议。如果用户对于运行时的偏差非常敏您白，可以将这些功能关闭掉。如果用户因为输入数据量很大而需要执行长时间的mapTask或者reduceTask的话,那么启动推测执行造成的浪费是非常巨 大。

![image](https://static.lovedata.net/21-05-31-c4fd79e89cd0be80b8b39aa77958815a.png-wm)





### 6.3.6. Hive严格模式

所谓严格模式，就是强制不允许用户执行有风险的HiveQL语句，一-旦执行会直接失败。但是Hive中为 了提高SQL语句的执行效率，可以设置严格模式，充分利用Hive的某些特点。

```sql
##设置Hive的严格模式
set hive. mapred. mode=strict;
set hive, exec. dynamic. partition, mode=nostrict;
```



注意:当设置严格模式之后,会有如下限制:

```sql
1、对于分区表，必须添加where对于分区字段的条件过滤 
	select * from student where age > 25
2、order by语句必须包含1imi t输出限制
	select * from student order by age limit 100;
3、限制执行笛卡尔积的查询 
	select a.*， b.* from a，b;
4、在hive的动态分区模式下，如果为严格模式，则必须需要一个 分区列式静态分区
```



## 6.5.调优案例

6.5.1.第一个例子:日志表和用户表做链接

```sql
select * from 1og a 1eft outer join users b on a.user. _id = b.user. _id;
```

users表有600W+的记录，把users分发到所有的map.上也是个不小的开销，而且Maploin不支持这么大的小
表。如果用普通的join,又会碰到数据倾斜的问题。
改进方案:

```sql
select /*+mapjoin(x)*/ * from 1og a
left outer join (
select /*+mapjoin(c)*/ d.*
from ( select distinct user. _id from 10g ) C join users d on c.user_ _id = d.user_ _id
)x
on a.user_ _id = x.user_id;
```



假如，log 里user_ id有上百万个，这就又回到原来Maploin问题。所幸，每日的会员uv不会太多，有交易的会员不会太多,有点击的会员不会太多，有佣金的会员不会太多等等。所以这个方法能解决很多场景下的数据倾斜问题。



### 6.5.2.第二个例子:位图法求连续七天发朋友圈的用户

每天都要求微信朋友圈过去连续7天都发了朋友圈的小伙伴有哪些? 假设每个用户每发一次朋友圈都记录了一-条日志。每一条朋友圈包含的内容:

```shell
日期，用户ID，朋友圈内容.....
dt，userid，content， .....
```

实现的SQL:

```sql
//昨天和今天
select a.userid from table a join tab1e b on a.userid = b. userid;
//上一次join的结果和前天join
//上一次join的结构和大前天join
```



想想效率?



想想效率?
好的解决方案:位图法

```sql
假设微信有10E用户，我们每天生成一个长度为10E的二进制数组，每个位置要么是0，要么是1，如果为1，代表该用户当天发了朋友圈。如果为0，代表没有发朋友圈。然后每天: 10E / 8 / 1024 / 1024 = 119M左右求Join实现:两个数组做求且、求或、异或、求反、求新增
```





![image](https://static.lovedata.net/21-05-31-7d4cbbc91698e991793d2cfb1ccacb97.png-wm)





## 8.分享性能调优和源码阅读万变不离其宗大法

### 8.1.性能调优

```
1、资源不够时才需要调优
	资源足够的时候，只需要调大一些资 源用量
2、业务优先，运行效率靠后
	首先实现业务，有多余精力再考虑调优
3、单个作业最优不如整体最优
	全局最优
4、调优不能影响业务运行结果
	业务正确性最重要
5、调优关注点
  架构方面
  业务方面
  开发方面
  资源方面
  选择语言
```



8.2.源码阅读

```
1、了 解大概原理
  大致的启动过程
  大致的心跳机制流程
  大致的任务提交过程
2、场景驱动
  启动流程?
  数据读写流程?
  任务执行机制?
3、找入口
  启动集群的命令
  提交任务的命令
4、理主线
  namenode启动httpserver
  namenode加载元数据
  namenode启动RPCserver
5、看源码注释
  类注释
  成员变量注释
  成员方法注释
6、代码结构:
  1、参数解析和权限控制，总之为核心业务 做准备
  2、try catch,
	一般来说，核心方法，都藏于try中，异常以及容错处理，都藏于catch 中
	3、状态处理，一般用来处理核心业务的结果数据
	4、收尾，回收资源相关
7、作图
	啥都没有图好使!自从划了图，一辈子忘不了。
```

