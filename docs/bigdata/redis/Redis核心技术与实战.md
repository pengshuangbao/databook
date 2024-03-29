# Redis核心技术与实战

[toc]

## 01 | 基本架构：一个键值数据库包含什么？

更好的方式，是建立起“系统观”，如果我们想要深入理解一门技术，一个组件，就必须要对它的**总体架构**和**关键模块**有一个**全局**的认知，然后再**深入**到具体的技术点

Redis 支持的 value 类型包括了 String、哈希表、列表、集合等。Redis 能够在实际业务场景中得到广泛的应用，**就是得益于支持多样化类型的 value。**

**键值对保存在内存还是外存**

保存在内存的好处是读写很快，毕竟内存的访问速度一般都在百 ns 级别。但是，潜在的风险是一旦掉电，所有的数据都会丢失。保存在外存，虽然可以避免数据丢失，但是受限于磁盘的慢速读写（通常在几 ms 级别），键值数据库的整体性能会被拉低。

**如何进行设计选择，我们通常需要考虑键值数据库的主要应用场景**

![image](https://static.lovedata.net/20-11-17-c8029ae7151bdde4011ffceff8c557e3.png)



**不同的 I/O 模型对键值数据库的性能和可扩展性会有不同的影响**  单线程，多线程，协同？

单线程处理网络解析，数据操作，某一步阻塞了，整个就阻塞了，影响流程，多线程的话，一个线程阻塞了，其他线程还可以继续工作，但是这就有一个共享资源的问题，如何处理线程竞争，线程切换，同样也会耗费资源

**索引的作用是让键值数据库根据 key 找到相应 value 的存储位置，进而执行操作。**

哈希表、B+ 树、字典树  Memcached 和 Redis 采用哈希表作为 key-value 索引，而 RocksDB 则采用跳表作为内存中 key-value 的索引

内存键值数据库（例如 Redis）采用哈希表作为索引，很大一部分原因在于，其键值数据基本都是保存在内存中的，而内存的高性能随机访问特性可以很好地与哈希表 O(1) 的操作复杂度相匹配。



![image](https://static.lovedata.net/20-11-17-0c7bb79d52845ebf97647248651097c2.png)



SimpleKV和Redis的对比：
【数据结构】上缺乏广泛的数据结构支持：比如支持范围查询的SkipList，和Stream等等数据结构
【高可用】上缺乏，哨兵或者master-slaver模式的高可用设计
【横向扩展】上缺乏集群和分片功能
【在内存安全性】上，缺乏内存过载时候的key淘汰算法的支持
【内存利用率】没有充分对数据结构优化提高内存利用率，例如使用压缩性的数据结构
【功能扩展】需要具备后续功能的拓展
【不具备事务性】无法保证多个操作的原子性

内存分配器，SimpleKV就是glibc，Redis的分配器选择更多

跳表是在Redis的value类型为有序集合时采用的一种数据组织结构，作为集合内元素的索引，在有序集合中进行操作时会依赖于跳表索引。但是从key找到value本身这个过程还是由全局哈希表索引完成。



## 02 | 数据结构：快速的Redis有哪些慢操作？



### Redis的快

它接收到一个键值对操作后，能以微秒级别的速度找到数据，并快速完成操作。



### 数据结构 

数据保存形式 ： String（字符串）、List（列表）、Hash（哈希）、Set（集合）和 Sorted Set（有序集合）

底层数据结构一共有 6 种，分别是简单动态字符串、双向链表、压缩列表、哈希表、跳表和整数数组。

![image](https://static.lovedata.net/20-11-17-2238178df0422bb718eec74748bdcead.png)



键和值用什么结构组织？

Redis 使用了一个哈希表来保存所有键值对。一个哈希表，其实就是一个数组，数组的每个元素称为一个哈希桶。所以，我们常说，一个哈希表是由多个哈希桶组成的，每个哈希桶中保存了键值对数据

**哈希桶中的元素保存的并不是值本身，而是指向具体值的指针**

![image](https://static.lovedata.net/20-11-17-9b64dce1390abb198f99608a939d2212.png)



#### 哈希表的优点

我们可以用 O(1) 的时间复杂度来快速查找到键值对——我们只需要计算键的哈希值，就可以知道它所对应的哈希桶位置，然后就可以访问相应的 entry 元素。



### 为什么哈希表操作变慢了？

哈希表的冲突问题和 rehash 可能带来的操作阻塞

哈希冲突，也就是指，两个 key 的哈希值和哈希桶计算对应关系时，正好落在了同一个哈希桶中。

Redis 解决哈希冲突的方式，就是链式哈希。链式哈希也很容易理解，就是指同一个哈希桶中的多个元素用一个链表来保存，它们之间依次用指针连接。

![image](https://static.lovedata.net/20-11-17-d135b10ff6422d469795977fb0090827.png)



#### 问题

哈希冲突链上的元素只能通过指针逐一查找再操作,数据越多，hash冲突越多，hash冲突链路过长，导致这个链上的查找速度变慢



#### ReHash

rehash 也就是增加现有的哈希桶数量，让逐渐增多的 entry 元素能在更多的桶之间分散保存，减少单个桶中的元素数量，从而减少单个桶中的冲突

Redis使用两个全局hash表，哈希表1和哈希表2，最开始插入数据默认使用哈希表1，此时hash表2没有被分配空间，随着数据增多，redis开始进行rehash，三个步骤

1. 给hash表2分配更大的空间，more嗯hash表1的两倍
2. 把hash表1的数据重新映射到hash表2
3. 释放hash表1

#### 渐进式Rehash(防止进程暂定)

[渐进式 rehash — Redis 设计与实现](http://redisbook.com/preview/dict/incremental_rehashing.html)

Redis 仍然正常处理客户端请求，每处理一个请求时，从哈希表 1 中的**第一个索引位置（这里redis内部维护了一个rehashidx，初始值是-1，后面每次操作会加1，rehash完之后就会重新置为-1）**开始，顺带着将这个索引位置上的所有 entries 拷贝到哈希表 2 中；等处理下一个请求时，再顺带拷贝哈希表 1 中的下一个索引位置的 entries。

![img](https://static001.geekbang.org/resource/image/73/0c/73fb212d0b0928d96a0d7d6ayy76da0c.jpg)



### 底层数据结构

#### 压缩列表

列表在表头有三个字段 zlbytes、zltail 和 zllen，分别表示列表长度、列表尾的偏移量和列表中的 entry 个数；压缩列表在表尾还有一个 zlend

第一个元素和最后一个元素，可以通过表头三个字段的长度直接定位，复杂度是 O(1)。而查找其他元素时 逐个查找，此时的复杂度就是 O(N) 了。

![image](https://static.lovedata.net/20-11-17-18eab57b473c1525e8607a57b101df17.png)



#### 跳表

跳表在链表的基础上，增加了多级索引，通过索引位置的几个跳转，实现数据的快速定位

查找过程就是在多级索引上跳来跳去，最后定位到元素。这也正好符合“跳”表的叫法。当数据量很大时，跳表的查找复杂度就是 O(logN)。

![image](https://static.lovedata.net/20-11-17-035887690a0464ba4532cbc1f8eda582.png)



![image](https://static.lovedata.net/20-11-17-bf77260f04425534a8d4616660e6028a.png)

### 常见操作复杂度

单元素操作是基础；

范围操作非常耗时；

统计操作通常高效；

例外情况只有几个。



整数数组和压缩列表在查找时间复杂度方面并没有很大的优势，那为什么 Redis 还会把它们作为底层数据结构呢？

  1，数组和压缩列表可以提升内存利用率，因为他们的数据结构紧凑
  2，数组对CPU高速缓存支持友好，当数据元素超过阈值时，会转为hash和跳表，保证查询效率



## 03 | 高性能IO模型：为什么单线程Redis能那么快？

### 单线程？

Redis 是单线程，主要是指 Redis 的网络 IO 和键值对读写是由一个线程来完成的，这也是 Redis 对外提供键值存储服务的主要流程。

但 Redis 的其他功能，比如持久化、异步删除、集群数据同步等，其实是由额外的线程执行的。



### 为什么

#### 多线程的开销

通常理解： 使用多线程，可以增加系统吞吐率，或是可以增加系统扩展性

理想与现实

![image](https://static.lovedata.net/20-11-17-5cde7abb083fbfa667d341712d8a1332.png)



系统中通常会存在被多线程同时访问的共享资源，比如一个共享的数据结构 ，保证正确性，就需要一个额外的机制，就带来了一些开销

**多线程编程模式面临的共享资源的并发访问控制问题**。

![img](https://static001.geekbang.org/resource/image/30/08/303255dcce6d0837bf7e2440df0f8e08.jpg)

**为了避免这些问题，Redis 直接采用了单线程模式。**



### 单线程 Redis 为什么那么快？

> Redis 却能使用单线程模型达到每秒数十万级别的处理能力

- 内存 ，高效的数据结构，例如哈希表和跳表，

- 多路复用机制，使其在网络 IO 操作中能并发处理大量的客户端请求，实现高吞吐率

### 基本 IO 模型与阻塞点



![image](https://static.lovedata.net/20-11-17-50de090a9b352efb5e90f4a61a333712.png)



在这里的网络 IO 操作中，有潜在的阻塞点，分别是 accept() 和 recv()。当 Redis 监听到一个客户端有连接请求，但一直未能成功建立起连接时，会阻塞在 accept() 函数这里，导致其他客户端无法和 Redis 建立连接。类似的，当 Redis 通过 recv() 从一个客户端读取数据时，如果数据一直没有到达，Redis 也会一直阻塞在 recv()。



### 非阻塞模式

主要体现在三个关键的函数调用上

![image](https://static.lovedata.net/20-11-17-4f0b4635562266815d55dfe35e4f1f33.png)



### 基于多路复用的高性能 I/O 模型

Linux 中的 IO 多路复用机制是指一个线程处理多个 IO 流，就是我们经常听到的 select/epoll 机制

在 Redis 只运行单线程的情况下，该机制允许内核中，同时存在多个监听套接字和已连接套接字。

内核会一直监听这些套接字上的连接请求或数据请求。一旦有请求到达，就会交给 Redis 线程处理，这就实现了一个 Redis 线程处理多个 IO 流的效果。



![img](https://static001.geekbang.org/resource/image/00/ea/00ff790d4f6225aaeeebba34a71d8bea.jpg)



图中的多个 FD 就是刚才所说的多个套接字。Redis 网络框架调用 epoll 机制，让内核监听这些套接字

为了在请求到达时能通知到 Redis 线程，select/epoll 提供了基于事件的回调机制，即针对不同事件的发生，调用相应的处理函数。

FD有请求到达的时候，触发相应的事件，事件放入到一个事件队列之中，

因为 Redis 一直在对事件队列进行处理，所以能及时响应客户端请求，提升 Redis 的响应性能。



## 04 | AOF日志：宕机了，Redis如何避免数据丢失？



一旦服务器宕机，内存中的数据将全部丢失。

Redis 的持久化主要有两大机制，即 AOF（Append Only File）日志和 RDB 快照。

### AOF

WAL 写前日志

AOF 写后日志

![img](https://static001.geekbang.org/resource/image/40/1f/407f2686083afc37351cfd9107319a1f.jpg)

redo log（重做日志），记录的是修改后的数据，

**而 AOF 里记录的是 Redis 收到的每一条命令，这些命令是以文本形式保存的。**

![image](https://static.lovedata.net/20-11-17-4dc6329de8737389352e5f5f2c781095.png)

#### 为什么写后记录日志？

为了避免额外的检查开销，Redis 在向 AOF 里面记录日志的时候，并不会先去对这些命令进行语法检查。

所以，如果先记日志再执行命令的话，日志中就有可能记录了错误的命令，Redis 在使用日志恢复数据时，就可能会出错。

而写后日志这种方式，就是先让系统执行命令，只有命令能执行成功，才会被记录到日志中，否则，系统就会直接向客户端报错。所以，Redis 使用写后日志这一方式的一大好处是，可以避免出现记录错误命令的情况。

**另外： 不会阻塞当前的写操作。**

#### AOF风险

1. 如果刚执行完一个命令，还没有来得及记日志就宕机了，那么这个命令和相应的数据就有丢失的风险

2. AOF 虽然避免了对当前命令的阻塞，但可能会给下一个操作带来阻塞风险 , 是写磁盘的，并且在主线程中执行的。

   

#### 三种写回策略

1. Always 每次
2. Everysec 每秒
3. No，操作系统控制的写回：每个写命令执行完，只是先把日志写到 AOF 文件的内存缓冲区，由系统控制

![image](https://static.lovedata.net/20-11-19-0d7b5be09bf06e8c001387a42f9b2c61.png)

#### 策略

想要获得高性能，就选择 No 策略；如果想要得到高可靠性保证，就选择 Always 策略；如果允许数据有一点丢失，又希望性能别受太大影响的话，那么就选择 Everysec 策略。



#### AOF文件过大（重写机制）

重写机制具有“多变一”功能。所谓的“多变一”，也就是说，旧日志文件中的多条命令，在重写后的新日志中变成了一条命令。

在重写的时候，是根据这个键值对当前的最新状态，为它生成对应的写入命令

![image](https://static.lovedata.net/20-11-19-bee5b81467ba3c8481193e1fd306ae6b.png)



#### AOF重写原理（是否阻塞）

和 AOF 日志由主线程写回不同，重写过程是由后台子进程 bgrewriteaof 来完成的，这也是为了避免阻塞主线程，导致数据库性能下降。

**一个拷贝，两处日志**

一个拷贝： 内存拷贝，子进程是会拷贝父进程的页表，即虚实映射关系，而不会拷贝物理内存。子进程复制了父进程页表，也能共享访问父进程的内存数据

两处日志： 第一处日志就是指正在使用的 AOF 日志  第二处日志，就是指新的 AOF 重写日志。这个操作也会被写到重写日志的缓冲区

![image](https://static.lovedata.net/20-11-19-c4705fc0dc8279e163e08975d3020436.png)



每次 AOF 重写时，Redis 会先执行一个内存拷贝，用于重写；然后，使用两个日志保证在重写过程中，新写入的数据不会丢失。而且，因为 Redis 采用额外的线程进行数据重写，所以，这个过程并不会阻塞主线程



#### 课后问题

1. AOF 日志重写的时候，是由 bgrewriteaof 子进程来完成的，不用主线程参与，我们今天说的非阻塞也是指子进程的执行不阻塞主线程。但是，你觉得，这个重写过程有没有其他潜在的阻塞风险呢？如果有的话，会在哪里阻塞？
2. AOF 重写也有一个重写日志，为什么它不共享使用 AOF 本身的日志呢？



问题1，Redis采用fork子进程重写AOF文件时，潜在的阻塞风险包括：fork子进程 和 AOF重写过程中父进程产生写入的场景，下面依次介绍。

a、fork子进程，fork这个瞬间一定是会阻塞主线程的（注意，fork时并不会一次性拷贝所有内存数据给子进程，老师文章写的是拷贝所有内存数据给子进程，我个人认为是有歧义的），fork采用操作系统提供的写实复制(Copy On Write)机制，就是为了避免一次性拷贝大量内存数据给子进程造成的长时间阻塞问题，但fork子进程需要拷贝进程必要的数据结构，其中有一项就是拷贝内存页表（虚拟内存和物理内存的映射索引表），这个拷贝过程会消耗大量CPU资源，拷贝完成之前整个进程是会阻塞的，阻塞时间取决于整个实例的内存大小，实例越大，内存页表越大，fork阻塞时间越久。拷贝内存页表完成后，子进程与父进程指向相同的内存地址空间，也就是说此时虽然产生了子进程，但是并没有申请与父进程相同的内存大小。那什么时候父子进程才会真正内存分离呢？“写实复制”顾名思义，就是在写发生时，才真正拷贝内存真正的数据，这个过程中，父进程也可能会产生阻塞的风险，就是下面介绍的场景。

b、fork出的子进程指向与父进程相同的内存地址空间，此时子进程就可以执行AOF重写，把内存中的所有数据写入到AOF文件中。但是此时父进程依旧是会有流量写入的，如果父进程操作的是一个已经存在的key，那么这个时候父进程就会真正拷贝这个key对应的内存数据，申请新的内存空间，这样逐渐地，父子进程内存数据开始分离，父子进程逐渐拥有各自独立的内存空间。因为内存分配是以页为单位进行分配的，默认4k，如果父进程此时操作的是一个bigkey，重新申请大块内存耗时会变长，可能会产阻塞风险。另外，如果操作系统开启了内存大页机制(Huge Page，页面大小2M)，那么父进程申请内存时阻塞的概率将会大大提高，所以在Redis机器上需要关闭Huge Page机制。Redis每次fork生成RDB或AOF重写完成后，都可以在Redis log中看到父进程重新申请了多大的内存空间。

问题2，AOF重写不复用AOF本身的日志，一个原因是父子进程写同一个文件必然会产生竞争问题，控制竞争就意味着会影响父进程的性能。二是如果AOF重写过程中失败了，那么原本的AOF文件相当于被污染了，无法做恢复使用。所以Redis AOF重写一个新文件，重写失败的话，直接删除这个文件就好了，不会对原先的AOF文件产生影响。等重写完成之后，直接替换旧文件即可。

作者回复: 

这里要谢谢Kaito同学指出的文章中的歧义：fork子进程时，子进程是会拷贝父进程的页表，即虚实映射关系，而不会拷贝物理内存。子进程复制了父进程页表，也能共享访问父进程的内存数据了，此时，类似于有了父进程的所有内存数据。我的描述不太严谨了，非常感谢指出！

Kaito同学还提到了Huge page。这个特性大家在使用Redis也要注意。Huge page对提升TLB命中率比较友好，因为在相同的内存容量下，使用huge page可以减少页表项，TLB就可以缓存更多的页表项，能减少TLB miss的开销。

但是，这个机制对于Redis这种喜欢用fork的系统来说，的确不太友好，尤其是在Redis的写入请求比较多的情况下。因为fork后，父进程修改数据采用写时复制，复制的粒度为一个内存页。如果只是修改一个256B的数据，父进程需要读原来的内存页，然后再映射到新的物理地址写入。一读一写会造成读写放大。如果内存页越大（例如2MB的大页），那么读写放大也就越严重，对Redis性能造成影响。

Huge page在实际使用Redis时是建议关掉的。



## 05 | 内存快照：宕机后，Redis如何实现快速恢复？

内存快照。所谓内存快照，就是指内存中的数据在某一个时刻的状态记录

和 AOF 相比，RDB 记录的是某一时刻的数据

### 给哪些内存数据做快照？

为了提供所有数据的可靠性保证，它执行的是全量快照，

Redis 提供了两个命令来生成 RDB 文件，分别是 save 和 bgsave。

1. save：在主线程中执行，会导致阻塞；
2. bgsave：创建一个子进程，专门用于写入 RDB 文件，避免了主线程的阻塞，这也是 Redis RDB 文件生成的默认配置。

### 快照时数据能修改吗?

为了快照而暂停写操作，肯定是不能接受的。所以这个时候，Redis 就会借助操作系统提供的写时**复制技术（Copy-On-Write, COW）**，在执行快照的同时，正常处理写操作。

#### 写时复制

- **bgsave** 子进程是由主线程 fork 生成的，可以**共享**主线程的所有**内存数据**。
- bgsave 子进程运行后，开始读取主线程的内存数据，并把它们写入 RDB 文件。
- 此时，如果主线程对这些数据也都是读操作（例如图中的键值对 A），那么，主线程和 bgsave 子进程相互不影响。
- 但是，如果主线程要修改一块数据（例如图中的键值对 C），那么，这块数据就会被复制一份，生成该数据的副本。
- 然后，bgsave 子进程会把这个副本数据写入 RDB 文件，而在这个过程中，主线程仍然可以直接修改原来的数据。

![image](https://static.lovedata.net/20-11-19-1d327a64dfc148660f05e62d8e2053c7.png)



### 如果频繁地执行全量快照，也会带来两方面的开销。

![image](https://static.lovedata.net/20-11-19-fab3042bbe2138eadffbde3ee3fe17fe.png)



1. 磁盘
2. bgsave 子进程需要通过 fork 操作从主线程创建出来。虽然，子进程在创建后不会再阻塞主线程，但是，fork 这个创建过程本身会阻塞主线程，而且主线程的内存越大，阻塞时间越长。



### 增量快照

第一次做全量，后面做增量，只快照修改的数据，但是我门要记住，哪些数据修改了， 简单的 “记住” 不简单，  使用额外的元数据信息去记录 ，额外的开销

![img](https://static001.geekbang.org/resource/image/8a/a5/8a1d515269cd23595ee1813e8dff28a5.jpg)



#### 如何两全？

Redis 4.0 中提出了一个混合使用 AOF 日志和内存快照。 内存快照以一定的频率执行，在两次快照之间，使用 AOF 日志记录这期间的所有命令操作

![image](https://static.lovedata.net/20-11-19-1867649150fc0e5efde686764a4ec763.png)





## 06 | 数据同步：主从库如何实现数据一致？

#### Redis 具有高可靠性



一是数据尽量少丢失， AOF RDB 

二是服务尽量少中断. 增加副本冗余量 将一份数据同时保存在多个实例上。



### 主从库之间采用的是读写分离

**读操作**：主库、从库都可以接收；

写操作：首先到主库执行，然后，主库将写操作同步给从库。

![image](https://static.lovedata.net/20-11-19-4b7c7073861b4cc6632f87bf2118afeb.png)



### 主从库间如何进行第一次同步？

通过 **replicaof**（Redis 5.0 之前使用 **slaveof**）命令形成主库和从库的关系

```shell
# 在slave上执行
replicaof  172.16.19.3  6379
```

三个阶段

![image](https://static.lovedata.net/20-11-19-c97ca4a77b43503ccaeffe5704bb66e3.png)



#### 阶段1:主从库间建立连接、协商同步

#### 阶段2:主库将所有数据同步给从库。从库收到数据后，在本地完成数据加载(从库会清空旧数据),主库新数据放入 replication buffer

#### 阶段3:主库会把第二阶段执行过程中新收到的写命令，( replication buffer)



### 主从级联模式分担全量复制时的主库压力主从级联模式分担全量复制时的主库压力

主从模式，主节点需要fork子进程，如果有很多从节点的话，频繁fork，可能影响主节点性能，所以 有了 主 - 从 - 从 模式

通过“主 - 从 - 从”模式将主库生成 RDB 和传输 RDB 的压力，以级联的方式分散到从库上。

![image](https://static.lovedata.net/20-11-19-bb45a7320ec64a9223cb5311b27900cb.png)



### 主从库间网络断了怎么办？

一旦主从库完成了全量复制，它们之间就会一直维护一个**网络连接**，主库会通过这个连接将后续陆续收到的命令操作再同步给从库，这个过程也称为基于**长连接**的命令传播，可以避免频繁建立连接的开销。



Redis 2.8 之前 ，网络断了，需要重新全量复制

Redis 2.8 开始，网络断了之后，主从库会采用**增量复制**的方式继续同步 增量复制只会同步主从库网络断连期间主库收到的命令

关键点在于。repl_backlog_buffer 

主库会把断连期间收到的写操作命令，写入 replication buffer，同时也会把这些操作命令也写入 repl_backlog_buffer 这个缓冲区

主库会记录自己写到的位置，从库则会记录自己已经读到的位置。

主库只用把 master_repl_offset 和 slave_repl_offset 之间的命令操作同步给从库就行。

![image](https://static.lovedata.net/20-11-19-337f61b7e7e1d1bfec3da0316bcc95b1.png)



#### 增量复制过程

![image](https://static.lovedata.net/20-11-19-7d0a690ed4eb263b0375c30e2a48720f.png)



## 07 | 哨兵机制：主库挂了，如何不间断服务？

![image](https://static.lovedata.net/20-11-23-d632479f3db54a4404eb5eea23ca9ecf.png)



在 Redis 主从集群中，哨兵机制是实现主从库自动切换的关键机制，它有效地解决了主从复制模式下故障转移的这三个问题

1.  主库真的挂了吗？
2. 该选择哪个从库作为主库？
3. 怎么把新主库的相关信息通知给从库和客户端呢？

### 哨兵机制的基本流程

![image](https://static.lovedata.net/20-11-23-3ffcbbcde44a1b8d0de1c10ab83acc02.png)

哨兵其实就是一个运行在特殊模式下的 Redis 进程，主从库实例运行的同时，它也在运行。

哨兵主要负责的就是三个任务：监控、选主（选择主库）和通知。

#### 监控

哨兵向所有主从库发送 PING 命令，如果从库没有响应，就会将其设置为下线状态，如果主库没有响应，则会开启 主库切换的过程

#### 选主

根据相应规则，选择主库，并且上线

#### 通知

通知从库，新主，执行replicaof，通知客户端，连接新的主



### 主观下线和客观下线

哨兵进程会使用 PING 命令检测它自己和主、从库的网络连接情况，用来判断实例的状态，如果超时，则为“主观下线”

从库下线还好，主库下线，开销很大，选主，切换，可能存在误判

那么如何避免误判了，需要商量，生活中避免误判，就需要商量。

**它通常会采用多实例组成的集群模式进行部署，这也被称为哨兵集群**  降低误判率，集体决策，避免网络不稳定因素引起的误判。多个哨兵发现主库已经下线了，才算下面了，少数服从多数， 触发 从 **主观下线** 到 **客观下线**

![img](https://static001.geekbang.org/resource/image/19/0d/1945703abf16ee14e2f7559873e4e60d.jpg)





### 如何选主库

> 在多个从库中，先按照一定的筛选条件，把不符合条件的从库去掉。然后，我们再按照一定的规则，给剩下的从库逐个打分，将得分最高的从库选为新主库

![image](https://static.lovedata.net/20-11-23-1c63d979799440e08652c19eb65feb99.png)



#### 筛选

除了要检查从库的当前在线状态，还要判断它之前的网络连接状态，如果总是掉线，那么网络肯定不太好，需要剔除

#### 打分

第一轮：优先级最高的从库得分高。

第二轮：和旧主库同步程度最接近的从库得分高。 想要找的从库，它的 **slave_repl_offset** 需要最接近 master_repl_offset。如果在所有从库中，有从库的 slave_repl_offset 最接近 **master_repl_offset**，那么它的得分就最高，可以作为新主库。

第三轮：ID 号小的从库得分高。	



## 08 | 哨兵集群：哨兵挂了，主从库还能切换吗？

一旦多个实例组成了哨兵集群，即使有哨兵实例出现故障挂掉了，其他哨兵还能继续协作完成主从库切换的工作，包括判定主库是不是处于下线状态，选择新主库，以及通知从库和客户端。



如何组成集群

### 基于 pub/sub 机制的哨兵集群组成

哨兵实例之间可以相互发现，要归功于 Redis 提供的 pub/sub 机制，也就是发布 / 订阅机制。

只有订阅了同一个频道的应用，才能通过发布的消息进行信息交换。

主从集群中，主库上有一个名为“__sentinel__:hello”的频道，不同哨兵就是通过它来相互发现，实现互相通信的。

![image](https://static.lovedata.net/20-11-26-fc959fbc57c52bfce4623a44ef8e23fe.png)



### 哨兵是如何知道从库的 IP 地址和端口的呢

哨兵向主库发送 INFO 命令来完成的  哨兵向主库发送 INFO 命令来完成的

![image](https://static.lovedata.net/20-11-26-7a0074b5c15269014ebb6329f343631c.png)



### 基于 pub/sub 机制的客户端事件通知

哨兵就是一个运行在特定模式下的 Redis 实例，只不过它并不服务请求操作，只是完成监控、选主和通知的任务

![image](https://static.lovedata.net/20-11-26-8594eef3af5912d73bfd10669e0f9180.png)

### 由哪个哨兵执行主从切换？

和主库“客观下线”的判断过程类似，也是一个“投票仲裁”的过程

任何一个实例只要自身判断主库“主观下线”后，就会给其他实例发送 is-master-down-by-addr 命令，其他实例根据和主库连接情况进行投票

![image](https://static.lovedata.net/20-11-26-09cb2ec64f0de67f9c27c3aaca2a18eb.png)



此时，这个哨兵就可以再给其他哨兵发送命令，表明希望由自己来执行主从切换，并让所有其他哨兵进行投票 ，这个称为leader选举

任何一个想成为 Leader 的哨兵，要满足两个条件：第一，拿到半数以上的赞成票；第二，拿到的票数同时还需要大于等于哨兵配置文件中的 quorum 值

![img](https://static001.geekbang.org/resource/image/5f/d9/5f6ceeb9337e158cc759e23c0f375fd9.jpg)



## 09 | 切片集群：数据增多了，是该加内存还是加实例？

Redis frok，在大数据量下面，性能非常差

切片集群，也叫分片集群，就是指启动多个 Redis 实例组成一个集群，然后按照一定的规则，把收到的数据划分成多份，每一份用一个实例来保存

![image](https://static.lovedata.net/20-12-04-4b8b057c91baee77238d23da123260c7.png)

### 如何保存更多数据？

1. 纵向扩展	
   1. 实施起来简单、直接
   2. 问题
      1. 当使用 RDB 对数据进行持久化时 fork 会非常影响性能
      2. 纵向扩展会受到硬件和成本的限制。
2. 横向扩展
   1. 在面向百万、千万级别的用户规模时，横向扩展的 Redis 切片集群会是一个非常好的选择。

![image](https://static.lovedata.net/20-12-04-997de7e37807a31ea9616fa2be7f0b87.png)





### 数据切片和实例的对应分布关系

Redis Cluster 方案采用哈希槽（Hash Slot，接下来我会直接称之为 Slot），来处理数据和实例之间的映射关系。在 Redis Cluster 方案中，一个切片集群共有 16384 个哈希槽，这些哈希槽类似于数据分区，每个键值对都会根据它的 key，被映射到一个哈希槽中。



#### key值映射步骤

首先根据键值对的 key，按照CRC16 算法计算一个 16 bit 的值；然后，再用这个 16bit 值对 16384 取模，得到 0~16383 范围内的模数，每个模数代表一个相应编号的哈希槽。

使用 cluster create 命令创建集群，此时，Redis 会自动把这些槽平均分布在集群实例上。例如，如果集群中有 N 个实例，那么，每个实例上的槽个数为 16384/N 个。

![image](https://static.lovedata.net/20-12-04-bb23c2ac08b4303466f3a128556d5e8b.png)



### 客户端如何定位数据？



Redis 实例会把自己的哈希槽信息发给和它相连接的其它实例，来完成哈希槽分配信息的扩散。当实例之间相互连接后，每个实例就有所有哈希槽的映射关系了。

客户端收到哈希槽信息后，会把哈希槽信息缓存在本地。当客户端请求键值对时，会先计算键所对应的哈希槽，然后就可以给相应的实例发送请求了。

#### 客户端的位置信息并不是最新的，可能存在错误访问

Redis Cluster 方案提供了一种重定向机制，所谓的“重定向”，就是指，客户端给一个实例发送数据读写操作时，这个实例上并没有相应的数据，客户端要再给一个新实例发送操作命令。 

Moved 命令来重定向

![image](https://static.lovedata.net/20-12-04-dc1d76c1a20dd7ae12ad8e65120a5ddc.png)



#### 当正在迁移，还有一部分没有迁移完的时候

会返回Ask命令，然后客户端发送Asking命令询问，不会缓存hash槽信息到本地

![image](https://static.lovedata.net/20-12-04-af90c3d7720c943e39ae4e5a3e6e576e.png)













