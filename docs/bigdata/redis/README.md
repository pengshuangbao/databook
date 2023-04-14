# Redis

[toc]

## Redis延时任务

[基于REDIS实现延时任务](https://juejin.cn/post/6844903817713025032)

## Redis的主键争用问题如何解决?

使用watch 他会监测键，确保被修改后，后面的修改会失败SETNX 如果key不存在等同于set返回0，存在返回1

[Redis的乐观同步方法 Redis的并发写入同步](https://blog.csdn.net/youxijishu/article/details/41956983)

## Redis的事物原理?

1. 满足一致性和隔离性，不满足原子性和持久性（依赖具体持久模型）

2. watch unwatch 和 muti exec  
   当两者一起使用的时候，首先key被watch监视，若在调用 EXEC 命令执行事务时， 如果任意一个被监视的键被其他客户端修改了， 那么整个事务不再执行， 直接返回失败（之后可以选择重试事物或者放弃）
   因为exec之前不会有任何实际操作（通过queue队列），就是没有办法根据读取到的数据来做决定（可能读到的已经是脏数据）

3. watch的目的
   目的：使用select for update 普通加锁，第一个执行的执行完成之前，其余的事物都必须阻塞，造成时间上的等待，所以watch并不会对数据进行加锁，redis只会在数据改变的情况下，通知执行了watch的客户端，叫做乐观锁optimistic locking 。  
   Redis的事务没有关系数据库事务提供的回滚（rollback）功能,需要自行回滚，但是一般不会有这种强一致的需求。否则是需求不合理

4. 报错了怎么处理？

   * **语法错误**：只要有一个命令有语法错误，执行EXEC命令后Redis就会直接返回错误，连语法正确的命令也不会执行。
     ![image](https://static.lovedata.net/jpg/2018/5/18/e58f5d71439a34699548842b85c9d413.jpg)

   * **运行时错误**： 运行错误指在命令执行时出现的错误，比如使用散列类型的命令操作集合类型的键，这种错误在实际执行之前Redis是无法发现的，所以在事务里这样的命令是会被Redis接受并执行的。如果事务里的一条命令出现了运行错误，事务里其他的命令依然会继续执行（包括出错命令之后的命令）
     ![image](https://static.lovedata.net/jpg/2018/5/18/6971ad099e1afbb9f65823c9749bc90b.jpg)

> 参考
>
> [Redis的并发控制](https://juejin.im/entry/5964bcd851882568b20dbd73)
>
> [redis的事务和watch](https://www.jianshu.com/p/361cb9cd13d5)

## Redis事务的CAS操作

CAS，Check and Set 。乐观锁实现使用Redis 自有的watch multi exec等命令进行封装。

[Redis CAS乐观锁实现](https://www.jianshu.com/p/08a1a9f2f4dd)

## Redis持久化的几种方式

  ![image](https://static.lovedata.net/jpg/2018/5/18/08b055b90a3f67829d73a2453a109c9d.jpg)

1. RDB持久化
   1. 原理是将Reids在内存中的数据库记录定时dump到磁盘上的RDB持久化
   2. RDB持久化是指在指定的时间间隔内将内存中的数据集快照写入磁盘，实际操作过程是fork一个子进程，先将数据集写入临时文件，写入成功后，再替换之前的文件，用二进制压缩存储。
   3. 优点：文件备份、传入到其他介质中、性能最大化、
   4. 缺点：不能保证非常高的可用性、数据集较大的时候可能导致服务器停止一段时间

2. AOF (append only file)
   1. 原理是将Reids的操作日志以追加的方式写入文件
   2. AOF持久化以日志的形式记录服务器所处理的每一个写、删除操作，查询操作不会记录，以文本的方式记录，可以打开文件看到详细的操作记录。
   3. 优点：更高的数据安全性、每秒同步（异步的）也有数据丢失风险，每修改同步（每次修改都同步到，效率较低）、格式清晰，便于恢复
   4. 缺点： 速度较慢、文件比RDB大

3. 选择标准
   二者选择的标准，就是看系统是愿意牺牲一些性能，换取更高的缓存一致性（aof），还是愿意写操作频繁的时候，不启用备份来换取更高的性能，待手动运行save的时候，再做备份（rdb）。rdb这个就更有些 eventually consistent的意思了。

4. 常用配置
   ![image](https://static.lovedata.net/jpg/2018/5/18/2bbde3193b3d168fa6e982c2416b2df7.jpg)
5. [redis持久化的几种方式](https://www.cnblogs.com/chenliangcl/p/7240350.html)

## Redis的缓存失效策略

1. 通过DEL显示删除无用数据
2. 通过过期时间（expiration）特性在给定的时限之后自动删除（自动删除）
3. set hash 容器只能为整个键设置过期时间，而没法为单个元素设置
4. ![image](https://static.lovedata.net/jpg/2018/5/20/0a668477aa07b7618904e1b4583ee8cf.jpg)
5. 如果同时很多缓存失效，则会有缓存穿透问题
6. [Redis的缓存策略和主键失效机制](http://www.cnblogs.com/binyue/p/3726842.html)
7. 失效的内部实现 Redis 删除失效主键的方法主要有两种：
   1. 消极方法（passive you
   2. 积极方法（active way），周期性地从设置了失效时间的主键中选择一部分失效的主键删除

## Redis所需内存 超过可用内存怎么办

超过maxmemory这个时候就该配置文件中的maxmemory-policy出场了。
其默认值是noeviction。
下面我将列出当可用内存不足时，删除redis键具有的淘汰规则。

![image](https://static.lovedata.net/jpg/2018/6/22/ef00eec0c7f656b24f0e120aa54a6e78.jpg)

[Redis所需内存 超过可用内存怎么办 - 坦荡 - 博客园](https://www.cnblogs.com/tdws/p/5727633.html)

## Redis 中 String 类型可以容纳的最大数据长度

项目中使用redis存储，key-value方式，在Redis中字符串类型的Value最多可以容纳的数据长度是512M
官方信息:
A String value can be at max 512 Megabytes in length.

![image](https://static.lovedata.net/jpg/2018/7/12/94588e9b96f8967a7b201047166c54af.jpg)

[Redis 中 String 类型可以容纳的最大数据长度 - CSDN博客](