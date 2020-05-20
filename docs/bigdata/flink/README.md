# Flink

[[toc]]

## Flink 容错机制

### 介绍

[【译】Apache Flink 容错机制 - 苏州谷歌开发者社区 - SegmentFault 思否](https://segmentfault.com/a/1190000008129552)

- Apache Flink 提供了可以恢复数据流应用到一致状态的容错机制
- 发生故障时，程序的每条记录只会作用于状态一次（exactly-once）
- 容错机制通过持续**创建分布式数据流**的快照来实现
  - 轻量
  - 可配置
  - 性能影响小
- 为了容错机制生效，数据源（例如 queue 或者 broker）需要能重放数据流

### Checkpointing  

- Flink 容错机制的核心就是持续创建分布式数据流及其状态的一致快照
- 遇到故障，充当可以回退的一致性检查点（checkpoint）
- 受分布式快照算法 [Chandy-Lamport](http://research.microsoft.com/en-us/um/people/lamport/pubs/chandy.pdf) 启发

### Barriers

- 快照核心概念- 数据栅栏

- 插入到数据流中，同数据流动

- Barrier 分割数据流， 前面一部分进入到当前快照，另一部分进入到下一次，每个Barrier有快照ID，并且之前的数据进入了此快照。

  - ![image](http://static.lovedata.net/20-05-20-693ead1dcfb4534524efba10634defe2.png-wm)
  - ![image](http://static.lovedata.net/20-05-20-d237d343ea98ca60b7dbb6ef08010ed0.png-wm)

  

### State

- 形式
  - 用户自定义状态  
  - 系统状态，缓存数据，windows buffer

- 存储
  - 默认存储在JobManager内存之中
  - 生产一部分配置在可靠的分布式存储系统（HDFS）
- 包含
  - 对于并行输入数据源：快照创建时数据流中的位置偏移
  - 对于 operator：存储在快照中的状态指针
  - ![image](http://static.lovedata.net/20-05-20-5ea3a0ab93d435c36098b80bdb89471f.png-wm)

### Exactly Once vs. At Least Once

- 对齐操作可能会对流程序增加延迟
- Flink 提供了在 checkpoint 时关闭对齐的方法。当 operator 接收到一个 barrier 时，就会打一个快照，而不会等待其他 barrier，会继续处理数据，而当异常恢复的时候，就会有数据被重复输入，也就是At least once
- 对齐操作只会发生在拥有多输入运算（join)或者多个输出的 operator（重分区、分流）的场景下. Map filter严格仅一次



### Asynchronous State Snapshots

- 存储快照的时候，operator继续处理数据
- 使用rocksdb使用写时复制（copy on write） 类型数据结构



### Recovery

一旦遇到故障，Flink 选择最近一个完成的 checkpoint k。系统重新部署整个分布式数据流，重置所有 operator 的状态到 checkpoint k。数据源被置为从 Sk 位置读取