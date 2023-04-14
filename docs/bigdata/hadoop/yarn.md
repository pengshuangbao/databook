# Yarn

[toc]

## YARN的新特性

## hadoop的调度策略的实现,你们使用的是那种策略,为什么?

[YARN资源调度策略 // foolbear的冥想盆](http://jxy.me/2015/04/30/yarn-resource-scheduler/)

对一个资源管理系统而言，首先要定义出资源的种类，然后将每种资源量化，才能管理。这就是资源抽象的过程。

Container

Container是RM分配资源的基本单位。每个Container包含特定数量的CPU资源和内存资源，用户的程序运行在Container中，有点类似虚拟机。RM负责接收用户的资源请求并分配Container，NM负责启动Container并监控资源使用。如果使用的资源（目前只有内存）超出Container的限制，相应进程会被NM杀掉。

在YARN中，调度器是一个可插拔的组件，常见的有FIFO，CapacityScheduler，FairScheduler。可以通过配置文件选择不同的调度器。

### FIFO

最简单、也是默认的调度器。只有一个队列，所有用户共享。
资源分配的过程也非常简单，先到先得，所以很容易出现一个用户占满集群所有资源的情况。
可以设置ACL，但不能设置各个用户的优先级。

优点是简单好理解，缺点是无法控制每个用户的资源使用。
一般不能用于生产环境中。

## CapacityScheduler

在FIFO基础上，增加了**多用户支持**，最大化集群吞吐量和利用率。 

原理： 每个用户只能使用特定量资源，但是集群空闲的时候，也可以使用整个汲取你的资源。

特点：

1. 单用户下，和FIFO时一样的
2. xml配置
3. 树状，继承
4. ACL
5. 动态变化，最多100%



优点：

1. 灵活，集群利用率高
2. 灵活：某个用户占用100%的时候，如果不释放，其他必须等待，不支持抢占调度



## FairScheduler

**推荐使用**

优先**保持公平** 每个用户只有特定数量的资源可以用，不可能超出这个限制，即使集群整体很空闲

特点：

1. 支持抢占调度

优点：

1. 稳定
2. 管理方便
3. 运维成本低

缺点：

1. 相对于CapacityScheduler，牺牲了灵活性
2. 经常一个队列用满，但是集群很空闲

  需要熟悉下Yarn资源调度机制

## 画一个yarn架构图,及其通信流程；

![image](https://static.lovedata.net/jpg/2018/7/4/33789bff3b6481fa26da13c743d815c7.jpg)
![image](https://static.lovedata.net/jpg/2018/7/4/50b9c520a08ac25c70008cf1fb620ed9.jpg)

![image](https://static.lovedata.net/jpg/2018/7/4/5ad787782060aa4e9310f186b2cedbf8.jpg)

## Hadoop的作业提交流程

![image](https://static.lovedata.net/jpg/2018/7/4/5ad787782060aa4e9310f186b2cedbf8.jpg)


## 如何减少Hadoop Map端到Reduce端的数据传输量

减少传输量，可以让map处理完，让同台的reduce直接处理，理想情况下，没有数据传输。