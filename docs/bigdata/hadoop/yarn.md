# Yarn

[[toc]]

## 1 YARN的新特性

## 2 hadoop的调度策略的实现，你们使用的是那种策略，为什么？

对一个资源管理系统而言，首先要定义出资源的种类，然后将每种资源量化，才能管理。这就是资源抽象的过程。

Container

Container是RM分配资源的基本单位。每个Container包含特定数量的CPU资源和内存资源，用户的程序运行在Container中，有点类似虚拟机。RM负责接收用户的资源请求并分配Container，NM负责启动Container并监控资源使用。如果使用的资源（目前只有内存）超出Container的限制，相应进程会被NM杀掉。

在YARN中，调度器是一个可插拔的组件，常见的有FIFO，CapacityScheduler，FairScheduler。可以通过配置文件选择不同的调度器。

FIFO

最简单、也是默认的调度器。只有一个队列，所有用户共享。
资源分配的过程也非常简单，先到先得，所以很容易出现一个用户占满集群所有资源的情况。
可以设置ACL，但不能设置各个用户的优先级。

优点是简单好理解，缺点是无法控制每个用户的资源使用。
一般不能用于生产环境中。

[YARN资源调度策略 // foolbear的冥想盆](http://jxy.me/2015/04/30/yarn-resource-scheduler/)

需要熟悉下Yarn资源调度机制

## 3 画一个yarn架构图，及其通信流程；

![image](http://static.lovedata.net/jpg/2018/7/4/33789bff3b6481fa26da13c743d815c7.jpg-wm)
![image](http://static.lovedata.net/jpg/2018/7/4/50b9c520a08ac25c70008cf1fb620ed9.jpg-wm)

![image](http://static.lovedata.net/jpg/2018/7/4/5ad787782060aa4e9310f186b2cedbf8.jpg-wm)

## 4. Hadoop的作业提交流程

![image](http://static.lovedata.net/jpg/2018/7/4/5ad787782060aa4e9310f186b2cedbf8.jpg-wm)


## 5. 如何减少Hadoop Map端到Reduce端的数据传输量

减少传输量，可以让map处理完，让同台的reduce直接处理，理想情况下，没有数据传输。