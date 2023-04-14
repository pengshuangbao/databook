# Kafka核心技术与实战

[toc]



## 开篇词 | 为什么要学习Kafka？

截止到 2019 年，当下互联网行业最火的技术当属 ABC 了，即所谓的 AI 人工智能、BigData 大数据和 Cloud 云计算云平台

大数据业务系统为公司业务服务的，所以通常来说它们仅仅是执行一些常规的业务逻辑，因此它们不能算是**计算密集型应用，相反更应该是数据密集型**的。

如何应对**数据量激增、数据复杂度增加以及数据变化速率变快** 是个彰显能力的地方

kafka 起到了很好的效果。数据量激增来说，**Kafka 能够有效隔离上下游业务，将上游突增的流量缓存起来，以平滑的方式传导到下游子系统中**，避免了流量的不规则冲击

一套框架就能在实际业务系统中实现**消息引擎应用、应用程序集成、分布式存储构建，甚至是流处理应用的开发与部署**

![image](https://static.lovedata.net/21-03-11-960bdb8bb7dcc17cf190b8806cd889a9.png)



## 01 | 消息引擎系统ABC

### kafka是什么？

Apache Kafka 是一款开源的消息引擎系统。

这类系统引以为豪的消息传递属性，就像引擎一样，具备某种能量转换传输的能力，所以我觉得翻译成消息引擎反倒更加贴切。

#### 根据维基百科的定义

消息引擎系统是一组规范。企业利用这组规范在不同系统之间传递语义准确的消息，实现松耦合的异步式数据传递。

#### 民间说法

系统 A 发送消息给消息引擎系统，系统 B 从消息引擎系统中读取 A 发送的消息。



#### 两个事实

1. 消息引擎传输的对象是消息；
2. 如何传输消息属于消息引擎设计机制的一部分。



### 消息格式

Kafka 的选择：它使用的是**纯二进制的字节序列**。当然消息还是结构化的，只是在使用之前都要将其转换成二进制的字节序列。



### 传输协议

1. 点对点模型  也叫消息队列模型   A发送消息，只能B接受 比如打电话，一个人打电话，只能一个客服接听
2. 发布/订阅模型  它有一个主题（Topic）的概念 ，逻辑语义相近的容器  发送者（Publisher），接收方称为订阅者（Subscriber）,不同的是，不同发布者可往一个容器发，订阅者也可以存在多个。 **订报纸** 就是典型 发布/订阅模式



### 消息引擎系统和JMS的关系

JMS 是 Java Message Service，它也是支持上面这两种消息引擎模型的。严格来说它并非传输协议而仅仅是一组 API 罢了 

很多主流消息引擎系统都支持 JMS 规范，比如 ActiveMQ、RabbitMQ、IBM 的 WebSphere MQ 和 Apache Kafka

kafka未完全遵循JMS，另辟蹊径

> RabbitMQ属于比较传统的消息队列系统，支持标准的消息队列协议（AMQP, STOMP，MQTT等），如果你的应用程序需要支持这些协议，那么还是使用RabbitMQ。另外RabbitMQ支持比较复杂的consumer Routing，这点也是Kafka不提供的。



### 削峰填谷

为什么A不直接发送给B，就是因为削峰填谷

所谓的“削峰填谷”就是指缓冲上下游瞬时突发流量，使其更平滑

消息引擎系统的另一大好处在于发送方和接收方的**松耦合**，简化开发，降低依赖

比如应对秒杀、下单这种场景，更常见的办法是引入像 Kafka 这样的消息引擎系统来对抗这种上下游系统 TPS 的错配以及瞬时峰值流量

![image](https://static.lovedata.net/21-03-11-589a40b82b97c0d5a381db319f8aeb13.png)



### QA

1. kafka作为消息引擎（不考虑流式处理），对比其他消息引擎的优势，什么时候用kafka，什么时候用Active MQ等消息引擎？

   1. > Active MQ属于传统的消息中间件，支持传统的消息传输协议（AMQP, STOMP, MQTT），而且这些传统中间件（比如RabbitMQ）都支持比较复杂的消息路由，这些都是Kafka不具备的。如果你的应用要支持这些协议或者是用于SOA中的应用互联，那么这些传统消息中间件比较合适。
      >
      > 反观Kafka还是在大数据场景下孕育的框架，如果你的场景都是大数据方面的，可以考虑使用Kafka。



## 02 | 一篇文章带你快速搞定Kafka术语



### 副本（保证持久化或消息不丢失）

实现高可用的另一个手段就是备份机制（**Replication**）。备份的思想很简单，就是把相同的数据拷贝到多台机器上，而这些相同的数据拷贝在 Kafka 中被称为副本（Replica）

Kafka 定义了两类副本：领导者副本（Leader Replica）和追随者副本（Follower Replica） 前者提供服务，后者只是跟随前者。

副本的工作机制：生产者总是向领导者副本写消息；而消费者总是从领导者副本读消息。

至于追随者副本  一件事：向领导者副本发送请求，请求领导者把最新生产的消息发给它，这样它能保持与领导者的同步。



### Scalability（伸缩性）

就是所谓的分区（Partitioning） Kafka 中的分区机制指的是将每个主题划分成多个分区（Partition），每个分区是一组**有序的消息日志**。生产者生产的每条消息只会被发送到**一个分区**中

**副本**是在分区这个层级定义的， 生产者向分区写入消息，每条消息在分区中的位置信息由一个叫**位移（Offset）**的数据来表征





### Kafka三层消息架构

1. 第一层是**主题层**，每个主题可以配置 M 个分区，而每个分区又可以配置 N 个副本。
2. 第二层是**分区层**，每个分区的 N 个副本中只能有一个充当领导者角色，对外提供服务；其他 N-1 个副本是追随者副本，只是提供数据冗余之用。
3. 第三层是**消息层**，分区中包含若干条消息，每条消息的位移从 0 开始，依次递增。最后，客户端程序只能与分区的领导者副本进行交互。



### Kafka如何持久化？

Kafka 使用消息日志（Log）来保存数据，一个日志就是磁盘上一个只能追加写（Append-only）消息的物理文件

只能追加。避免 随机io ，使用顺序I/O写操作



### Kafka怎么删除日志？

通过**日志段（Log Segment）机制。**

在 Kafka 底层，一个日志又进一步细分成多个**日志段**，消息被追加写到当前最新的日志段中，

当写满了一个日志段后，Kafka 会自动切分出一个新的日志段，并将老的日志段封存起来。

Kafka 在后台还有定时任务会定期地检查老的日志段是否能够被删除，从而实现回收磁盘空间的目的。



### 什么是消费者组？

消费者组，指的是多个消费者实例共同组成一个组来消费一组主题。

这组主题中的每个分区都只会被组内的一个消费者实例消费，其他消费者实例不能消费它



### 为什么需要消费者组？

主要是为了提升消费者端的吞吐量。多个消费者实例同时消费，加速整个消费端的吞吐量（TPS）



### 什么是消费者位移（Consumer Offset）

每个消费者在消费消息的过程中必然需要有个字段记录它当前消费到了分区的哪个位置上，这个字段就是消费者位移（Consumer Offset）

### 消费者位移与消息位移有什么区别？

上面的“位移”表征的是分区内的消息位置，它是不变的 ，一旦写入，固定不变

消费者位移是随时变化的，相当于一个指示器

个人把消息在分区中的位移称为分区位移，而把消费者端的位移称为消费者位移。

### 总结

**消息**：Record。Kafka 是消息引擎嘛，这里的消息就是指 Kafka 处理的主要对象。

**主题**：Topic。主题是承载消息的逻辑容器，在实际使用中多用来区分具体的业务。

**分区**：Partition。一个有序不变的消息序列。每个主题下可以有多个分区。

**消息位移**：Offset。表示分区中每条消息的位置信息，是一个单调递增且不变的值。

**副本**：Replica。Kafka 中同一条消息能够被拷贝到多个地方以提供数据冗余，这些地方就是所谓的副本。副本还分为领导者副本和追随者副本，各自有不同的角色划分。副本是在分区层级下的，即每个分区可配置多个副本实现高可用。

**生产者**：Producer。向主题发布新消息的应用程序。

**消费者**：Consumer。从主题订阅新消息的应用程序。

**消费者位移**：Consumer Offset。表征消费者消费进度，每个消费者都有自己的消费者位移。

**消费者组**：Consumer Group。多个消费者实例共同组成的一个组，同时消费多个分区以实现高吞吐。

**重平衡**：Rebalance。消费者组内某个消费者实例挂掉后，其他消费者实例自动重新分配订阅主题分区的过程。Rebalance 是 Kafka 消费者端实现高可用的重要手段。

![img](https://static001.geekbang.org/resource/image/58/91/58c35d3ab0921bf0476e3ba14069d291.jpg)





### QA

1. 某个消费者挂掉后，其他消费者如何消费

   假设C1消费P0,P1, C2消费P2,P3。如果C1从未提交，C1挂掉，C2开始消费P0,P1，发现没有对应提交位移，那么按照C2的auto.offset.reset值决定从那里消费，如果是earliest，从P0，P1的最小位移值（可能不是0）开始消费，如果是latest，从P0, P1的最新位移值（分区高水位值）开始消费。但如果C1之前提交了位移，那么C1挂掉之后C2从C1最新一次提交的位移值开始消费。

   所谓的重复消费是指，C1消费了一部分数据，还没来得及提交这部分数据的位移就挂了。C2承接过来之后会重新消费这部分数据。

2. 为什么副本不提供对外读？

   Kafka不采用主从分离的讨论最近火起来了。如果要让follower抗读，需要解决很多一致性的问题，另外Kafka也不属于典型的读多写少场景，**主从分离**的优势不明显。

3. 文中最后一个图所示，假如broker1挂掉，broker2上的follower副本会变为leader副本吗？假如不止一个follower副本，是不是有某种选举方式来决定哪个follower副本会升级为leader副本？

   从follower中选择leader的算法如下：

   1. 从ISR中选择存活的第一个副本为新leader
   2. 如果ISR为空，看是否开启了unclea n leader选举，
      1. 如果没有开启，那么Kafka干脆就不选leader了，直接将分区置于不可用状态；
      2. 否则Kafka就从剩下的存活副本中选第一个副本作为leader（这里的顺序就是ZooKeeper中保存的副本集合顺序，即assigned_replicas项）

4. 客户端会首先请求topic分区的leader副本在哪个broker上，内部自动执行的,怎么选的？

   客户端发送Metadata请求获取每个topic分区的leader，之后再发送真实的数据请求（Produce请求或Fetch请求）



## 03 | Kafka只是消息引擎系统吗？



### Apache Kafka 真的只是消息引擎吗

Apache Kafka 是消息引擎系统，也是一个分布式流处理平台（Distributed Streaming Platform）



### Kafka 在设计之初就旨在提供三个方面的特性：

1. 提供一套 API 实现生产者和消费者；
2. 降低网络传输和磁盘存储开销；
3. 实现高伸缩性架构。



### Kafka 社区的思考

与其我把数据从一个系统传递到下一个系统中做处理，我为何不自己实现一套流处理框架呢？

于是 Kafka 社区于 0.10.0.0 版本正式推出了流处理组件 Kafka Streams

这个版本开始，Kafka 正式“变身”为**分布式的流处理平台**，而不仅仅是**消息引擎系统**了。今天 Apache Kafka 是和 Apache Storm、Apache Spark 和 Apache Flink 同等级的实时流处理平台。

### Kafka 与其他主流大数据流式计算框架相比，优势在哪里？

#### 第一点是更容易实现端到端的正确性（Correctness）

谷歌大神Tyler：

流处理要替代他的兄弟“批处理” 需要具备两点核心优势：要实现正确性和提供能够推导时间的工具。实现正确性是流处理能够匹敌批处理的基石。

正确性一直是**批处理**的强项，而实现正确性的**基石**则是要求框架能提供**精确一次处理语义**，

**即处理一条消息有且只有一次机会能够影响系统状态**。

##### 主流大数据流处理框架：

目前主流的大数据流处理框架都宣称实现了精确一次处理语义，但这是**有限定条件**的，即它们只能**实现框架内的精确一次处理语义**，无法实现端到端的。

**Kafka** 则不是这样，因为所有的**数据流转和计算都在 Kafka 内部完成**，故 Kafka 可以实现**端到端**的精确一次处理语义。

> 这说的就是0.11之前的故事。**事实上，Apache Flink从1.4开始推出了支持E2E Exactly-Once语义的两阶段SinkFunction。它用的就是Kafka 0.11的事务**



#### 可能助力 Kafka 胜出的第二点是它自己对于流式计算的定位。

Kafka Streams 是一个用于搭建实时流处理的**客户端库**而非是一个完整的功能系统

没有集群调度、弹性部署等开箱即用的运维特性

**双刃剑**。 不愿正面PK其他流处理框架的考量。

因为面向 中小企业  数据量小，逻辑简单 几台服务就能搞定。不用重量型完整平台。



![image](https://static.lovedata.net/21-03-11-8e912cf7fb738682b0f4a1712fabd25a.png)





## 04 | 我应该选择哪种Kafka？



Kafka Connect 通过一个个具体的连接器（Connector），串联起上下游的外部系统。

![image](https://static.lovedata.net/21-03-12-543af39100f6188f62b0bf9a68050366.png)





### 你知道几种 Kafka？

#### 1. Apache Kafka

正宗，后面的“发行版”的基础，顶级项目

优势： 社区活跃

劣势： 提供最最基础的组件  Kafka Connect 只有文件连接器  没有任何监控框架和工具 弥补： Kafka manager

仅仅需要一个消息引擎系统亦或是简单的流处理应用场景，同时需要对系统有较大把控度，那么我推荐你使用 Apache Kafka

#### 2. Confluent Kafka

Confluent ，创始人出于 Linkedin ，饶军，清华大神。

从事商业化 Kafka 工具开发，并在此基础上发布了 Confluent Kafka。

Confluent Kafka 提供了一些 Apache Kafka 没有的高级特性，比如**跨数据中心备份、Schema 注册中心以及集群监控工具**等。

| 免费版                | 企业版                                     |
| --------------------- | ------------------------------------------ |
| Apache Kafka 非常相像 | HTTP 接口的方式允许你通过网络访问 Kafka 的 |
| Schema 注册中心       | 跨数据中心备份和集群监控                   |
| REST proxy            |                                            |
| 更多的连接器          |                                            |



劣势： Confluent Kafka 在国内的普及率是比较低的



#### 3. Cloudera/Hortonworks Kafka

CDH HDP 大数据平台

优势： 天然集成， 安装 部署 监控 有现成的

劣势： 版本滞后性

如果你需要快速地搭建消息引擎系统，或者你需要搭建的是多框架构成的数据平台且 Kafka 只是其中一个组件，那么我推荐你使用这些大数据云公司提供的 Kafka。

![image](https://static.lovedata.net/21-03-12-b568e63fd10887ef2289a0451b017294.png)



### QA

1. kafka-manager 替代品

   试JMXTrans + InfluxDB + Grafana

2. 场景 confluent套件，线上用到了kafka, schema registry和ksql，其中ksql用于实时指标计算



## 05 | 聊聊Kafka的版本号

![image](https://static.lovedata.net/21-03-12-1b0cc8fb6f7fb76fffcfc182d7a63eb8.png)

版本号实际上是 2.1.1  

2 表示大版本号 Major-version 

中间的 1 表示小版本号或次版本号，即 Minor Version

最后的 1 表示修订版本号，也就是 Patch 号

**0.10.2.2**，你现在就知道了它的大版本是 0.10，小版本是 2，总共打了两个大的补丁，Patch 号是 2。



### 版本演进

7 个大版本，分别是 **0.7、0.8、0.9、0.10、0.11、1.0 和 2.0**

| 版本 | 特点                                                         |
| ---- | ------------------------------------------------------------ |
| 0.7  | 上古版本 基础消息队列功能，没人用过                          |
| 0.8  | 副本机制； 真正意义上完备的分布式高可靠消息队列解决方案 <br />使用老版本客户端API，指定Zookeeper地址而非broker<br /> |
| 0.9  | 2015 基础的安全认证 / 权限功能<br />使用 Java 重写了新版本消费者 API<br />新版本 Producer API 在这个版本中算比较稳定了 |
| 0.10 | 里程碑： 引入了 Kafka Streams<br />正式升级成分布式流处理平台 |
| 0.11 | 2017 <br />一个是提供幂等性 Producer API 以及事务（Transaction） API； 流处理结果正确性的基石<br />另一个是对 Kafka 消息格式做了重构。<br />建议版本0.11.0.3；谨慎对待消息格式变化 |
| 1.0  | Kafka-stream 的改进                                          |
| 2.0  | Kafka-stream 的改进                                          |



![image](https://static.lovedata.net/21-03-12-44970d6accf002f0b7a2aa3093c052df.png)



### QA

1. kafka如何做压力测试，它的参考主要指标是什么，比如QPS,最大连接数，延迟等等。

   Kafka提供了命令行脚本可以执行producer和consumer的性能测试，主要指标还是TPS，延时

2. 扩容如何做到平滑扩容，不影响原业务

​     增加broker很简单，也不会对现有业务有影响。关键是做好迁移计划——比如避开业务高峰时刻，如果迁移对业务影响最小



## 06 | Kafka线上集群部署方案怎么做？

### 操作系统

Linux 的表现更胜一筹

- I/O 模型的使用
  - 五种IO模型： 阻塞式 I/O、非阻塞式 I/O、I/O 多路复用、信号驱动 I/O 和异步 I/O
  - 实际上 Kafka 客户端底层使用了 Java 的 **selector**，selector 在 Linux 上的实现机制是 epoll，而在 Windows 平台上的实现机制是 select。因此在这一点上将 Kafka 部署在 Linux 上是有优势的，因为能够获得更高效的 I/O 性能。
- 数据网络传输效率
  - 零拷贝（Zero Copy）技术
  - 当数据在磁盘和网络进行传输时避免昂贵的内核态数据拷贝从而实现快速的数据传输
  - 在 Linux 部署 Kafka 能够享受到零拷贝技术所带来的快速数据传输特性。
- 社区支持度
  - windows版本社区不做任何承诺



### 磁盘

使用普通机械硬盘即可

Kafka是 顺序读写操作，一定程度上规避了**机械磁盘**最大的劣势，即**随机读写操作**慢

这一点，SSD没有任何优势

#### 是否使用RAID

raid的优势

1. 提供冗余的磁盘存储空间
   1. kafka： 自己实现了冗余机制来提供高可靠性
2. 提供负载均衡
   1. kafka： 分区的概念，提供负载均衡

#### 建议

1. 追求性价比的公司可以不搭建 RAID，使用普通磁盘组成存储空间即可。

2. 使用机械磁盘完全能够胜任 Kafka 线上环境。



### 磁盘容量

Kafka 集群发送 1 亿条消息，每条消息保存两份以防止数据丢失，另外消息默认保存两周时间。现在假设消息的平均大小是 1KB，Kafka 集群需要为这个业务预留多少磁盘空间吗？

每天 1 亿条 1KB 大小的消息，保存两份且留存两周的时间，那么总的空间大小就等于 

**1 亿 * 1KB * 2 / 1000 / 1000 = 200GB。**

一般情况下 Kafka 集群除了消息数据还有其他类型的数据，比如索引数据等，故我们再为这些数据预留出 10% 的磁盘空间，

**因此总的存储容量就是 220GB。**

既然要保存两周，那么整体容量即为

 **220GB * 14，大约 3TB 左右。**

Kafka 支持数据的压缩，假设压缩比是 0.75，那么最后你需要规划的存储空间就是

 **0.75 * 3 = 2.25TB。**



#### 考虑的点：

1. 新增消息数
2. 消息留存时间
3. 平均消息大小
4. 备份数
5. 是否启用压缩



### 带宽

带宽也主要有两种：1Gbps 的千兆网络（一般公司标配）和 10Gbps 的万兆网络

带宽资源的**规划**，其实真正要**规划**的是所需的 **Kafka** 服务器的数量

机房环境是千兆网络，即 1Gbps，现在你有个业务，其业务目标或 SLA 是在 **1 小时内处理 1TB** 的业务数据。你到底需要多少台 Kafka 服务器来完成这个业务呢？

带宽是 1Gbps，即每秒处理 1Gb 的数据

如果机器kafka独享，kafka能用到70%的宽带资源，每台服务器 700Mb的宽带资源

不能让kafka常规性的使用这么多宽带资源，预留2/3的资源,则 700Mb/3 = 240Mbps

1 小时内处理 1TB 数据 ,则每秒钟需要处理 1TB x 1000 x 1000 / 60 / 60 =  277MB 

 1B = 8b  则 277MB = 277x8 = 2300+Mb

2300/240 约等于 10 ，如果还需要额外复制三个副本 则需要乘以3 30 台



![image](https://static.lovedata.net/21-03-12-99a5253aef92b25771cbcc559ad692a1.png)



## 07 | 最最最重要的集群参数配置（上）



### Broker 端参数

#### 存储相关

log.dirs   若干个文件目录路径 配置多个目录，最好每个目录挂在不同的磁盘上。 好处：

1. 提升读写性能
2. 故障转移 1.1版本引入功能，之前磁盘挂掉，broker停止运行，之后，可以将挂掉的磁盘数据转移到正常的上面去。



#### ZooKeeper相关

分布式协调框架，负责协调管理并保存 Kafka 集群的所有元数据信息，比如集群都有哪些 Broker 在运行、创建了哪些 Topic，每个 Topic 都有多少分区以及这些分区的 Leader 副本都在哪些机器上等信息。

zookeeper.connect  zk链接地址 



#### Broker 连接

**listeners**： 监听器，其实就是告诉外部连接者要通过什么协议访问指定主机名和端口开放的 Kafka 服务。

**advertised.listeners** ： 多了个advertised，就是broker 用于对外发布的

host.name/port: 忘了她，过期了，不用制定



**监听器**

若干个逗号分隔的三元组，每个三元组的格式为<协议名称，主机名，端口号>

PLAINTEXT 表示明文传输、SSL 表示使用 SSL 或 TLS 加密传输等

##### 主机名这个设置中我到底使用 IP 地址还是主机名？

最好全部使用**主机名**，即 Broker 端和 Client 端应用配置中全部填写主机名。 Broker 源代码中也使用的是主机名，如果你在某些地方使用了 IP 地址进行连接，可能会发生无法连接的问题。

#### Topic管理

**auto.create.topics.enable**：是否允许自动创建 Topic。

建议 false。防止乱建

**unclean.leader.election.enable**：是否允许 Unclean Leader 选举。

建议设置为false

kafka每个分区都有多个副本来提供高可用。在这些副本中只能有一个副本对外提供服务，即所谓的 Leader 副本。

只有保存数据比较多的副本才有资格选举leader，如果这些数据较多副本都挂了怎么办了？ 如果是false，不允许落后太多副本选举，则这个分区不可用。因为没有leader。  

反之如果是true，则可以选举，但是有些数据可能丢了。副本保存的本来就不全。

**auto.leader.rebalance.enable**：是否允许定期进行 Leader 选举。

建议为false，因为这个会定期选举，本来好好的，去选举，选举开销较大。

#### 数据留存方面的

log.retention.{hours|minutes|ms}：这是个“三兄弟”，都是控制一条消息数据被保存多长时间。

一般设置成  log.retention.hours=168表示默认保存 7 天的数据

log.retention.bytes：这是指定 Broker 为消息保存的总磁盘容量大小。

默认是-1，保存多少数据都可以。

message.max.bytes：控制 Broker 能够接收的最大消息大小。

默认 1000012  不到 1MB。比较小



![image](https://static.lovedata.net/21-03-16-1667fab587c23c20082542a6019b2b52.png)



## 08 | 最最最重要的集群参数配置（下）



### Topic 级别参数



Topic 级别参数会覆盖全局 Broker 参数的值

retention.ms：规定了该 Topic 消息被保存的时长。默认是 7 天，即该 Topic 只保存最近 7 天的消息。一旦设置了这个值，它会覆盖掉 Broker 端的全局参数值。retention.bytes：规定了要为该 Topic 预留多大的磁盘空间。和全局参数作用相似，这个值通常在多租户的 Kafka 集群中会有用武之地。当前默认值是 -1，表示可以无限使用磁盘空间。

max.message.bytes。它决定了 Kafka Broker 能够正常接收该 Topic 的最大消息大小



### 设置方式

#### 创建的时候设置

```shell
bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic transaction --partitions 1 --replication-factor 1 --config retention.ms=15552000000 --config max.message.bytes=5242880
```

#### 修改 Topic 时设置

```shell
bin/kafka-configs.sh --zookeeper localhost:2181 --entity-type topics --entity-name transaction --alter --add-config max.message.bytes=10485760
```



### JVM 参数

不建议 jdk6 和 jdk7 jdk6太老了

2.0.0 版本开始，已经正式摒弃对 Java 7 只少java8

#### 堆大小

将你的 JVM 堆大小设置成 6GB 吧，默认1GB，太小了。



#### GC

Java7

CPU资源充足，CMS -XX:+UseCurrentMarkSweepGC ，否则 **吞吐量收集器**。开启方法是指定-XX:+UseParallelGC。

Java 8

手动设置G1，更少的Full GC



#### 如何设置

在启动之前，执行下面设置环境变量

```shell
$> export KAFKA_HEAP_OPTS=--Xms6g  --Xmx6g
$> export KAFKA_JVM_PERFORMANCE_OPTS= -server -XX:+UseG1GC -XX:MaxGCPauseMillis=20 -XX:InitiatingHeapOccupancyPercent=35 -XX:+ExplicitGCInvokesConcurrent -Djava.awt.headless=true
$> bin/kafka-server-start.sh config/server.properties
```



### 操作系统参数

#### 文件描述符限制

```shell
ulimit -n
```

调大了，没什么影响。，搞到 1000000 ，设置大一些，否则经常 “Too many open files”

#### 文件系统类型

XFS强于EXT4

#### Swappiness

有些人直接设置成0，不建议设置成0，为0的话，内存耗尽会出发 OOM Killer组建，随机挑选进程kill，没有预警， 

设置一个较小值，比如1，当耗尽的时候，broker性能急剧下降，给一个调优和诊断问题的时间。

#### 提交时间

想kafka发送数据，不是落盘，才认为成功，而是 只要数据被写入到操作系统的页缓存（Page Cache）上就可。

随后操作系统就会根据 LRU算法，定期将 页缓存落盘。这个定期就有提交时间确定，默认是5秒。 

人为太频繁了，可以适当增加提交时间降低物理磁盘些操作。



![image](https://static.lovedata.net/21-03-16-fa590b7dd72bf963d2162c63caf07eb0.png)



## 09 | 生产者消息分区机制原理剖析



### 为什么分区

![image](https://static.lovedata.net/21-03-22-9c66506d6f93b46816fb2675d046046c.png)



分区的作用就是提供**负载均衡**的能力，或者说对数据进行分区的主要原因，就是为了实现系统的**高伸缩性（Scalability）**

**Kafka** 中叫分区，在 MongoDB 和 Elasticsearch 中就叫分片 Shard，而在 HBase 中则叫 Region，在 Cassandra 中又被称作 vnode

还可以实现业务界别的消息顺序的问题。

### 分区策略

所谓分区策略是决定生产者将消息发送到哪个分区的算法。

partitioner.class   org.apache.kafka.clients.producer.Partitioner



#### 轮询策略 Round-robin 顺序分配，默认的分区策略

![image](https://static.lovedata.net/21-03-22-6511323409ecbcaf8a07615199530ffe.png)



**轮询策略有非常优秀的负载均衡表现，它总是能保证消息最大限度地被平均分配到所有分区上，故默认情况下它是最合理的分区策略，也是我们最常用的分区策略之一。**

#### 随机策略 Randomness，

![image](https://static.lovedata.net/21-03-22-93f48d1d0144070d3cc2b33a33dbafcd.png)



也是力求均匀，但是表现没有轮询策略好， **如果追求数据的均匀分布，还是使用轮询策略比较好**



#### 按消息键保序策略  Key-ordering 策略

消息都有key，有明确业务含义的字符串，客户代码、部门编号、业务ID等。 特别 kafka不支持时间戳的肩带，我经常将创建时间封装在key里面。 

同一个key的消息都进入到相同的分区  **每个分区的消息处理都是有顺序的**，所以 被称为 **按照消息键保序策略**

![image](https://static.lovedata.net/21-03-22-1ab0f3026b8c630a52619c24e8c8cb5e.png)



> Kafka 默认分区策略实际上同时实现了两种策略：如果指定了 Key，那么默认实现按消息键保序策略；如果没有指定 Key，则使用轮询策略。



![image](https://static.lovedata.net/21-03-22-d186abb4f1a54f6120aecbbc72b6c200.png)



## 10 | 生产者压缩算法面面观

压缩（compression） 时间换空间的经典 trade-off 思想 ，CPU时间换取 磁盘空间和网络I/O传输量， 

### 怎么压缩

Kafka 共有两大类消息格式，社区分别称之为 V1 版本和 V2 版本。V2 版本是 Kafka 0.11.0.0 中正式引入的。

任何版本 Kafka 的消息层次都分为两层：**消息集合（message set）以及消息（message）**。一个消息集合中包含若干条日志项（record item），而日志项才是真正封装消息的地方

kafka通常不会直接操作一条条消息，而是在消息集合上面操作



#### v2和v1有什么区别？做了什么改进？

消息的公共部分抽取出来放到外层消息集合里面，这样就不用每条消息都保存这些信息了。

v1每条消息都需要CRC校验(CRC会变的)，而在v2中，消息的crc校验移到了**消息集合**这一层了

#### 压缩方式的变化

V1 版本中保存压缩消息的方法是把多条消息进行压缩然后保存到外层消息的消息体字段中

V2 版本的做法是对整个消息集合进行压缩，显然压缩效果更好

![image](https://static.lovedata.net/21-03-22-bd39fa706998854efece4c9162418199.png)



### 什么时候压缩

生产者和消费者。 

生产者配置 compression.type

broker端的压缩

大部分情况下 Broker 从 Producer 端接收到消息后仅仅是原封不动地保存而不会对其进行任何修改。 有两个李伟：

1. Broker 端指定了和 Producer 端不同的压缩算法。
   1. 可能会发生预料之外的压缩 / 解压缩操作，通常表现为 Broker 端 CPU 使用率飙升。
2. Broker 端发生了消息格式转换。
   1. 兼容老版本的消费者程序
   2. 丧失了Zero copy特性



### 何时解压缩？

#### 消费者程序

通常是在消费者程序中。通过消息体来的值压缩算法

Producer 端压缩、Broker 端保持、Consumer 端解压缩。

#### broker端解压缩

和前面消息格式转换发生解压缩不同，  每个压缩过的消息集合在 Broker 端写入时都要发生解压缩操作，目的就是为了对消息执行各种验证 ，的确会影响性能。

消息娇艳是非常重要的。



### 压缩算法对比

Kafka 支持 3 种压缩算法：GZIP、Snappy 和 LZ4。从 2.1.0 开始，Kafka 正式支持 Zstandard 算法（简写为 zstd），提供超高压缩比

![image](https://static.lovedata.net/21-03-22-906bbfef5fabe89f6d5005ef3d200b44.png)



>  zstd 算法有着最高的压缩比，而在吞吐量上的表现只能说中规中矩。反观 LZ4 算法，它在吞吐量方面则是毫无疑问的执牛耳者



### 最佳实践

如果客户端机器 CPU 资源有很多富余，强烈建议你开启 **zstd** 压缩，这样能极大地节省网络资源消耗。

![img](https://static001.geekbang.org/resource/image/ab/df/ab1578f5b970c08b9ec524c0304bbedf.jpg)



### 消息结构的描述补充：

消息（v1叫message，v2叫record）是分批次（batch）读写的，batch是kafka读写（网络传输和文件读写）的基本单位，不同版本，对相同（或者叫相似）的概念，叫法不一样。
v1（kafka 0.11.0之前）:message set, message
v2（kafka 0.11.0以后）:record batch,record
其中record batch对英语message set，record对应于message。
一个record batch（message set）可以包含多个record（message）。

对于每个版本的消息结构的细节，可以参考kafka官方文档的5.3 Message Format 章，里面对消息结构列得非常清楚。





### QA

1. 假如一个消息集合里有10条消息，并且被压缩，但是消费端配置每次只poll 5条消息。这种情况下，消费端怎么解压缩？矛盾点是 如果只取5条消息，需要broker帮助解压缩；如果取整个消息集合10条消息，会有贷款等资源的浪费？

   答：目前java consumer的设计是一次取出一批，缓存在客户端内存中，然后再过滤出max.poll.records条消息返给你，也不算太浪费吧，毕竟下次可以直接从缓存中取，不用再发请求了。

2. broker在接收producer消息并落盘这块貌似没有用零拷贝啊！只有传输给consumer时用了，求解答

   答： 就是你理解的那样。Kafka使用Zero Copy优化将页缓存中的数据直接传输到Socket——这的确是发生在broker到consumer的链路上。这种优化能成行的前提是consumer端能够识别磁盘上的消息格式。



## 11 | 无消息丢失配置怎么实现？

### 那 Kafka 到底在什么情况下才能保证消息不丢失呢？

一句话概括，Kafka 只对“已提交”的消息（committed message）做有限度的持久化保证。

#### 已提交的消息

当 Kafka 的若干个 Broker 成功地接收到一条消息并写入到日志文件后，它们会告诉生产者程序这条消息已成功提交。此时，这条消息在 Kafka 看来就正式变为“已提交”消息了。

> 若干个：
>
> 选择只要有一个 Broker 成功保存该消息就算是已提交，也可以是令所有 Broker 都成功保存该消息才算是已提交

### 有限度的持久化

Kafka 不可能保证在任何情况下都做到不丢失消息 ，地球不存在了了。

是有前提条件的，如果消息存在N个broker上，前提是至少要有一个存活。 这个条件成立，就能保证永远不丢失。

**kafka 是能做到不丢失消息的，只不过这些消息必须是已提交的消息，而且还要满足一定的条件**



“丢失案例”

### 案例 1：生产者程序丢失数据

最常见。

#### 原因

kafka produer 是异步发送消息的。也就是 send(msg) 这个API，通常立即返回的。但是此时你不能认为发送成功了。

“fire and forget”，翻译一下就是“发射后不管” 有很多情况导致发送失败

1. 网络dousing
2. 消息不合格，消息太大了。



#### 解决

Producer 永远要使用带有回调通知的发送 API，也就是说不要使用 producer.send(msg)，而要使用 producer.send(msg, callback)，能够得知是否提交成功。

瞬间错误，重试就可以了，格式问题，调整格式。



### 案例 2：消费者程序丢失数据

Consumer 端要消费的消息不见了，位移的概念，表示要消费的位置。

![image](https://static.lovedata.net/21-03-23-701edb755ce247f6482f1e857b8d3421.png)

应对这种情况的消息丢失

**维持先消费消息（阅读），再更新位移（书签）的顺序**，可能会带来的问题是重复处理。

另一种情况

这就好比 Consumer 程序从 Kafka 获取到消息后开启了多个线程异步处理消息，而 Consumer 程序自动地向前更新位移。假如其中某个线程运行失败了，它负责的消息没有被成功处理，但位移已经被更新了，因此这条消息对于 Consumer 而言实际上是丢失了。

解决办法：

**如果是多线程异步处理消费消息，Consumer 程序不要开启自动提交位移，而是要应用程序手动提交位移**



### 最佳实践



1. 不要使用 producer.send(msg)，而要使用 producer.send(msg, callback)。记住，一定要使用带有回调通知的 send 方法。
2. 设置 acks = all。acks 是 Producer 的一个参数，代表了你对“已提交”消息的定义。如果设置成 all，则表明所有副本 Broker 都要接收到消息，该消息才算是“已提交”。这是最高等级的“已提交”定义。
3. 设置 retries 为一个较大的值。这里的 retries 同样是 Producer 的参数，对应前面提到的 Producer 自动重试。当出现网络的瞬时抖动时，消息发送可能会失败，此时配置了 retries > 0 的 Producer 能够自动重试消息发送，避免消息丢失。
4. 设置 unclean.leader.election.enable = false。这是 Broker 端的参数，它控制的是哪些 Broker 有资格竞选分区的 Leader。如果一个 Broker 落后原先的 Leader 太多，那么它一旦成为新的 Leader，必然会造成消息的丢失。故一般都要将该参数设置成 false，即不允许这种情况的发生。
5. 设置 replication.factor >= 3。这也是 Broker 端的参数。其实这里想表述的是，最好将消息多保存几份，毕竟目前防止消息丢失的主要机制就是冗余。
6. 设置 min.insync.replicas > 1。这依然是 Broker 端参数，控制的是消息至少要被写入到多少个副本才算是“已提交”。设置成大于 1 可以提升消息持久性。在实际环境中千万不要使用默认值 1。
7. 确保 replication.factor > min.insync.replicas。如果两者相等，那么只要有一个副本挂机，整个分区就无法正常工作了。我们不仅要改善消息的持久性，防止数据丢失，还要在不降低可用性的基础上完成。推荐设置成 replication.factor = min.insync.replicas + 1。
8. 确保消息消费完成再提交。Consumer 端有个参数 enable.auto.commit，最好把它设置成 false，并采用手动提交位移的方式。就像前面说的，这对于单 Consumer 多线程处理的场景而言是至关重要的。

![image](https://static.lovedata.net/21-03-23-a3d09751b3d4bd16c07b70b5042ea27e.png)



ISR : In-Sync Replicas，这是一个副本集合，里面的所有副本都是和Leader副本保持同步的





### QA

1. ack=1的时候，min.insync.replicas还会生效吗？或者说还有必要吗

   不生效，min.insync.replicas只有在acks=-1时才生效

   acks 指定了必须要多少个分区副本收到消息，生产者才会认为消息写入是成功的。

   1. acks=0 不会等待任何来自服务器的响应，可能会丢消息，但是又更大的吞吐量
   2. acks=1 只要首领leader收到消息，就会收到成功响应（如果leader节点异常了，一个没有收到消息的节点成为新leader，还是会丢失）
   3. acks=all 只有参与复制的节点全部收到消息，才会收到成功响应 延迟较高

2. 如果我有10个副本，isr=10，然后我配置ack=all，min.insync.replicas=5，这时候这两个参数以谁为准，生产一个消息，必须是全部副本都同步才算提交，还是只要5个副本才算提交？

    min.insync.replicas是保证下限的。acks=all的含义是producer会等ISR中所有副本都写入成功才返回，但如果不设置min.insync.replicas = 5，默认是1，那么假设    ISR中只有1个副本，只要写入这个副本成功producer也算其正常写入，因此min.insync.replicas保证的写入副本的下限。

​       acks=all表示消息要写入所有ISR副本，但没要求ISR副本有多少个。min.insync.replicas做了这样的保证

3.   replication.factor 和 min.insync.replicas为什么不能相等呢，假如都是2，不可以吗，挂掉一个副本还有一个副本可用啊。

​      没有说不可以相等。如果都是2，挂掉一个副本，producer也就无法写入了，因为不满足min.insync.replicas的要求了



## 12 | 客户端都有哪些不常见但是很高级的功能？

### 什么是拦截器？

基本思想就是允许应用程序在不修改逻辑的情况下，动态地实现一组可插拔的事件处理逻辑链路

![image](https://static.lovedata.net/21-03-29-fc6a0d43c88e1bbb4ceebfba230a32d6.png)



### Kafka 拦截器

Kafka 拦截器分为生产者拦截器和消费者拦截器

生产者拦截器允许你在**发送消息前**以及**消息提交成功后**植入你的拦截器逻辑

消费者拦截器支持在**消费消息前**以及**提交位移后**编写特定逻辑

使用配置。interceptor.classes



org.apache.kafka.clients.producer.ProducerInterceptor 发送拦截器实现

1. onSend  发送之前被调用
2. onAcknowledgement  消息成功提交或发送失败之后被调用  ，调用要早于 callback



org.apache.kafka.clients.consumer.ConsumerInterceptor

1. onConsume
2. onCommit



#### 应用场景

客户端监控、端到端系统性能检测、消息审计等

端到端的监控。   

Kafka 默认提供的监控指标都是针对单个客户端或 Broker 的，你很难从具体的消息维度去追踪集群间消息的流转路径。同时，如何监控一条消息从生产到最后消费的端到端延时也是很多 Kafka 用户迫切需要解决的问题



### 拦截器案例 - 消息端到端处理的延时

业务消息从被生产出来到最后被消费的平均总时长是多少 ，需要有一个公共的地方保存，放在redis中

消费者拦截器中，我们在真正消费一批消息前首先更新了它们的总延时，方法就是用当前的时钟时间减去封装在消息中的创建时间，然后累计得到这批消息总的端到端处理延时并更新到 Redis 中。之后的逻辑就很简单了，我们分别从 Redis 中读取更新过的总延时和总消息数，两者相除即得到端到端消息的平均处理延时。

```java

public class AvgLatencyProducerInterceptor implements ProducerInterceptor<String, String> {


    private Jedis jedis; // 省略Jedis初始化


    @Override
    public ProducerRecord<String, String> onSend(ProducerRecord<String, String> record) {
        jedis.incr("totalSentMessage");
        return record;
    }


    @Override
    public void onAcknowledgement(RecordMetadata metadata, Exception exception) {
    }


    @Override
    public void close() {
    }


    @Override
    public void configure(Map<java.lang.String, ?> configs) {
    }
```



```java

public class AvgLatencyConsumerInterceptor implements ConsumerInterceptor<String, String> {


    private Jedis jedis; //省略Jedis初始化


    @Override
    public ConsumerRecords<String, String> onConsume(ConsumerRecords<String, String> records) {
        long lantency = 0L;
        for (ConsumerRecord<String, String> record : records) {
            lantency += (System.currentTimeMillis() - record.timestamp());
        }
        jedis.incrBy("totalLatency", lantency);
        long totalLatency = Long.parseLong(jedis.get("totalLatency"));
        long totalSentMsgs = Long.parseLong(jedis.get("totalSentMessage"));
        jedis.set("avgLatency", String.valueOf(totalLatency / totalSentMsgs));
        return records;
    }


    @Override
    public void onCommit(Map<TopicPartition, OffsetAndMetadata> offsets) {
    }


    @Override
    public void close() {
    }


    @Override
    public void configure(Map<String, ?> configs) {
```

![image](https://static.lovedata.net/21-03-29-de8af4eb4bacf84dad1151d700774f39.png)







## 13 | Java生产者是如何管理TCP连接的？



Kafka 是基于 TCP 的，而不是基于 HTTP 或其他协议 生产者、消费者，还是 Broker 之间的通信都是如此

```java

Properties props = new Properties ();
props.put(“参数1”, “参数1的值”)；
props.put(“参数2”, “参数2的值”)；
……
try (Producer<String, String> producer = new KafkaProducer<>(props)) {
            producer.send(new ProducerRecord<String, String>(……), callback);
  ……
}
```



### 何时创建 TCP 连接？

在创建 KafkaProducer 实例时，生产者应用会在后台创建并启动一个名为 Sender 的线程，该 Sender 线程开始运行时首先会创建与 Broker 的连接

Producer 会连接 bootstrap.servers 参数指定的所有 Broker

如果为这个参数指定了 1000 个 Broker 连接信息，那么很遗憾，你的 Producer 启动时会首先创建与这 1000 个 Broker 的 TCP 连接。

不建议把集群中所有的 Broker 信息都配置到 bootstrap.servers 中，通常你指定 3～4 台就足以了，知道一台broker就能拿到整个集群的broker信息。

TCP 连接是在创建 KafkaProducer 实例时建立的

TCP 连接还可能在两个地方被创建：一个是在更新元数据后，另一个是在消息发送时



### 何时关闭 TCP 连接？

一种是用户主动关闭；一种是 Kafka 自动关闭。

这里的主动关闭实际上是广义的主动关闭

第二种是 Kafka 帮你关闭，这与 Producer 端参数 connections.max.idle.ms 的值有关。默认情况下该参数值是 9 分钟，即如果在 9 分钟内没有任何请求“流过”某个 TCP 连接，那么 Kafka 会主动帮你把该 TCP 连接关闭。



### 小结

1. KafkaProducer 实例创建时启动 Sender 线程，从而创建与 bootstrap.servers 中所有 Broker 的 TCP 连接。
2. KafkaProducer 实例首次更新元数据信息之后，还会再次创建与集群中所有 Broker 的 TCP 连接。
3. 如果 Producer 端发送消息到某台 Broker 时发现没有与该 Broker 的 TCP 连接，那么也会立即创建连接。
4. 如果设置 Producer 端 connections.max.idle.ms 参数大于 0，则步骤 1 中创建的 TCP 连接会被自动关闭；
5. 如果设置该参数 =-1，那么步骤 1 中创建的 TCP 连接将无法被关闭，从而成为“僵尸”连接。

![image](https://static.lovedata.net/21-03-30-5a57423e6d7620a9ae08ecab241bc5e8.png)





### QA

1. Kafka的元数据信息是存储在zookeeper中的，而Producer是通过broker来获取元数据信息的，那么这个过程是否是这样的，Producer向Broker发送一个获取元数据的请求给Broker，之后Broker再向zookeeper请求这个信息返回给Producer?
   1. 集群元数据持久化在ZooKeeper中，同时也缓存在每台Broker的内存中，因此不需要请求ZooKeeper
2. 如果Producer在获取完元数据信息之后要和所有的Broker建立连接，那么假设一个Kafka集群中有1000台Broker，对于一个只需要与5台Broker交互的Producer，它连接池中的链接数量是不是从1000->5->1000->5?这样不是显得非常得浪费连接池资源？
   1.  就我个人认为，的确有一些不高效。所以我说这里有优化的空间的。
3. Kafka集群的元数据信息是保存在哪里的呢，以CDH集群为例
   1.  最权威的数据保存在ZooKeeper中，Controller会从ZooKeeper中读取并保存在它自己的内存中，然后同步部分元数据给集群所有Broker





## 14 | 幂等生产者和事务生产者是一回事吗？

> Kafka 消息交付可靠性保障以及精确处理一次语义的实现。



### 消息交付可靠性保障，是指 Kafka 对 Producer 和 Consumer 要处理的消息提供什么样的承诺

常见三种



1. 最多一次（at most once）：消息可能会丢失，但绝不会被重复发送。
2. 至少一次（at least once）：消息不会丢失，但有可能被重复发送。
3. 精确一次（exactly once）：消息不会丢失，也不会被重复发送。

默认可靠性保证是第二种。“已经提交”的含义： 只有broker成功提交消息并且producer接收到 broker的应答才会认为消息成功发送。 如果 消息成功提交，但是produer没有收到应答（网络抖动），那么produer就无法确定消息是否真的提交了。因此只能充实。可能发送相同的消息。

Kafka 是怎么做到精确一次的呢？简单来说，这是通过两种机制：幂等性（Idempotence）和事务（Transaction）



### 什么是幂等性（Idempotence）？

数学领域中的概念，指的是某些操作或函数能够被执行多次，但每次得到的结果都是不变的。

幂等性有很多好处，其最大的优势在于我们可以安全地重试任何幂等性操作，反正它们也不会破坏我们的系统状态

#### 幂等性 Producer

Producer 默认不是幂等性的

可以创建幂等性 Producer。它其实是 0.11.0.0 版本引入的新功能

之前可能一条消息发送多次，导致消息重复的情况

在 0.11 之后，指定  props.put(“enable.idempotence”, ture)

然后producer自动升级成幂等性 Producer。其他逻辑代码都不需要改变，kafka自动帮你做消息的重复去重

底层代码逻辑： 经典用空间换时间的优化思路，即在broker端多保存一些字段，档producer发送了相同字段值的消息后，brokder自动知晓消息重复，后台默默把她们丢弃掉。实际原理比较复杂。

#### 幂等性 Producer作用范围

1. 它只能保证单分区上的幂等性，即一个幂等性 Producer 能够保证某个主题的一个分区上不出现重复消息，它无法实现多个分区的幂等性
2. 只能实现单会话的幂等性 ，不能实现多会话幂等性， 理解为党producer一次运行，重启了之后，这种幂等性 就小时了。

如果我想实现**多分区以及多会话上的消息无重复**，？答案就是事务（transaction）或者依赖事务型 Producer。这也是幂等性 Producer 和事务型 Producer 的最大区别！



### 事务

Kafka 的事务概念类似于我们熟知的数据库提供的事务。在数据库领域，事务提供的安全性保障是经典的 ACID，即原子性（Atomicity）、一致性 (Consistency)、隔离性 (Isolation) 和持久性 (Durability)。

Kafka 自 0.11 版本开始也提供了对事务的支持，目前主要是在 read committed 隔离级别上做事情。它能保证多条消息原子性地写入到目标分区，同时也能保证 Consumer 只能看到事务成功提交的消息。下面我们就来看看 Kafka 中的事务型 Producer。



### 事务性Producer

事务型 Producer 能够保证将消息原子性地写入到多个分区中。这批消息要么全部写入成功，要么全部失败。另外，事务型 Producer 也不惧进程的重启。Producer 重启回来后，Kafka 依然保证它们发送消息的精确一次处理。

两个步骤

1. 和幂等性 Producer 一样，开启 enable.idempotence = true。
2. 设置 Producer 端参数 transactional. id。最好为其设置一个有意义的名字。

```java

producer.initTransactions();
try {
            producer.beginTransaction();
            producer.send(record1);
            producer.send(record2);
            producer.commitTransaction();
} catch (KafkaException e) {
            producer.abortTransaction();
}
```



消费端也要修改设置，比如上面 两个记录，即使失败，也会写入底层的日志中， 消费者短需要设置 isolation.level

两个取值 

1. read_uncommitted：默认值，表明 Consumer 能够读取到 Kafka 写入的任何消息，不论事务型 Producer 提交事务还是终止事务，其写入的消息都可以读取。很显然，如果你用了事务型 Producer，那么对应的 Consumer 就不要使用这个值。
2. read_committed：表明 Consumer 只会读取事务型 Producer 成功提交事务写入的消息。当然了，它也能看到非事务型 Producer 写入的所有消息。



### 小结

幂等性 Producer 只能保证单分区、单会话上的消息幂等性；

而事务能够保证跨分区、跨会话间的幂等性。从交付语义上来看，自然是事务型 Producer 能做的更多。

![image](https://static.lovedata.net/21-03-30-12bd866140eec2fa3bddd78870f77efa.png)



### QA

1. 幂等性为什么只保证单分区有效？是因为下一次消息重试指不定发送到哪个分区么。如果这样的话是不是可以采用按消息键保序的方式？这样重试消息还发送到同一个分区。
   1. 重启之后标识producer的PID就变化了，broker就不认识了。要想认识就要让broker和producer做更多的事，也就是事务机制做的那些事。
2. 事务型producer不会重复发送消息吗？如果发送的这一批到broker了，但是broker返回的确认消息producer没有收到，再次尝试，broker会去重吗？或者consumer端会去重啊？
   1. 





## 15 | 消费者组到底是什么？



Consumer Group 是 Kafka 提供的可扩展且具有容错性的消费者机制

Kafka 仅仅使用 Consumer Group 这一种机制，却同时实现了传统消息引擎系统的两大模型：如果所有实例都属于同一个 Group，那么它实现的就是消息队列模型；如果所有实例分别属于不同的 Group，那么它实现的就是发布 / 订阅模型。

老版本的offset 放在zk中，zk不适合频繁读写，所以新版本就没放在zk中了

新版本的会放在 __consumer_offsets  内部主题中



### Rebalance

Rebalance 本质上是一种协议，规定了一个 Consumer Group 下的所有 Consumer 如何达成一致，来分配订阅 Topic 的每个分区

Rebalance 的触发条件有 3 个

1. 组成员数发生变更 有新进，或者有 consumer 崩溃了。
2. 订阅主题数发生变更。比如用正则订阅主题， 有新增的主题了。
3. 订阅主题的分区数发生变更 只允许新增

![image](https://static.lovedata.net/21-04-01-5da52290ed23628603a535eb6a313955.png)

#### Rebalance缺点

万物静止，类似于JVM的STW，在Rebalance过程中，所有consumer都会停止消费，等待rebalcance完成

目前是所有consumer共同参与，但是更新高效的应该是尽量减少变动，比如A消费1，2，3，分配后还是1，2，3，这样这些事分区所在broker的tcp链接就可以继续用，不用重新闯劲

Rebalance比较满。

![image](https://static.lovedata.net/21-04-01-4ac3c58587f49d53cced939b25cd0d31.png)



## 16 | 揭开神秘的“位移主题”面纱

将 Consumer 的位移数据作为一条条普通的 Kafka 消息，提交到 __consumer_offsets 中。可以这么说，__consumer_offsets 的主要作用是保存 Kafka 消费者的位移信息。



### 设计

Key-value 键值对

位移主题的 Key 中应该保存 3 部分内容：。<Group ID，主题名，分区号 >

value就是存的offset信息，可以这么简单理解

### 创建时机

当 Kafka 集群中的第一个 Consumer 程序启动时，Kafka 会自动创建位移主题

Broker 端参数 offsets.topic.num.partitions 的取值了。它的默认值是 50

如果位移主题是 Kafka 自动创建的，那么该主题的分区数是 50，副本数是 3。


### 怎么用
Kafka Consumer 提交位移的方式有两种：自动提交位移和手动提交位移。

consumer端参数 enable.auto.commit，如果是ture，consumer在后台默默提交位移，auto.commit.interval.ms 控制提交间隔

自动提交的优点：
省事，你不用操心位移提交的事情，就能保证消息消费不会丢失。
缺点：
太省事了，丧失灵活度 没法把控 Consumer 端的位移管理。

手动提交位移，即设置 enable.auto.commit = false
consumer.commitSync

### Compact策略
一直发消息，比如 没有消息了，consumer一直发送 位移为100的消息，如果不处理，会撑爆，所以kafka使用 compact策略，删除位移主题的过期消息

> 对于同一个 Key 的两条消息 M1 和 M2，如果 M1 的发送时间早于 M2，那么 M1 就是过期消息

![image](https://static.lovedata.net/21-04-01-9292fa523a38191d7916aaa0fe7aff31.png)

Kafka 提供了专门的后台线程定期地巡检待 Compact 的主题，看看是否存在满足条件的可删除数据。

![image](https://static.lovedata.net/21-04-01-08158ce44581f271972be1df3e0a642f.png)


## 17 | 消费者组重平衡能避免吗？

Rebalance 就是让一个 Consumer Group 下所有的 Consumer 实例就如何消费订阅主题的所有分区达成共识的过程 ,这个过程中，所有实例不能消费任何消息，对consumer的tps影响非常大。


### 协调者

协调者，在 Kafka 中对应的术语是 Coordinator，它专门为 Consumer Group 服务，负责为 Group 执行 Rebalance 以及提供位移管理和组成员管理等。

Consumer 端应用程序在提交位移时，其实是向 Coordinator 所在的 Broker 提交位移。同样地，当 Consumer 应用启动时，也是向 Coordinator 所在的 Broker 发送各种请求，然后由 Coordinator 负责执行消费者组的注册、成员管理记录等元数据管理操作。


broker 启动的时候，开启相应 coordinate组件 所有 Broker 都有各自的 Coordinator 组件

### 如何确定 consumer group 为他服务的 协调者在哪个broker上呢？ 

答案就在 __consumer_offsets 两个步骤

1. 确定由位移主题的哪个分区来保存该 Group 数据：partitionId=Math.abs(groupId.hashCode() % offsetsTopicPartitionCount)
2. 找出该分区 Leader 副本所在的 Broker，该 Broker 即为对应的 Coordinator。


Consumer 应用程序，特别是 Java Consumer API，能够自动发现并连接正确的 Coordinator
这个算法能够帮助我们定位问题，快速找到对应的broker


### Rebalance 弊端

1. Rebalance 影响 Consumer 端 TPS
2. Rebalance 很慢。group 下成员很多的时候。
3. Rebalance 效率不高。 每次 Rebalance 时，Group 下的所有成员都要参与进来，而且通常不会考虑局部性原理，但局部性原理对提升系统性能是特别重要的。
	1. 就是有一个消费者退出，他消费的分区不能均匀分配给其他分区，而是必须重新分配，到之后 tcp链接的浪费。0.11.0.0 有一个 StickyAssigneor 粘性 分配，有一些bug


### 如何避免

#### 发生的时机

1. 组成员变化
2. 订阅主题数量发生变化
3. 订阅主题分区数发生了变化


后面两个无法避免

### 组成员数量变化而引发的 Rebalance 该如何避免。

新增消费者无可厚非，计划内的。  更在意的是 Group 下实例数减少这件事。
如果你就是要停掉某些 Consumer 实例，那自不必说，
关键是在某些情况下，Consumer 实例会被 Coordinator 错误地认为“已停止”从而被“踢出”Group。


Coordinator 会在什么情况下认为某个 Consumer 实例已挂从而要退组呢？

session.timeout.ms ，完成 rebalance后，consumer会定期向协调者发送 心跳，表明存活。 session.timeout.ms 超时时间，默认10s，如果10s内没有收到心跳，就会认为已经挂了。 

heartbeat.interval.ms 控制发送频率。每隔多少ms发送一次。

max.poll.interval.ms 限定了 Consumer 端应用程序两次调用 poll 方法的最大时间间隔，默认5分钟，如果在5分钟内，无法消费完poll的消息，那么consumer会主动发起离开组的请求。会开启新一轮的rebalance


第一类非必要 Rebalance 是因为未能及时发送心跳，导致 Consumer 被“踢出”Group 而引发的  仔细设置  session.timeout.ms 和 heartbeat.interval.ms 的值

- 设置 session.timeout.ms = 6s。
- 设置 heartbeat.interval.ms = 2s。

第二类非必要 Rebalance 是 Consumer 消费时间过长导致的  max.poll.interval.ms ，比如写mongo这种比较重的操作，设置大一些，比最长的消费时间要大一些


![image](https://static.lovedata.net/21-04-06-03f8dd9da1b6e1df327528f25bf9806c.png)



## 18 | Kafka中位移提交那些事儿

Consumer Offset  它记录了 Consumer 要消费的**下一条**消息的位移

Consumer 需要向 Kafka 汇报自己的位移数据，这个汇报过程被称为提交位移（Committing Offsets）Consumer 需要为分配给它的每个分区提交各自的位移数据。
位移提交的语义保障是由你来负责的，Kafka 只会“无脑”地接受你提交的位移。

从用户的角度来说，位移提交分为自动提交和手动提交；从 Consumer 端的角度来说，位移提交分为同步提交和异步提交。

enable.auto.commit  默认值是true，
auto.commit.interval.ms 默认值是5s，自动模式下生效

手动提交 KafkaConsumer#commitSync()，会提交poll返回回来的最新的位移，是一个 **同步操作**


### 自动提交的问题

设置自动提交，kafka会保证在开始调用poll方法的时候，提交上次poll返回的消息
顺序是 ，poll 方法的逻辑是先提交上一批消息的位移，再处理下一批消息。
因此保证不出现消息丢失的情况 

问题是。他可能会出现 **重复消费**

比如提交offset 3 秒之后，


### 手动提交
如果过早提交了offset，消息还没处理完成，则有可能丢失数据。
好处是 **更加灵活，自己控制offset的提交时机和频率**
缺陷是 调用 commitSync的时候，consumer会阻塞状态，知道broker返回结果。会影响应用的tps。
如果降低提交频率，一旦consumer重启的时候，就有更多的消息被重新消费。

有另外一个 commitAsync，异步提交，提供 callback回调，不能替代 commitSync ，因为出现问题不会自动充实， 因为如果重试，提交的offset可能是过期的或者不是最新的值了。


需要将两者结合,在consumer退出的时候，执行 手动提交。

```java

   try {
           while(true) {
                        ConsumerRecords<String, String> records = 
                                    consumer.poll(Duration.ofSeconds(1));
                        process(records); // 处理消息
                        commitAysnc(); // 使用异步提交规避阻塞
            }
} catch(Exception e) {
            handle(e); // 处理异常
} finally {
            try {
                        consumer.commitSync(); // 最后一次提交使用同步阻塞式提交
  } finally {
       consumer.close();
}
}
```


![image](https://static.lovedata.net/21-04-06-cd8052898b153d1349d0a6e3bd45fee7.png)


### QA

1. auto.commit.interval.ms设置为5s，也就是说consumer每5秒才提交一次位移信息，那consumer如果每消费一条数据，但是没有达到自动提交的时间，这个位移信息该如何管理？consumer自己做维护吗？但是也需要跟broker端进行位移信息同步的吧？ 不然可能会造成数据的重复消费？还是每5s的提交和consumer自动提交的时候都会伴随位移信息的同步？是我的理解有问题吗？
	>  如果没有达到提交时间就不会提交，自动提交完全由consumer自行维护，确实可能造成数据的重复消费。你的理解完全没有问题：）
目前单纯依赖consumer是无法避免消息的重复消费的，Kafka默认提供的消息处理语义就是至少一次处理。


## 20 | 多线程开发消费者实例


### 多线程方案

，KafkaConsumer 类不是线程安全的 (thread-safe) ，不能多个线程共享 ，否则ConcurrentModificationException

#### 方案一

.消费者程序启动多个线程，每个线程维护专属的 KafkaConsumer 实例，负责完整的消息获取、消息处理流程

![image](https://static.lovedata.net/21-04-06-28059ce9dca34add4e7f380815337182.png)

优势：
1. 实现简单。

#### 方案二

消费者程序使用单或多线程获取消息，同时创建多个消费线程执行消息处理逻辑。获取消息的线程可以是一个，也可以是多个，每个线程维护专属的 KafkaConsumer 实例，处理消息则交由特定的线程池来做，

![image](https://static.lovedata.net/21-04-06-a13b724a6f4c9cf01a776fe17f48763d.png)


#### 对比 

![image](https://static.lovedata.net/21-04-06-12a2adb25c1d7422659929663b6a3792.png)



![image](https://static.lovedata.net/21-04-06-ca450ccc72d7294cb4212339f9eb3794.png)


## 21 | Java 消费者是如何管理TCP连接的?


### 何时创建 TCP 连接？

。和生产者不同的是，构建 KafkaConsumer 实例时是不会创建任何 TCP 连接的，
TCP 连接是在调用 KafkaConsumer.poll 方法时被创建的

三个时机创建

1. 发起 FindCoordinator 请求时。
	 poll的时候，需要发起一个 FindCoordinator 告诉它哪个broker管理它的链接
	 向负载最小的broker发送这个请求（这个是从待发送的请求的数量角度，单向的）
	
2. 连接协调者时。

	 知道后，创建连向该 Broker 的 Socket 连接。只有成功连入协调者，协调者才能开启正常的组协调操作，比如加入组、等待组分配方案 心跳请求处理、位移获取、位移提交等。


3. 消息消费的时候 
	 与该分区的领导者副本所在broker创建tcp链接


### 何时关闭 TCP 连接？

主动关闭
手动调用 KafkaConsumer.close() 方法，或者是执行 Kill 命令，不论是 Kill -2 还是 Kill -9

Kafka 自动关闭

消费者端参数 connection.max.idle.ms 控制的，默认九分钟，如果九分钟没有任何请求过境，消费者会强行杀掉 socket链接

如果是循环调用poll方法消费，那么 会定期有请求， 因此这些socket 链接有请求，实现了场链接 

![image](https://static.lovedata.net/21-04-06-83de5a56574a519deaab3b8cb6571827.png)


## 22 | 消费者组消费进度监控都怎么实现？

### Kafka JMX 监控指标

afka 消费者提供了一个名为 kafka.consumer:type=consumer-fetch-manager-metrics,client-id=“{client-id}”的 JMX 指标 ：records-lag-max 和 records-lead-min，它们分别表示此消费者在测试窗口时间内曾经达到的最大的 Lag 值和最小的 Lead 值。

这里的 Lead 值是指消费者最新消费消息的位移与分区当前第一条消息位移的差值。很显然，Lag 和 Lead 是一体的两个方面：Lag 越大的话，Lead 就越小，反之也是同理。

在实际生产环境中，请你一定要同时监控 Lag 值和 Lead 值

![image](https://static.lovedata.net/21-04-07-e151de59807402774611888a0edb01da.png)



## 23 | Kafka副本机制详解
### 副本机制的优点

1. 提高数据冗余
2. 提供高伸缩性
3. 改善数据局部性

kafka 只能提供第一种 




### 副本定义

所谓副本（Replica），本质就是一个只能追加写消息的提交日志，同分区所有副本保存相同的消息序列。
![image](https://static.lovedata.net/21-04-07-6be2d81d14bf20346e95a6d321554904.png)

### 副本角色

如何保证副本的所有数据是一致的呢？ 
基于领导者的（leader-based）的副本机制

![image](https://static.lovedata.net/21-04-07-197607c6f0ac280b4ac958d0695cfb5a.png)

1. 副本两类： 领导者和追随者副本(leader. follower)，每个分区一个领导者副本，其余自动是追随者副本
2. 追随者副本不提供任何读写服务。追随者唯一任务就是从领导者副本 **异步拉取**消息，并存入到自己的提交日志中，从而实现同步
	 这就是kafka不能提供读操作的横向扩展以及改善局部性，和mysql不同，有两个好处
	 1. 方便实现 read-your-writers  写了就可以见到，如果副本堵，可能就看不到
	 2. 方便实现单调读（Monotonic reads）对某一个消费着而言，在多次消费消息的时候，不会存在消息一会看得到，一会看不到。
3. 当leader挂了，或者leader所在broker挂掉了， kafka依托于zk的监控功能能够实时感知，并开启新一轮领导者选举，从副本中选取一个新的领导者，老得leader回来后，只能作为追随者加入



### In-sync replicas(ISR)

追随者副本 拉取数据是 异步的，就存在着可能不与 Leader 实时同步的风险

需要理解什么是同步，怎么才算于leader同步

基于这个 kafka引入了 ISR, isr中的副本都是与leader同步的，反之亦然

ISR 不只是追随者副本集合，它必然包括 Leader 副本。甚至在某些情况下，ISR 只有 Leader 这一个副本。

![image](https://static.lovedata.net/21-04-07-feb3b44bffb825b33ce034295c31b6f6.png)

kafka判定follower 是否与leader同步的标准，不是看相差的条数

这个标准就是 Broker 端参数 replica.lag.time.max.ms 参数值 含义是 Follower 副本能够落后 Leader 副本的最长时间间隔，当前默认值是 10 秒。 只要一个 Follower 副本落后 Leader 副本的时间不连续超过 10 秒，那么 Kafka 就认为该 Follower 副本与 Leader 是同步的，即使此时 Follower 副本中保存的消息明显少于 Leader 副本中的消息。

**replica.lag.time.max.ms**
这个配置项的意思是follower要同时满足以下两个条件才不会被踢出Isr，默认10000ms（10s）

1. 距离上次发送fetch请求不超过这个时间
2. 在这个时间follower要赶上主的LEO(log end offset )



### Unclean 领导者选举（Unclean Leader Election）

出现 ISR 为空，说明leader也挂掉了。需要重新选leader

都为空了，怎么选 Kafka 把所有不在 ISR 中的存活副本都称为非同步副本

选举这种副本的过程称为 Unclean 领导者选举。Broker 端参数 unclean.leader.election.enable 控制是否允许 Unclean 领导者选举。

开启后 可能会数据丢失。 好处是： 使得leader副本一致存在，不至于停止对外提供服务 ，提升了高可用行，反之禁用 维护了数据一致性，避免消息丢失，但牺牲了高可用行

墙裂建议不要开启它。 

![image](https://static.lovedata.net/21-04-07-c16302146c37e45b16dc18c01f8f8ecc.png



## 24 | 请求是怎么被处理的？


### Reactor模式

http://gee.cs.oswego.edu/dl/cpjslides/nio.pdf



Reactor 模式是事件驱动架构的一种实现方式，特别适合应用于处理多个客户端并发向服务器端发送请求的场景

![image](https://static.lovedata.net/21-04-12-42ba38619079d69e2ffc9c0cd209833f.png)

![image](https://static.lovedata.net/21-04-12-0d7b5be09bf06e8c001387a42f9b2c61.png)


> Kafka 的 Broker 端有个 SocketServer 组件，类似于 Reactor 模式中的 Dispatcher，它也有对应的 Acceptor 线程和一个工作线程池，只不过在 Kafka 中，这个工作线程池有个专属的名字，叫网络线程池。Kafka 提供了 Broker 端参数 num.network.threads，用于调整该网络线程池的线程数。其默认值是 3，表示每台 Broker 启动时会创建 3 个网络线程，专门处理客户端发送的请求。


![image](https://static.lovedata.net/21-04-12-387ff47380e1d3bb548916dccc16a436.png)


### Purgatory

著名的“炼狱”组件。它是用来缓存延时请求（Delayed Request）的。所谓延时请求，就是那些一时未满足条件不能立刻处理的请求。

比如 acks=all, 该请求必须等待ISR中所有副本都接受消息才能返回。此时请求的io线程必须等待其他broker写入结果。 当不能立即处理， 会暂存在Purgatory中，满足条件后，io线程会继续处理该请求，并将response放入到对应的网络线程响应队列中。


## 25 | 消费者组重平衡全流程解析

### 触发与通知

1. 数量发生变化。
2. 订阅主题数量发生变化。
3. 订阅主题的分区数发生变化。




### 如何通知

重平衡过程是如何通知到其他消费者实例的？答案就是，靠消费者端的心跳线程（Heartbeat Thread）。

重平衡的通知机制正是通过心跳线程来完成的

当协调者决定开启新一轮重平衡后，它会将“REBALANCE_IN_PROGRESS”封装进心跳请求的响应中，发还给消费者实例  然后消费者就知道了。

heartbeat.interval.ms 心跳时间。 但这个参数的真正作用是控制重平衡通知的频率


### 消费者组状态机

Kafka 设计了一套消费者组状态机（State Machine），来帮助协调者完成整个重平衡流程。

它能够帮助你搞懂消费者组的设计原理，比如消费者组的过期位移（Expired Offsets）删除等。

![image](https://static.lovedata.net/21-04-12-8702e6a755e7b1a20e76af3a044ecd28.png)

![image](https://static.lovedata.net/21-04-12-68522f708e72b42d00cf0619671c3171.png)


一个消费者组最开始是 Empty 状态，当重平衡过程开启后，它会被置于 PreparingRebalance 状态等待成员加入，之后变更到 CompletingRebalance 状态等待分配方案，最后流转到 Stable 状态完成重平衡。当有新成员加入或已有成员退出时，消费者组的状态从 Stable 直接跳到 PreparingRebalance 状态，此时，所有现存成员就必须重新申请加入组。当所有成员都退出组后，消费者组状态变更为 Empty。Kafka 定期自动删除过期位移的条件就是，组要处于 Empty 状态。因此，如果你的消费者组停掉了很长时间（超过 7 天），那么 Kafka 很可能就把该组的位移数据删除了。



### 消费者端重平衡流程

#### 消费者端

分别是加入组和等待领导者消费者（Leader Consumer）分配方案。这两个步骤分别对应两类特定的请求：JoinGroup 请求和 SyncGroup 请求。

组内成员加入组时，它会向协调者发送 JoinGroup 请求
一旦收集了全部成员的 JoinGroup 请求后，协调者会从这些成员中选择一个担任这个消费者组的领导者。
通常 第一个发送 JoinGroup 请求的成员自动成为领导者。
领导者消费者的任务是收集所有成员的订阅信息，然后根据这些信息，制定具体的分区消费分配方案。

选出领导者之后，协调者会把消费者组订阅信息封装进 JoinGroup 请求的响应体中，然后发给领导者，由领导者统一做出分配方案后，进入到下一步：发送 SyncGroup 请求


领导者向协调者发送 SyncGroup 请求，将刚刚做出的分配方案发给协调者，其他组成员也会发送，只不过请求题是空的， 这一步是让协调者接受分配方案，然后以SyncGroup响应体的方式返回给所有成员

![image](https://static.lovedata.net/21-04-12-5420970d7b970c89fe6c6c4b6d0cbce8.png)

![image](https://static.lovedata.net/21-04-12-9dd67f2e7b0d3aa8a3eae74f2cadfdee.png)

### Broker 端重平衡场景剖析

#### 场景一：新成员入组。

讨论的是，组稳定了之后有新成员加入的情形。

协调者收到新的 JoinGroup 请求后，它会通过心跳请求响应的方式通知组内现有的所有成员，强制它们开启新一轮的重平衡

![image](https://static.lovedata.net/21-04-12-9692516a34a97ef0ff6fbbc8e4002637.png)



#### 场景二：组成员主动离组。

就是指消费者实例所在线程或进程调用 close() 方法主动通知协调者它要退出

发送 LeaveGroup
![image](https://static.lovedata.net/21-04-12-2f961cba0436a3b304dba41f0d0f4059.png)


#### 场景三：组成员崩溃离组。

崩溃离组是指消费者实例出现严重故障，突然宕机导致的离组

崩溃离组是被动的，协调者通常需要等待一段时间才能感知到，这段时间一般是由消费者端参数 session.timeout.ms 控制的

![image](https://static.lovedata.net/21-04-12-4784b44fd6a1ab737194943a6159abd6.png)


#### 场景四：重平衡时协调者对组内成员提交位移的处理。

每个组内成员都会定期汇报位移给协调者。当重平衡开启时，协调者会给予成员一段缓冲时间，要求每个成员必须在这段时间内快速地上报自己的位移信息，然后再开启正常的 JoinGroup/SyncGroup 请求发送

![image](https://static.lovedata.net/21-04-12-3ea6e6300d56d0867ca1ee77eb9d1e20.png)




![image](https://static.lovedata.net/21-04-12-1ba0ab2ca7620c4481a5ef42dcfc8635.png)


## 27 | 关于高水位和Leader Epoch的讨论


Leader Epoch 是社区在 0.11 版本中新推出的，主要是为了弥补高水位机制的一些缺陷。


### 什么是高水位？

“Streaming System”一书则是这样表述水位的：水位是一个单调增加且表征最早未完成工作（oldest work not yet completed）的时间戳。


![image](https://static.lovedata.net/21-04-13-19f6a3e58986f6d703893b2dffe4b46a.png)


### 高水位作用

1. 定义消息可见性，即用来标识分区下的哪些消息是可以被消费者消费的。
2. 帮助 Kafka 完成副本同步。

![image](https://static.lovedata.net/21-04-13-8582fdaaa3eb10d0d3dd78876598de60.png)

在分区高水位以下的消息被认为是已提交消息，反之就是未提交消息。消费者只能消费已提交消息，即图中位移小于 8 的所有消息。注意 （没涉及到kafka实物，实物影响消费者看到消息的范围，不仅仅简单以来高水位来判断，以来一个LSO(log stable offset) 来判断事物的可见性）

位移值等于高水位的消息也属于未提交消息。也就是说，高水位上的消息是不能被消费者消费的。


 Log End Offset，简写是 LEO。它表示副本写入下一条消息的位移值
 
 同一个副本对象，其高水位值不会大于 LEO 值。
 
 kafka 所有副本都有对应的高水位和 LEO 值，而不仅仅是 Leader 副本。 kafka使用leader副本的高水位来定义所在分区的 **高水位**   分区的高水位就是其 Leader 副本的高水位。

### 高水位的更新机制

在 Leader 副本所在的 Broker 上，还保存了其他 Follower 副本的 LEO 值。

![image](https://static.lovedata.net/21-04-13-c7dad78669048359df370a75f36a5e2c.png)

Kafka 把 Broker 0 上保存的这些 Follower 副本又称为远程副本（Remote Replica）

kafka 副本机制在运行过程中，会更新 Broker 1 上 Follower 副本的高水位和 LEO 值，同时也会更新 Broker 0 上 Leader 副本的高水位和 LEO 以及所有远程副本的 LEO，但它不会更新远程副本的高水位值（灰色部分）

作用： 帮助 Leader 副本确定其高水位，也就是分区高水位。

![image](https://static.lovedata.net/21-04-13-72e1fdf726c0c18dfce616163177c711.png)

Broker 0.上远程副本L EO Follower副本从eader副本拉取消息时，会告诉L eader副本从哪个位
移处开始拉取。L eader副本会使用这个位移值来更新远程副本的LEO。因为follower副本已经明确从这里拉取了，肯定副本的LEO是确定是这个值了。

什么叫与 Leader 副本保持同步，有两个条件
1. 该远程 Follower 副本在 ISR 中。
2. 该远程 Follower 副本 LEO 值落后于 Leader 副本 LEO 值的时间，不超过 Broker 端参数 replica.lag.time.max.ms 的值。如果使用默认值的话，就是不超过 10 秒。


### HW和LEO的更新机制

#### Leader副本

1. 写入消息到本地磁盘。
2. 更新分区高水位值。
 1. i. 获取 Leader 副本所在 Broker 端保存的所有远程副本 LEO 值（LEO-1，LEO-2，……，LEO-n）。
 2.ii. 获取 Leader 副本高水位值：currentHW。
 3.iii. 更新 currentHW = max{currentHW, min（LEO-1, LEO-2, ……，LEO-n）}。

处理 Follower 副本拉取消息的逻辑如下：
1. 读取磁盘（或页缓存）中的消息数据。
2. 使用 Follower 副本发送请求中的位移值更新远程副本 LEO 值。
3. 更新分区高水位值（具体步骤与处理生产者请求的步骤相同）。


#### Follower 副本

1. 从 Leader 拉取消息的处理逻辑如下：写入消息到本地磁盘。
2. 更新 LEO 值。
3. 更新高水位值。
	1. i. 获取 Leader 发送的高水位值：currentHW。
	2. ii. 获取步骤 2 中更新过的 LEO 值：currentLEO。
	3. iii. 更新高水位为 min(currentHW, currentLEO)。

### 副本同步机制解析

![image](https://static.lovedata.net/21-04-13-c4cf04bedcee0a9ffe7dac2bd8130847.png)

![image](https://static.lovedata.net/21-04-13-de8fd48948f480d00ce1f0d9788c8cda.png)

![image](https://static.lovedata.net/21-04-13-befea41afa06d46f9cf6d15970eeb10a.png)

> Follower 副本也成功地更新 LEO 为 1。此时，Leader 和 Follower 副本的 LEO 都是 1，但各自的高水位依然是 0，还没有被更新。它们需要在下一轮的拉取中被更新，如下图所示：

![image](https://static.lovedata.net/21-04-13-080cbeee61019b3c1123bb3eeca6ff26.png)

> 在新一轮的拉取请求中，由于位移值是 0 的消息已经拉取成功，因此 Follower 副本这次请求拉取的是位移值 =1 的消息。Leader 副本接收到此请求后，更新远程副本 LEO 为 1，然后更新 Leader 高水位为 1。做完这些之后，它会将当前已更新过的高水位值 1 发送给 Follower 副本。Follower 副本接收到以后，也将自己的高水位值更新成 1



### Leader Epoch

Leader Epoch，我们大致可以认为是 Leader 版本。它由两部分数据组成。
1. Epoch。一个单调增加的版本号。每当副本领导权发生变更时，都会增加该版本号。小版本号的 Leader 被认为是过期 Leader，不能再行使 Leader 权力。
2. 起始位移（Start Offset）。Leader 副本在该 Epoch 值上写入的首条消息的位移。



#### 单纯依赖HW 数据丢失场景

![image](https://static.lovedata.net/21-04-13-785ea11a7d69f63825870d73697253be.png)


倘若此时副本 B 所在的 Broker 宕机，当它重启回来后，副本 B 会执行日志截断操作，将 LEO 值调整为之前的高水位值，也就是 1。这就是说，位移值为 1 的那条消息被副本 B 从磁盘中删除，此时副本 B 的底层磁盘文件中只保存有 1 条消息，即位移值为 0 的那条消息。

执行完截断操作后，副本 B 开始从 A 拉取消息，执行正常的消息同步。如果就在这个节骨眼上，副本 A 所在的 Broker 宕机了，那么 Kafka 就别无选择，只能让副本 B 成为新的 Leader，此时，当 A 回来后，需要执行相同的日志截断操作，即将高水位调整为与 B 相同的值，也就是 1。这样操作之后，位移值为 1 的那条消息就从这两个副本中被永远地抹掉了



#### Leader Epoch 规避

![image](https://static.lovedata.net/21-04-13-4983d7f651b643af2cdc21c5de5870e2.png)

只不过引用 Leader Epoch 机制后，Follower 副本 B 重启回来后，需要向 A 发送一个特殊的请求去获取 Leader 的 LEO 值  B 发现该 LEO 值不比它自己的 LEO 值小，而且缓存中也没有保存任何起始位移值 > 2 的 Epoch 条目，因此 B 无需执行任何日志截断操作   


A宕机后，B成为leader 当 A 重启回来后，执行与 B 相同的逻辑判断，发现也不用执行日志截断
后面当生产者程序向 B 写入新消息时，副本 B 所在的 Broker 缓存中，会生成新的 Leader Epoch 条目：[Epoch=1, Offset=2]。


![image](https://static.lovedata.net/21-04-13-d62c6c5073960a4cc21b1e07f9df994c.png)

[Kafka水位(high watermark)与leader epoch的讨论 - huxihx - 博客园](https://www.cnblogs.com/huxi2b/p/7453543.html)

[深入分析Kafka高可用性 - 知乎](https://zhuanlan.zhihu.com/p/46658003)



![image](https://static.lovedata.net/21-04-13-c71d499b8919e692df97f137b96dc576.png)






































































