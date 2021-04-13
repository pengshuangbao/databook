# Kafka

[toc]

## kafka的概念相关的问题?

1. kafka是一个分布式的、可分区的、可复制的提交日志服务，复制是核心，保证了了可用性和持久性

2. Kafka 都有哪些特点？

- 高吞吐量、低延迟：kafka每秒可以处理几十万条消息，它的延迟最低只有几毫秒，每个topic可以分多个partition, consumer group 对partition进行consume操作。
- 可扩展性：kafka集群支持热扩展
- 持久性、可靠性：消息被持久化到本地磁盘，并且支持数据备份防止数据丢失
- 容错性：允许集群中节点失败（若副本数量为n,则允许n-1个节点失败）
- 高并发：支持数千个客户端同时读写



## kafka 新版API auto.offset.reset 的含义

###  earliest

当各分区下有已提交的offset时，从提交的offset开始消费；无提交的offset时，从头开始消费

###  latest

当各分区下有已提交的offset时，从提交的offset开始消费；无提交的offset时，消费新产生的该分区下的数据

###  none

topic各分区都存在已提交的offset时，从offset后开始消费；只要有一个分区不存在已提交的offset，则抛出异常

[Kafka auto.offset.reset值详解](https://blog.csdn.net/lishuangzhe7047/article/details/74530417)



## kafka 版本的演进?

[kafka各个版本特性预览介绍](https://app.yinxiang.com/shard/s24/nl/6616351/d8379b85-e64e-437f-9b18-325066195350/)

## kafka 的leader 选举机制是怎样实现的以及各个版本的实现?

1. leader是对应partition的概念，每个partition都有一个leader。
2. 客户端生产消费消息都是只跟leader交互 (实现上简单。)
3. ISR（In-Sync Replicas）直译就是跟上leader的副本
4. ![image](https://static.lovedata.net/jpg/2018/5/29/8e14780235f97056c60785dce43f18e7.jpg-wm)
    1. High watermark（高水位线）以下简称HW，表示消息被leader和ISR内的follow都确认commit写入本地log，所以在HW位置以下的消息都可以被消费（不会丢失）
    2. Log end offset（日志结束位置）以下简称LEO，表示消息的最后位置。LEO>=HW，一般会有没提交的部分。
5. 副本会有单独的线程（ReplicaFetcherThread），去从leader上去拉去消息同步。当follower的HW赶上leader的，就会保持或加入到 **ISR** 列表里，就说明此follower满足上述最基本的原则（跟上leader进度）。ISR列表存在zookeeper上。
    1. replica.lag.max.messages 落后的消息个数 （**Kafka 0.10.0 移除了落后消息个数参数**（replica.lag.max.messages），原因是这个值不好把控，需要经验值，不用的业务服务器环境，这个值可能不同，不然会频繁的移除加入ISR列表） [Kafka副本管理—— 为何去掉replica.lag.max.messages参数 - huxihx - 博客园](http://www.cnblogs.com/huxi2b/p/5903354.html)
    2. replica.lag.time.max.ms 多长时间没有发送FetchQuest请求拉去leader数据
6. producer的ack参数选择，取优先考虑可靠性，还是优先考虑高并发。以下不用的参数，会导致有可能丢消息。
    - 0表示纯异步，不等待，写进socket buffer就继续。
    - 1表示leader写进server的本地log，就返回，不等待follower的回应。
    - -1相当于all，表示等待follower回应再继续发消息。保证了ISR列表里至少有一个replica，数据就不会丢失，最高的保证级别。
7. 参考
    1. [kafka的HA设计 - 简书](https://www.jianshu.com/p/83066b4df739)
    2. [kafka的leader选举过程 - 简书](https://www.jianshu.com/p/c987b5e055b0)
8. unclean.leader.election.enable 默认是true，表示允许不在ISR列表的follower，选举为leader（最坏的打算，可能丢消息）

## kafka 的 rebalance 是怎样的?

![image](https://static.lovedata.net/jpg/2018/6/29/9e105be3ad21eeabe8bab88988b09e87.jpg-wm)

**__consumer_offsets**

`__consumer_offsets` 是 Kafka 内部使用的一个 topic，专门用来存储 group 消费的情况，默认情况下有50个 partition，每个 partition 三副本，而具体 group 的消费情况要存储到哪一个 partition 上，是根据 `abs(GroupId.hashCode()) % NumPartitions` 来计算（其中，`NumPartitions` 是`__consumer_offsets` 的 partition 数，默认是50个）的

**GroupCoordinator**

根据上面所述，一个具体的 group，是根据其 group 名进行 hash 并计算得到其具对应的 partition 值，该 partition leader 所在 Broker 即为该 Group 所对应的 GroupCoordinator，GroupCoordinator 会存储与该 group 相关的所有的 Meta 信息。

在 Broker 启动时，每个 Broker 都会启动一个 GroupCoordinator 服务，但只有 __consumer_offsets 的 partition 的 leader 才会直接与 Consumer Client 进行交互，也就是其 group 的 GroupCoordinator，其他的 GroupCoordinator 只是作为备份，一旦作为 leader 的 Broker 挂掉之后及时进行替代


Consumer 初始化时 group 状态变化

这里详述一下 Client 进行以上操作时，Server 端 Group 状态的变化情况。当 Consumer Client 首次进行拉取数据，如果该其所属 Group 并不存在时，Group 的状态变化过程如下：

- Consumer Client 发送 join-group 请求，如果 Group 不存在，创建该 Group，Group 的状态为 Empty；
- 由于 Group 的 member 为空，将该 member 加入到 Group 中，并将当前 member （client）设置为 Group 的 leader，进行 rebalance 操作，Group 的状态变为 preparingRebalance，等待 rebalance.timeout.ms 之后（为了等待其他 member 重新发送 join-group，如果 Group 的状态变为 preparingRebalance，Consumer Client 在进行 poll 操作时，needRejoin() 方法结果就会返回 true，也就意味着当前 Consumer Client 需要重新加入 Group），Group 的 member 更新已经完成，此时 Group 的状态变为 AwaitingSync，并向 Group 的所有 member 返回 join-group 响应；
- client 在收到 join-group 结果之后，如果发现自己的角色是 Group 的 leader，就进行 assignment，该 leader 将 assignment 的结果通过 sync-group 请求发送给 GroupCoordinator，而 follower 也会向 GroupCoordinator 发送一个 sync-group 请求（只不过对应的字段为空）；
- 当 GroupCoordinator 收到这个 Group leader 的请求之后，获取 assignment 的结果，将各个 member 对应的 assignment 发送给各个 member，而如果该 Client 是 follower 的话就不做任何处理，此时 group 的状态变为 Stable（也就是说，只有当收到的 Leader 的请求之后，才会向所有 member 返回 sync-group 的结果，这个是只发送一次的，由 leader 请求来触发）。


[kafka | Matt's Blog](http://matt33.com/tags/kafka/)

[Kafka 之 Group 状态变化分析及 Rebalance 过程 | Matt's Blog](http://matt33.com/2017/01/16/kafka-group/)

[Kafka之消息传输 | Matt's Blog](http://matt33.com/2016/03/09/kafka-transmit/)

[Kafka 源码解析之 GroupCoordinator 详解（十） | Matt's Blog](http://matt33.com/2018/01/28/server-group-coordinator/)

[kafka系列之(3)——Coordinator与offset管理和Consumer Reba... - 简书](https://www.jianshu.com/p/5aa8776868bb)

[Kafka源码深度解析－序列7 －Consumer －coordinator协议与heartbeat实现原理 - CSDN博客](https://blog.csdn.net/chunlongyu/article/details/52791874)


## kafka中的offset状态,以及high.watermark是什么意思

![image](https://static.lovedata.net/jpg/2018/5/25/c2fa3b250b6512a80279e8140b1421d7.jpg-wm)

例如，在下图中，消费者的位置在偏移6，其最后的提交的偏移1.
当分区重新分配给组中的另外一个使用者时，初始位置设置为最后一个已提交的偏移量。如果上面例子中的消费者突然崩溃了，那么接管的组成员将从偏移量1开始消费。在这种情况下，它必须重新处理消息直到崩溃消费者的位置6.

该图还显示了日志中的另外两个重要位置。日志结束偏移量是写入日志的最后一条消息的偏移量。高水印是成功复制到所有日志副本的最后一条消息的偏移量。从消费者的角度来看，主要知道的是，你只能读取高水印。这防止消费者读取稍后可能丢失的未复制数据。

## Kafak本身提供的新的组协调协议是怎样的机制?

## kafka 使用场景?

- 日志收集：一个公司可以用Kafka可以收集各种服务的log，通过kafka以统一接口服务的方式开放给各种consumer，例如hadoop、Hbase、Solr等。
- 消息系统：解耦和生产者和消费者、缓存消息等。
- 用户活动跟踪：Kafka经常被用来记录web用户或者app用户的各种活动，如浏览网页、搜索、点击等活动，这些活动信息被各个服务器发布到kafka的topic中，然后订阅者通过订阅这些topic来做实时的监控分析，或者装载到hadoop、数据仓库中做离线分析和挖掘。
- 运营指标：Kafka也经常用来记录运营监控数据。包括收集各种分布式应用的数据，生产各种操作的集中反馈，比如报警和报告。
- 流式处理：比如spark streaming和storm
- 事件源

[Kafka史上最详细原理总结 | 静水流深](http://www.thinkyixia.com/2017/10/25/kafka-2/)

## partition和replica默认分配到哪个broker的策略?

- 将所有N Broker和待分配的i个Partition排序.
- 将第i个Partition分配到第(i mod n)个Broker上.
- 将第i个Partition的第j个副本分配到第((i + j) mod n)个Broker上.

## kafka zookeeper中存储结构

1. ![image](https://static.lovedata.net/jpg/2018/5/29/e579c3897235853981bb911ef3328e4e.jpg-wm)
2. ![image](https://static.lovedata.net/jpg/2018/5/29/58462246b8030bb67d3a633305cfe12b.jpg-wm)
3. ![image](https://static.lovedata.net/jpg/2018/5/29/dc69269178701fdeae11e3388340176e.jpg-wm)

## 如果Zookeeper宕机了,kafka还能用吗?

## kafka 发送消息的三种方式

>调用send()方法发送ProducerRecored对象， send()方法返回一个包含RecordMetadata的Future对象

1. 发送并忘记  直接send消息
2. 同步发送，调用send() 返回一个Futrue对象，调用get()方法进行等待，可能抛出异常，有可重试异常和不可重试异常（如数据太大）
3. 异步发送，调用send()方法，指定一个回调函数，服务器返回相应的时候调用该函数 (实现producer.Callback的onComplete方法)

## kafka生产者有哪些重要的配置?

###  acks

acks 指定了必须要多少个分区副本收到消息，生产者才会认为消息写入是成功的。

1. acks=0 不会等待任何来自服务器的响应，可能会丢消息，但是又更大的吞吐量
2. acks=1 只要首领leader收到消息，就会收到成功响应（如果leader节点异常了，一个没有收到消息的节点成为新leader，还是会丢失）
3. acks=all 只有参与复制的节点全部收到消息，才会收到成功响应  延迟较高

###  buffer.memory

生产者内存缓冲区大小

###   compression.type

压缩方式 snapy gzip lz4

###  retries

重试次数

###  client.id

任意字符串，识别消息来源 用于日志和配额指标

###  max.block.ms

如果缓冲区已满之后send阻塞的时间，如果达到后抛异常

###  max.in.flight.requests.per.connection

指定生产者收到服务响应之前可以发送多少消息，值越大，内存占用越大，吞吐量越高，设置为1保证消息有序发送写入

## kafka消息的顺序性保证是怎样的

>银行存款取款场景下，顺序很重要

1. 可以保证一个分区的消息是有序的
2. 如果retries为非零， max.in.flight.requests.per.connection>1,如果一个消息失败，第二批次成功，第一次重试成功后，那么顺序就乱了
3. 一般设置retries>0,把max.in.flight.requests.per.connection设置为1，保证有序

## kafka主题增加分区后,原来的路由到分区A的数据,还会路由到A吗?

不会，回路由到其他分区，要想不变，就是在创建主题的时候，把分区规划好，而且永远不要增加新分区

## kafka分区的方式

1. 键值为null，并且使用默认分区，分区器使用轮训（Round Robin）均衡分布到各个分区上
2. 兼职不是null，并且使用默认分区，使用kafka对键进行散列（这里散列使用所有分区，包括不可用的，可能会发生错误）
3. 自定义分区

## 什么时候发生重新分配reblance?

在主题发生变化时，比如管理员添加了新的分区，会发生。
分区所有权从一个消费者转移到另一个消费者，这样的行为称为再均衡，给消费者群组带来了高可用性和伸缩性

弊端： 消费者群组一段时间不能读取消息。
消费者向群组协调器broker发送心跳维持所有权关系，在轮询消息和提交偏移量的时候发送心跳。
消费者必须持续的轮询向kafka请求数据，否则会被认为已经死掉，导致重新分配哦。

## KafkaConsumer在订阅数据后退出了不关闭会有什么后果?

如果不关，网络连接和socket也不会关闭，就不能立即出发再均衡，要等待协调器发现心跳没了才确认他死亡了，这样就需要更长的时间，导致群组在一段时间内无法读取消息

## 消费者线程安全问题?

同一个群组，无法让一个线程运行多个消费者，也无法让多个线程安全的共享一个消费者，按照规则，一个消费者使用一个线程。如果要多线程使用ExecutorServcie启动多个线程，让每个线程运行自己的消费者。

## 消费者的重要配置?

1. fetch.min.bytes 从服务器获取的最小字节数，如果数据不够，不会马上返回。针对于数据量不大的情况下，避免频繁的网络连接
2. fetch.max.wait.ms 等待broker数据的超时时间，与上面配置配套。不能老等是吧
3. max.parition.fetch.bytes 服务器从每个分区返回给消费者最大字节数  默认值1MB,要比max.message.size大，否则消费者就无法读取了，如果太大也不行，可能消费者线程一下处理不完，导致以为自己挂掉了，要么就要该打session超时时间了
4. session.timeout.ms 指定消费者被认为死亡之前可以与服务器断开连接的时间，hearbeat.interval.ms指定pool想协调器发送心跳的频率，一般比timeout.ms小，一般为他的三分之一
5. [enableautocommit-的含义](#3-kafka-enableautocommit-的含义)

## 消费者偏移量自动提交的方式?

1. 自动提交 设置 anable.auto.commit=true,每 auto.commit.interval.ms 控制提交偏移量，默认5s，也是轮询里进行，每次轮询判断是否该提交了，无法完全避免消息被重复处理， **因为他并不能知道哪一条消息被处理掉了**
2. 手动提交偏移量  anable.auto.commit=false 使用commitSync()提交（提交poll最新的偏移量） 需要确保处理完成消息后调用该方法
    1. 缺点：阻塞应用程序
3. 异步提交 commitAsync() 失败后不会重试，因为有可能有其他更大的偏移量已经提交了 支持一个回调，记录。
    1. 可以使用一个单调递增序列号维护异步提交的顺序，失败后判断是否相等， 相等则可以重试
4. 同步和异步组合提交 在正常的时候使用异步提交，在最后异步使用同步提交
5. 提交特定偏移量，commitAync(map(topicparition,offsetandmetada)) 指定的偏移量
6. **使用ConsumerReblanceListener来锦亭 分区再分配时间 有 revoke和assign方法实现**

## kafka如何退出

在ShutdownHook调用 consumer.wakeup（）方法，该方法在调用后，consumer调用poll的时候会抛出WakeupException

## kafka高可用如何保证数据不丢失不重复消费?

[Spark Streaming和Kafka整合保证数据零丢失 - FelixZh - 博客园](https://www.cnblogs.com/felixzh/p/6371253.html)

## kafka控制器的选举方式?

1. kafka通过zk的临时节点选举控制器，在节点加入集群或者退出通知控制器，控制器负责加入或者离开集群时进行分区的首领选举，使用 epoch避免脑裂（两个节点都认为自己是当前的控制器：通过controller epoch 的新旧来判断）

![image](https://static.lovedata.net/20-11-20-bbc8bcc9cb30879bfcf2a47de7338da5.png-wm)

[KafkaController介绍 - CSDN博客](https://blog.csdn.net/zhanglh046/article/details/72821995)

## kafka broker 如何把消息发送给客户端

1. 客户端请求首先罗到分区首领上
2. 首领接到请求后首先判断请求是否有效：指定偏移是否存在  否则返回一个错误
3. kafka使用  **零复制** 技术，直接从文件（linux文件缓冲区） 里发送到网络，不是使用缓冲区，避免了字节复制，也不需要内存缓冲区

## kafka 有哪些保证?

1. kafka保证分区消息的顺序 同生产者，同分区
2. 只有当消息被写入分区所有的同步副本时候，才被认为是已提交的。
3. 只要还有一个副本是活跃的，那么已提交的消息就不会丢失
4. 消费者只能读取已被提交的消息

## 副本满足什么条件才被认为是同步的?

1. 与zk有一个活跃会话，在过去六秒。。 向zk发送过心跳
2. 过去十秒。。向首领发送过消息
3. 在过去十秒从首领那里获取最新的消息（必须是零延迟的）

## kafka IRS 副本下线的一些机制?  

## 不完全的首领选举的解释?

unclean.leader.electon.enable=true 允许不同步的副本成为首领，面临丢失消息的风险，可能造成一些不一致的情况，设置为false，就是等待原先的首领重新上线，降低可用性，银行系统一般禁用掉这个配置。在实时点击流分析系统，一般会启用不完全的首领选举

## 最小同步副本

min.insync.replicas 消息被写入所有同步副本才可以被认为已经提交的。  如果要确保提交数据被写入不止一个副本，就需要吧最小同部分数量设置为大一些，比如设置为2，则最少有两个同步副本才可以向分区写入数据，否则抛出 NotEnoughReplication异常。

## 如何保证生产者的可靠性

broker配置很可靠，生产者配置不可靠的一些例子

1. broker 3 副本，禁用不完全首领选举， 生产者 acks=1, 写入一条数据，首领收到，副本没有接收到，然后首领崩溃，没有被其他副本复制过去，副本仍然别认为是同步的，其中一个副本成了新首领， 所以这个消息就丢失了
2. broker 3 副本，禁用不完全首领选举， acks=all,加入发送消息首领崩溃，会受到错误，如果生产者没有正确处理消息，则消息丢失

注意两件事情

1. 根据可靠性配置acks值
2. 正确的错误处理

###  发送前确认

acks=0  可能丢数据
acks=1 消息写入首领，副本成功复制之前首领发生崩溃
acks=all 结合 min.insync.replicas 最安全的做法，可以通过异步模式或者大批次加快速度，降低吞吐量

###  额外的错误处理

需要重试其他类型的不可重试的错误

1. 不可重试错误 大小错误 认证错误
2. 消息发送之前发生错误，序列化
3. 达到重试次数上限，消息占用内存达到上限


## 如何保证消费者的可靠性?

> 只有被提交到kafka，并写入所有副本的数据，对消费者是可用的，具备一致性，消费者唯一要做的是跟踪哪些消息是已经读取过的，哪些没有读取过

再均衡 
一般要在分区被撤销之前提交偏移量，并在分配到新分区时清理之前的状态

长时间处理
消费者复杂计算的时候，暂停轮询不能超过几秒钟，即使不想获取更多数据，也要保持轮询，这样客户端才能网broker发送心跳，一般使用线程池处理数据，然后puase暂停消费者，保持轮询，不获取新数据，知道处理完成

## kafka at-least-once at-most-once exactly-once 语义?

[Kafka设计解析（八）- Exactly Once语义与事务机制原理 - 郭俊Jason - 博客园](https://www.cnblogs.com/jasongj/p/7912348.html)




## Kafka 可靠性方面的了解?

[kafka 数据可靠性深度解读 - ImportNew](http://www.importnew.com/24973.html)

## kafka 的存储原理

###  原理

![image](https://static.lovedata.net/jpg/2018/6/29/6bcada812e760caa75d0129415f1c726.jpg-wm)

- Broker：消息中间件处理结点，一个Kafka节点就是一个broker，多个broker可以组成一个Kafka集群；
- Topic：一类消息，例如page view日志、click日志等都可以以topic的形式存在，Kafka集群能够同时负责多个topic的分发；
- Partition：topic物理上的分组，一个topic可以分为多个partition，每个partition是一个有序的队；
- Segment：每个partition又由多个segment file组成；
  - 里面又有很多大小相等的segment数据文件（这个文件的具体大小可以在config/server.properties中进行设置）
- offset：每个partition都由一系列有序的、不可变的消息组成，这些消息被连续的追加到partition中。partition中的每个消息都有一个连续的序列号叫做offset，用于partition唯一标识一条消息；
- message：这个算是kafka文件中最小的存储单位，即是 a commit log。

segment file的组成

- index file和data file，这两个文件是一一对应的，后缀”.index”和”.log”分别表示索引文件和数据文件；
- partition的第一个segment从0开始，后续每个segment文件名为上一个segment文件最后一条消息的offset
- ![image](https://static.lovedata.net/jpg/2018/6/29/51b401e9432e91897ee43a7c0645b628.jpg-wm) 
- ![image](https://static.lovedata.net/jpg/2018/6/29/4fc28d18dcf62a1238ca33c3bdf400ab.jpg-wm)

###  在partition中如何通过offset查找message

![image](https://static.lovedata.net/jpg/2018/6/29/c3235d6eb5770e966babeccb67d8ba4d.jpg-wm)

例如读取offset=368776的message，需要通过下面2个步骤查找。

**第一步查找segment file**
上述图2为例，其中00000000000000000000.index表示最开始的文件，起始偏移量(offset)为0.第二个文件00000000000000368769.index的消息量起始偏移量为368770 = 368769 + 1.同样，第三个文件00000000000000737337.index的起始偏移量为737338=737337 + 1，其他后续文件依次类推，以起始偏移量命名并排序这些文件，只要根据offset **二分查找**文件列表，就可以快速定位到具体文件。
当offset=368776时定位到00000000000000368769.index|log

第二步通过segment file查找message
通过第一步定位到segment file，当offset=368776时，依次定位到00000000000000368769.index的元数据物理位置和00000000000000368769.log的物理偏移地址，然后再通过00000000000000368769.log顺序查找直到offset=368776为止。

![image](https://static.lovedata.net/jpg/2018/6/29/94eec0f6538ca33006d49e788fe9f43d.jpg-wm)

>index 文件中 的第一个是一个消息在log中的顺序，比如相对于第一个消息，是第三条消息，第二个值是在文件中的物理偏移量，用于文件查找，直接定位到这个position，直接打开后，打开了这个索引段对应的消息，比较消息的头几位数组，对比是否相等，如果不相等，则继续往下面去读，一直读到指定的offset

![image](https://static.lovedata.net/jpg/2018/6/29/f5b24416d69381aa63db92eb1d6f124f.jpg-wm)

![image](https://static.lovedata.net/jpg/2018/6/29/9d2397ceec6cd045f6e16d58c196a6c1.jpg-wm)

###  存储结构设计原因

1. 为什么有segment，而不是把partition直接设计成单个文件？
    方便消费后删除，可以节约空间，如果是单个文件，该文件由于会被不断写入，无法删除，则会无限增加。当需要清理时，则需要在保证写入的同时，清理该文件的前面已经过期的消息，效率十分低下。
2. 为什么有partition？
    方便水平扩展broker，如果不设计多个partition，那么当部署完成之时，topic就会被限定在一台机器上了，随着业务增加，最终会陷入瓶颈
3. 索引文件的作用
    使查找效率为O(1)，即与文件大小无关，与查找的位置无关

## Kafka 的设计架构

![image](https://static.lovedata.net/20-05-18-4f32a3358ce634a9b47e8ba8f647f51e.png-wm)

Kafka 架构分为以下几个部分

- Producer ：消息生产者，就是向 kafka broker 发消息的客户端。
- Consumer ：消息消费者，向 kafka broker 取消息的客户端。
- Topic ：可以理解为一个队列，一个 Topic 又分为一个或多个分区，
- Consumer Group：这是 kafka 用来实现一个 topic 消息的广播（发给所有的 consumer）和单播（发给任意一个 consumer）的手段。一个 topic 可以有多个 Consumer Group。
- Broker ：一台 kafka 服务器就是一个 broker。一个集群由多个 broker 组成。一个 broker 可以容纳多个 topic。
- Partition：为了实现扩展性，一个非常大的 topic 可以分布到多个 broker上，每个 partition 是一个有序的队列。partition 中的每条消息都会被分配一个有序的id（offset）。将消息发给 consumer，kafka 只保证按一个 partition 中的消息的顺序，不保证一个 topic 的整体（多个 partition 间）的顺序。
- Offset：kafka 的存储文件都是按照 offset.kafka 来命名，用 offset 做名字的好处是方便查找。例如你想找位于 2049 的位置，只要找到 2048.kafka 的文件即可。当然 the first offset 就是 00000000000.kafka。



## Kafka 分区的目的?

分区对于 Kafka 集群的好处是：实现负载均衡。分区对于消费者来说，可以提高并发度，提高效率。

## Kafka 是如何做到消息的有序性?

kafka 中的每个 partition 中的消息在写入时都是有序的，而且单独一个 partition 只能由一个消费者去消费，可以在里面保证消息的顺序性。但是分区之间的消息是不保证有序的。



## Kafka 的高可靠性是怎么实现的?

[Kafka 是如何保证数据可靠性和一致性](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=2650716970&idx=1&sn=3875dd83ca35c683bfa42135c55a03ab&chksm=887da65cbf0a2f4aeae51f4d41fa8dec9c66af17fbc423eb5a1b0d35d20348880c8b2539ddbf&scene=21#wechat_redirect)



## 请谈一谈 Kafka 数据一致性原理

一致性就是说不论是老的 Leader 还是新选举的 Leader，Consumer 都能读到一样的数据。

![image](https://static.lovedata.net/20-05-18-299d662862e8674189d980a23c0074bf.png-wm)

假设分区的副本为3，其中副本0是 Leader，副本1和副本2是 follower，并且在 ISR 列表里面。虽然副本0已经写入了 Message4，但是 Consumer 只能读取到 Message2。因为所有的 ISR 都同步了 Message2，只有 High Water Mark 以上的消息才支持 Consumer 读取，而 High Water Mark 取决于 ISR 列表里面偏移量最小的分区，对应于上图的副本2，这个很类似于木桶原理。

这样做的原因是还没有被足够多副本复制的消息被认为是“不安全”的，如果 Leader 发生崩溃，另一个副本成为新 Leader，那么这些消息很可能丢失了。如果我们允许消费者读取这些消息，可能就会破坏一致性。试想，一个消费者从当前 Leader（副本0） 读取并处理了 Message4，这个时候 Leader 挂掉了，选举了副本1为新的 Leader，这时候另一个消费者再去从新的 Leader 读取消息，发现这个消息其实并不存在，这就导致了数据不一致性问题。

当然，引入了 High Water Mark 机制，会导致 Broker 间的消息复制因为某些原因变慢，那么消息到达消费者的时间也会随之变长（因为我们会先等待消息复制完毕）。延迟时间可以通过参数 replica.lag.time.max.ms 参数配置，它指定了副本在复制消息时可被允许的最大延迟时间。

## ISR、OSR、AR 是什么?

ISR：In-Sync Replicas 副本同步队列

OSR：Out-of-Sync Replicas 

AR：Assigned Replicas 所有副本

ISR是由leader维护，follower从leader同步数据有一些延迟（具体可以参见 [图文了解 Kafka 的副本复制机制](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=2650716907&idx=1&sn=3aaf4be490baf2697633b7470cf76457&chksm=887da79dbf0a2e8b31983bf37018adb0e9026c87dff5d1d43a3b4209580d71ecbe1f085be96f&scene=21#wechat_redirect)），超过相应的阈值会把 follower 剔除出 ISR, 存入OSR（Out-of-Sync Replicas ）列表，新加入的follower也会先存放在OSR中。AR=ISR+OSR。

## LEO、HW、LSO、LW等分别代表什么

- LEO：是 LogEndOffset 的简称，代表当前日志文件中下一条

- HW：水位或水印（watermark）一词，也可称为高水位(high watermark)，通常被用在流式处理领域（比如Apache Flink、Apache Spark等），以表征元素或事件在基于时间层面上的进度。在Kafka中，水位的概念反而与时间无关，而是与位置信息相关。严格来说，它表示的就是位置信息，即位移（offset）。取 partition 对应的 ISR中 最小的 LEO 作为 HW，consumer 最多只能消费到 HW 所在的位置上一条信息。

- LSO：是 LastStableOffset 的简称，对未完成的事务而言，LSO 的值等于事务中第一条消息的位置(firstUnstableOffset)，对已完成的事务而言，它的值同 HW 相同 

- LW：Low Watermark 低水位, 代表 AR 集合中最小的 logStartOffset 值。

  

## Kafka 在什么情况下会出现消息丢失?

[Kafka 是如何保证数据可靠性和一致性](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=2650716970&idx=1&sn=3875dd83ca35c683bfa42135c55a03ab&chksm=887da65cbf0a2f4aeae51f4d41fa8dec9c66af17fbc423eb5a1b0d35d20348880c8b2539ddbf&scene=21#wechat_redirect)

11、怎么尽可能保证 Kafka 的可靠性

[Kafka 是如何保证数据可靠性和一致性](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=2650716970&idx=1&sn=3875dd83ca35c683bfa42135c55a03ab&chksm=887da65cbf0a2f4aeae51f4d41fa8dec9c66af17fbc423eb5a1b0d35d20348880c8b2539ddbf&scene=21#wechat_redirect)

## 消费者和消费者组有什么关系?

每个消费者从属于消费组。具体关系如下：

![image](https://static.lovedata.net/20-05-18-a55bbf36a6eca98140a8ea123ae017e5.png-wm)

## Kafka 的每个分区只能被一个消费者线程,如何做到多个线程同时消费一个分区?

[参见我这篇文章：Airbnb 是如何通过 balanced Kafka reader 来扩展 Spark streaming 实时流处理能力的](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=2650716863&idx=1&sn=20d42a18ad084eb1adc8db126cae71cd&chksm=887da7c9bf0a2edf8b30a3dd783a4f3f1097078ff3a840d25f57b8eaa06815c63fadd0bcb68b&scene=21#wechat_redirect)

## 数据传输的事务有几种?

数据传输的事务定义通常有以下三种级别：

（1）最多一次: 消息不会被重复发送，最多被传输一次，但也有可能一次不传输

（2）最少一次: 消息不会被漏发送，最少被传输一次，但也有可能被重复传输.

（3）精确的一次（Exactly once）: 不会漏传输也不会重复传输,每个消息都传输被

## Kafka 消费者是否可以消费指定分区消息?

Kafa consumer消费消息时，向broker发出fetch请求去消费特定分区的消息，consumer指定消息在日志中的偏移量（offset），就可以消费从这个位置开始的消息，customer拥有了offset的控制权，可以向后回滚去重新消费之前的消息，这是很有意义的

## Kafka消息是采用Pull模式,还是Push模式?

Kafka最初考虑的问题是，customer应该从brokes拉取消息还是brokers将消息推送到consumer，也就是pull还push。在这方面，Kafka遵循了一种大部分消息系统共同的传统的设计：producer将消息推送到broker，consumer从broker拉取消息。

一些消息系统比如Scribe和Apache Flume采用了push模式，将消息推送到下游的consumer。这样做有好处也有坏处：由broker决定消息推送的速率，对于不同消费速率的consumer就不太好处理了。消息系统都致力于让consumer以最大的速率最快速的消费消息，但不幸的是，push模式下，当broker推送的速率远大于consumer消费的速率时，consumer恐怕就要崩溃了。最终Kafka还是选取了传统的pull模式。

Pull模式的另外一个好处是consumer可以自主决定是否批量的从broker拉取数据。Push模式必须在不知道下游consumer消费能力和消费策略的情况下决定是立即推送每条消息还是缓存之后批量推送。如果为了避免consumer崩溃而采用较低的推送速率，将可能导致一次只推送较少的消息而造成浪费。Pull模式下，consumer就可以根据自己的消费能力去决定这些策略。

Pull有个缺点是，如果broker没有可供消费的消息，将导致consumer不断在循环中轮询，直到新消息到t达。为了避免这点，Kafka有个参数可以让consumer阻塞知道新消息到达(当然也可以阻塞知道消息的数量达到某个特定的量这样就可以批量发

## Kafka 消息格式的演变清楚吗?

Kafka 的消息格式经过了四次大变化，具体[Apache Kafka消息格式的演变(0.7.x~0.10.x)](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=2650714506&idx=1&sn=6499c694e0ab80a8cf0186544507dfd0&chksm=887dacfcbf0a25ea2106ccddbaa8c39bae2f4dd0754a4528bc198d0b8d164115b2ea103db6ff&scene=21#wechat_redirect)。

## Kafka 偏移量的演变清楚吗?

参见我这篇文章：[图解Apache Kafka消息偏移量的演变(0.7.x~0.10.x)](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=2650714529&idx=1&sn=e85eff6266ccac2d6532bb636c5b92c2&chksm=887dacd7bf0a25c1032e52c28b06d46c76de6dc290100f176b2ac8ebfb063f0c81efe83b4bf5&scene=21#wechat_redirect)

## Kafka 高效文件存储设计特点

- Kafka把topic中一个parition大文件分成多个小文件段，通过多个小文件段，就容易定期清除或删除已经消费完文件，减少磁盘占用。
- 通过索引信息可以快速定位message和确定response的最大大小。
- 通过index元数据全部映射到memory，可以避免segment file的IO磁盘操作。
- 通过索引文件稀疏存储，可以大幅降低index文件元数据占用空间大小

## Kafka创建Topic时如何将分区放置到不同的Broker中

- 副本因子不能大于 Broker 的个数；
- 第一个分区（编号为0）的第一个副本放置位置是随机从 brokerList 选择的；
- 其他分区的第一个副本放置位置相对于第0个分区依次往后移。也就是如果我们有5个 Broker，5个分区，假设第一个分区放在第四个 Broker 上，那么第二个分区将会放在第五个 Broker 上；第三个分区将会放在第一个 Broker 上；第四个分区将会放在第二个 Broker 上，依次类推；
- 剩余的副本相对于第一个副本放置位置其实是由 nextReplicaShift 决定的，而这个数也是随机产生的



具体可以参见 [Kafka创建Topic时如何将分区放置到不同的Broker中](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=2650716375&idx=1&sn=4e1ac64aa6f7eaa5a210c3fb51977b7d&chksm=887da5a1bf0a2cb7855e99aecc0e003c3728c34dedc741c70ec9ca18345e541906b9c85c8b00&scene=21#wechat_redirect)。

## Kafka新建的分区会在哪个目录下创建

在启动 Kafka 集群之前，我们需要配置好 log.dirs 参数，其值是 Kafka 数据的存放目录，这个参数可以配置多个目录，目录之间使用逗号分隔，通常这些目录是分布在不同的磁盘上用于提高读写性能。

当然我们也可以配置 log.dir 参数，含义一样。只需要设置其中一个即可。

如果 log.dirs 参数只配置了一个目录，那么分配到各个 Broker 上的分区肯定只能在这个目录下创建文件夹用于存放数据。

但是如果 log.dirs 参数配置了多个目录，那么 Kafka 会在哪个文件夹中创建分区目录呢？答案是：Kafka 会在含有分区目录最少的文件夹中创建新的分区目录，分区目录名为 Topic名+分区ID。注意，是分区文件夹总数最少的目录，而不是磁盘使用量最少的目录！也就是说，如果你给 log.dirs 参数新增了一个新的磁盘，新的分区目录肯定是先在这个新的磁盘上创建直到这个新的磁盘目录拥有的分区目录不是最少为止。

具体可以参见我博客：https://www.iteblog.com/archives/2231.html

## 谈一谈 Kafka 的再均衡

在Kafka中，当有新消费者加入或者订阅的topic数发生变化时，会触发Rebalance(再均衡：在同一个消费者组当中，分区的所有权从一个消费者转移到另外一个消费者)机制，Rebalance顾名思义就是重新均衡消费者消费。Rebalance的过程如下：

第一步：所有成员都向coordinator发送请求，请求入组。一旦所有成员都发送了请求，coordinator会从中选择一个consumer担任leader的角色，并把组成员信息以及订阅信息发给leader。

第二步：leader开始分配消费方案，指明具体哪个consumer负责消费哪些topic的哪些partition。一旦完成分配，leader会将这个方案发给coordinator。coordinator接收到分配方案之后会把方案发给各个consumer，这样组内的所有成员就都知道自己应该消费哪些分区了。

所以对于Rebalance来说，Coordinator起着至关重要的作用

## 谈谈 Kafka 分区分配策略

参见我这篇文章 [Kafka分区分配策略(Partition Assignment Strategy)](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=2650715861&idx=1&sn=03ff472f21fd429ac09559aca8f2b2bc&chksm=887daba3bf0a22b58e46e1c214f6b44592ada2d1b3e21137ead9d63ff86e41f094660252fd16&scene=21#wechat_redirect)

## Kafka Producer 是如何动态感知主题分区数变化的?

[参见我这篇文章：Kafka Producer是如何动态感知Topic分区数变化](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=403008823&idx=1&sn=442e1909d509f312d5057e4cfc478793&chksm=0d8670413af1f957ebdcea08cef0244447a5bd23bafd3a50efd326a949e4fa2142493476b497&scene=21#wechat_redirect)



##  Kafka 是如何实现高吞吐率的?

Kafka是分布式消息系统，需要处理海量的消息，Kafka的设计是把所有的消息都写入速度低容量大的硬盘，以此来换取更强的存储能力，但实际上，使用硬盘并没有带来过多的性能损失。kafka主要使用了以下几个方式实现了超高的吞吐率：

- 顺序读写；
- 零拷贝
- 文件分段
- 批量发送
- 数据压缩。

[具体参见：Kafka是如何实现高吞吐率的](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=402790390&idx=1&sn=f0200f45e6697d703bf694fed7573fe1&chksm=0d810a803af68396857cf45264bead78e7f3b56cd8e49853bc798c50bc3ed4fea4440f52c901&scene=21#wechat_redirect)

## Kafka 监控都有哪些?

[参见我另外几篇文章：Apache Kafka监控之KafkaOffsetMonitor](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=200581484&idx=1&sn=3e14a01cf1eb514dfdde73a6f032643d&chksm=1e77bc1a2900350cf546522ff9ce4a6387c0f797ba056ff18f19180c06ad6c8817e4ba337974&scene=21#wechat_redirect)

[雅虎开源的Kafka集群管理器(Kafka Manager)](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=203369107&idx=1&sn=badcbedd5dd6bc1975307175d03e1a4f&chksm=199c37e52eebbef35106892a80b641394d6467478537ca0a0ff5a1ac605e336e3f18d45d2282&scene=21#wechat_redirect)

[Apache Kafka监控之Kafka Web Console](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=200584408&idx=1&sn=30a4ac3f68972bcfd8375708ba78de74&chksm=1e77b1ae290038b82bd8fbe9032ade23b7952ec8f8e07acd3d12dc29537ea0612b115956f471&scene=21#wechat_redirect)

还有 JMX

## 如何为Kafka集群选择合适的Topics/Partitions数量

[参见我另外几篇文章](http://mp.weixin.qq.com/s?__biz=MzA5MTc0NTMwNQ==&mid=200581484&idx=1&sn=3e14a01cf1eb514dfdde73a6f032643d&chksm=1e77bc1a2900350cf546522ff9ce4a6387c0f797ba056ff18f19180c06ad6c8817e4ba337974&scene=21#wechat_redirect)：如何为Kafka集群选择合适的Topics/Partitions数量

## 谈谈你对 Kafka 事务的了解?

参见这篇文章：http://www.jasongj.com/kafka/transaction/

29、谈谈你对 Kafka 幂等的了解？

参见这篇文章：https://www.jianshu.com/p/b1599f46229b

## Kafka 缺点?

- 由于是批量发送，数据并非真正的实时；
- 对于mqtt协议不支持；
- 不支持物联网传感数据直接接入；
- 仅支持统一分区内消息有序，无法实现全局消息有序；
- 监控不完善，需要安装插件；
- 依赖zookeeper进行元数据管理；

## Kafka 新旧消费者的区别

旧的 Kafka 消费者 API 主要包括：SimpleConsumer（简单消费者） 和 ZookeeperConsumerConnectir（高级消费者）。SimpleConsumer 名字看起来是简单消费者，但是其实用起来很不简单，可以使用它从特定的分区和偏移量开始读取消息。高级消费者和现在新的消费者有点像，有消费者群组，有分区再均衡，不过它使用 ZK 来管理消费者群组，并不具备偏移量和再均衡的可操控性。

现在的消费者同时支持以上两种行为，所以为啥还用旧消费者 API 呢？

 ![image](https://static.lovedata.net/20-05-18-16d862bf39db2bb72a414f1bb5b51184.png-wm)

## Kafka 分区数可以增加或减少吗?为什么? 

我们可以使用 bin/kafka-topics.sh 命令对 Kafka 增加 Kafka 的分区数据，但是 Kafka 不支持减少分区数。 

Kafka 分区数据不支持减少是由很多原因的，比如减少的分区其数据放到哪里去？是删除，还是保留？删除的话，那么这些没消费的消息不就丢了。如果保留这些消息如何放到其他分区里面？追加到其他分区后面的话那么就破坏了 Kafka 单个分区的有序性。如果要保证删除分区数据插入到其他分区保证有序性，那么实现起来逻辑就会非常复杂。



## kafka 可以脱离 zookeeper 单独使用吗?为什么?

## kafka 有几种数据保留的策略?

## kafka 同时设置了 7 天和 10G 清除数据,到第五天的时候消息达到了 10G,这个时候 kafka 将如何处理?

## 什么情况会导致 kafka 运行变慢?

参考

[Kafka之数据存储 | Matt's Blog](http://matt33.com/2016/03/08/kafka-store/)
[Kafka文件存储机制那些事 -](https://tech.meituan.com/kafka-fs-design-theory.html)
[kafka存储结构 - CSDN博客](https://blog.csdn.net/yaolong336/article/details/80047701)
[Kafka读写原理与存储结构 | Hello, World](https://qinzhaokun.github.io/2017/09/10/Kafka%E8%AF%BB%E5%86%99%E5%8E%9F%E7%90%86%E4%B8%8E%E5%AD%98%E5%82%A8%E7%BB%93%E6%9E%84/)



## Kafka什么时候丢数据场景?

[Kafka如果丢了消息，怎么处理的?](https://mp.weixin.qq.com/s/ZxOURh6ljGRFTewTDJa7Jw)

![image](https://static.lovedata.net/20-12-22-c33036322c6757f7679db4e08646d62c.png-wm)



### Broker

kafka本身原因，为了性能和吞吐量，数据异步批量存储在磁盘

由于linux操作系统决定的，回西安存储到页缓存(page cache) 按照条件刷盘(page cache 到file)

![image](https://static.lovedata.net/20-12-22-b96b20d0ab95c26d9d4ecf405fedd4f1.png-wm)

#### ack制协调

- acks=0 producer不等待broker的响应，效率最高，但是消息很可能会丢
- acks=1 leader broker收到消息后，不等待其他follower的响应，即返回ack leader收到消息，写入pagecache，就返回了，如果leader断电了， 数据就会丢失
- acks=-1，leader broker收到消息后，挂起，等待所有ISR列表中的follower返回结果后，再返回ack。-1等效与all。

![image](https://static.lovedata.net/20-12-22-4a1c4336839eb2f08411c613016aefd9.png-wm)

如上图中：

- acks=0，总耗时f(t) = f(1)。
- acks=1，总耗时f(t) = f(1) + f(2)。
- acks=-1，总耗时f(t) = f(1) + max( f(A) , f(B) ) + f(2)。

性能依次递减，可靠性依次升高。



### Producer

Producer丢失消息，发生在生产者客户端。

为了提升效率，客户端缓存本地buffer中，打包成块按照时间间隔发送buffer

通过buffer可以将生产者改为异步的方式

BUT

buffer数据就是危险的。

一旦producer被非法的停止了，那么buffer中的数据将丢失

producer内存不够了，策略是丢弃，则会丢失数据

消息速度太快，程序崩溃

![image](https://static.lovedata.net/20-12-22-788bad75a9e1ff0c8354eec3efd47d5e.png-wm)

![image](https://static.lovedata.net/20-12-22-ddc53065e08a1ed73b246983a329b5d3.png-wm)



#### 思路：

1. 同步发送，产生消息的时候，使用阻塞线程池，线程数有上限
2. 扩大buffer容量，缓解，无法杜绝
3. 不将消息发送buffer，写入本地磁盘或者其他介质

### Consumer

Consumer消费消息有下面几个步骤：

1. 接收消息
2. 处理消息
3. 反馈“处理完毕”（commited）

Consumer的消费方式主要分为两种：

- 自动提交offset，Automatic Offset Committing
- 手动提交offset，Manual Offset Control



## HW 和 Leader Epoch

epoch 时代\ [ˈiːpɒk]

[深入分析Kafka高可用性 - 知乎](https://zhuanlan.zhihu.com/p/46658003)

[Kafka水位(high watermark)与leader epoch的讨论 - huxihx - 博客园](https://www.cnblogs.com/huxi2b/p/7453543.html)

水位或水印（watermark）一词，也可称为高水位(high watermark)，通常被用在流式处理领域（比如Apache Flink、Apache Spark等），以表征元素或事件在基于时间层面上的进度。一个比较经典的表述为：流式系统保证在水位t时刻，创建时间（event time） = t'且t' ≤ t的所有事件都已经到达或被观测到。









