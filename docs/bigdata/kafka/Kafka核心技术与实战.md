# Kafka核心技术与实战



## 开篇词 | 为什么要学习Kafka？

截止到 2019 年，当下互联网行业最火的技术当属 ABC 了，即所谓的 AI 人工智能、BigData 大数据和 Cloud 云计算云平台

大数据业务系统为公司业务服务的，所以通常来说它们仅仅是执行一些常规的业务逻辑，因此它们不能算是**计算密集型应用，相反更应该是数据密集型**的。

如何应对**数据量激增、数据复杂度增加以及数据变化速率变快** 是个彰显能力的地方

kafka 起到了很好的效果。数据量激增来说，**Kafka 能够有效隔离上下游业务，将上游突增的流量缓存起来，以平滑的方式传导到下游子系统中**，避免了流量的不规则冲击

一套框架就能在实际业务系统中实现**消息引擎应用、应用程序集成、分布式存储构建，甚至是流处理应用的开发与部署**

![image](https://static.lovedata.net/21-03-11-960bdb8bb7dcc17cf190b8806cd889a9.png-wm)



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

![image](https://static.lovedata.net/21-03-11-589a40b82b97c0d5a381db319f8aeb13.png-wm)



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



![image](https://static.lovedata.net/21-03-11-8e912cf7fb738682b0f4a1712fabd25a.png-wm)





## 04 | 我应该选择哪种Kafka？



Kafka Connect 通过一个个具体的连接器（Connector），串联起上下游的外部系统。

![image](https://static.lovedata.net/21-03-12-543af39100f6188f62b0bf9a68050366.png-wm)





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

![image](https://static.lovedata.net/21-03-12-b568e63fd10887ef2289a0451b017294.png-wm)



### QA

1. kafka-manager 替代品

   试JMXTrans + InfluxDB + Grafana

2. 场景 confluent套件，线上用到了kafka, schema registry和ksql，其中ksql用于实时指标计算



## 05 | 聊聊Kafka的版本号

![image](https://static.lovedata.net/21-03-12-1b0cc8fb6f7fb76fffcfc182d7a63eb8.png-wm)

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



![image](https://static.lovedata.net/21-03-12-44970d6accf002f0b7a2aa3093c052df.png-wm)



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



![image](https://static.lovedata.net/21-03-12-99a5253aef92b25771cbcc559ad692a1.png-wm)



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



![image](https://static.lovedata.net/21-03-16-1667fab587c23c20082542a6019b2b52.png-wm)



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



![image](https://static.lovedata.net/21-03-16-fa590b7dd72bf963d2162c63caf07eb0.png-wm)



## 09 | 生产者消息分区机制原理剖析



### 为什么分区

![image](https://static.lovedata.net/21-03-22-9c66506d6f93b46816fb2675d046046c.png-wm)



分区的作用就是提供**负载均衡**的能力，或者说对数据进行分区的主要原因，就是为了实现系统的**高伸缩性（Scalability）**

**Kafka** 中叫分区，在 MongoDB 和 Elasticsearch 中就叫分片 Shard，而在 HBase 中则叫 Region，在 Cassandra 中又被称作 vnode

还可以实现业务界别的消息顺序的问题。

### 分区策略

所谓分区策略是决定生产者将消息发送到哪个分区的算法。

partitioner.class   org.apache.kafka.clients.producer.Partitioner



#### 轮询策略 Round-robin 顺序分配，默认的分区策略

![image](https://static.lovedata.net/21-03-22-6511323409ecbcaf8a07615199530ffe.png-wm)



**轮询策略有非常优秀的负载均衡表现，它总是能保证消息最大限度地被平均分配到所有分区上，故默认情况下它是最合理的分区策略，也是我们最常用的分区策略之一。**

#### 随机策略 Randomness，

![image](https://static.lovedata.net/21-03-22-93f48d1d0144070d3cc2b33a33dbafcd.png-wm)



也是力求均匀，但是表现没有轮询策略好， **如果追求数据的均匀分布，还是使用轮询策略比较好**



#### 按消息键保序策略  Key-ordering 策略

消息都有key，有明确业务含义的字符串，客户代码、部门编号、业务ID等。 特别 kafka不支持时间戳的肩带，我经常将创建时间封装在key里面。 

同一个key的消息都进入到相同的分区  **每个分区的消息处理都是有顺序的**，所以 被称为 **按照消息键保序策略**

![image](https://static.lovedata.net/21-03-22-1ab0f3026b8c630a52619c24e8c8cb5e.png-wm)



> Kafka 默认分区策略实际上同时实现了两种策略：如果指定了 Key，那么默认实现按消息键保序策略；如果没有指定 Key，则使用轮询策略。



![image](https://static.lovedata.net/21-03-22-d186abb4f1a54f6120aecbbc72b6c200.png-wm)



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

![image](https://static.lovedata.net/21-03-22-bd39fa706998854efece4c9162418199.png-wm)



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

![image](https://static.lovedata.net/21-03-22-906bbfef5fabe89f6d5005ef3d200b44.png-wm)



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

![image](https://static.lovedata.net/21-03-23-701edb755ce247f6482f1e857b8d3421.png-wm)

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

![image](https://static.lovedata.net/21-03-23-a3d09751b3d4bd16c07b70b5042ea27e.png-wm)



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









































