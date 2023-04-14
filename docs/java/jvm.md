# JVM

[toc]



## Class

| 代码               | 分类     | 作用                                                         |
| ------------------ | -------- | ------------------------------------------------------------ |
| [Ljava/lang/String | 类描述   | 字符串数组                                                   |
| iconst_n           | 整型指令 | 将数字压入到操作数栈                                         |
| istore_n           | 整型指令 | 将数字从操作数栈存储到局部变量表 <br />后面的n代表到第几个位置 |
| iload_n            | 整型指令 | 家在局部变量第n哥变量压入到操作数栈                          |
| iadd               | 整型指令 | 操作数栈中的前两个变量相加，并将结果压入操作数栈顶           |
| ireturn            | 指令     | 返回                                                         |
| IF_ICMPEQ          | 对比指令 | 如果两者相等                                                 |
| IAND               | 整型指令 | 按位与 &                                                     |



### 代码

#### 位运算

```java
A = 0101
B = 1100
-----------------
A&B = 0100 
A | B = 1101
A ^ B = 1001
~A= 1010
```



## JVM基础

## CMS

### CMS并发清理阶段为什么是安全的

[CMS并发清理阶段为什么是安全的__再见阿郎_的专栏-CSDN博客](https://blog.csdn.net/FU250/article/details/105386291)

###  老生代GC策略 – Concurrent Mark-Sweep

每次执行Minor GC之后，都会有部分生命周期较长的对象被移入老生代，一段时间之后，老生代空间也会被占满。此时就需要针对老生代空间执行GC操作，此处我们介绍Concurrent Mark-Sweep（CMS）算法。CMS算法整个流程分为6个阶段，其中部分阶段会执行 ‘stop-the-world’ 暂停，部分阶段会和应用线程一起并发执行：

1. initial-mark：这个阶段虚拟机会暂停所有正在执行的任务。这一过程虚拟机会标记所有 ‘根对象’，所谓‘根对象’，一般是指一个运行线程直接引用到的对象。虽然会暂停整个JVM，但因为’根对象’相对较少，这个过程通常很快。
2. concurrent mark：垃圾回收器会从‘根节点’开始，将所有引用到的对象都打上标记。这个阶段应用程序的线程和标记线程并发执行，因此用户并不会感到停顿。
3. concurrent precleaning：并发预清理阶段仍然是并发的。在这个阶段，虚拟机查找在执行mark阶段新进入老年代的对象\(可能会有一些对象从新生代晋升到老年代， 或者有一些对象被分配到老年代\)。
4. remark：在阶段3的基础上对查找到的对象进行重新标记，这一阶段会暂停整个JVM，但是因为阶段3已经欲检查出了所有新进入的对象，因此这个过程也会很快。
5. concurrent sweep：上述3阶段完成了引用对象的标记，此阶段会将所有没有标记的对象作为垃圾回收掉。这个阶段应用程序的线程和标记线程并发执行。
6. concurrent reset：重置CMS收集器的数据结构，等待下一次垃圾回收。

相应的，对于CMS算法，也需要关注两点：

1. ‘stop－the－world’暂停时间也很短暂，耗时较长的标记和清理都是并发执行的。
2. CMS算法在标记清理之后并没有重新压缩分配存活对象，因此整个老生代会产生很多的<mark>**内存碎片**</mark>。 

###  CMS Failure Mode 导致GC卡顿,时间长的原因

1. Concurrent Failure  这种场景其实比较简单，假如现在系统正在执行CMS回收老生代空间，在回收的过程中新生代来了一批对象进来，不巧的是，老生代已经没有空间再容纳这些对象了。这种场景下，CMS回收器会停止继续工作，系统进入 ’stop-the-world’ 模式，并且回收算法会退化为单线程复制算法，重新分配整个堆内存的存活对象到S0中，释放所有其他空间 
   1.  **解决方法** ： 很容易解决，只需要让CMS回收器更早一点回收就可以避免。JVM提供了参数-XX:CMSInitiatingOccupancyFraction=N来设置CMS回收的时机，其中N表示当前老生代已使用内存占新生代总内存的比例，该值默认为68，可以将该值修改的更小使得回收更早进行。
2. Promotion Failure  假设此时设置XX:CMSInitiatingOccupancyFraction＝60，但是在已使用内存还没有达到总内存60%的时候，已经没有空间容纳从新生代迁移的对象了。oh，my god！怎么会这样？罪魁祸首就是内存碎片，上文中提到CMS算法会产生大量碎片，当碎片容量积累到一定大小之后就会造成上面的场景。这种场景下，CMS回收器一样会停止工作，进入漫长的 ’stop-the-world’ 模式。JVM也提供了参数   -XX: **UseCMSCompactAtFullCollection**  **来减少碎片的产生** ，这个参数表示会在每次CMS回收垃圾之后执行一次碎片整理，很显然，这个参数会对性能有比较大的影响，对HBase这种对延迟敏感的业务来说并不是一个完美解决方案。

## G1

[深入理解 Java G1 垃圾收集器 | 水晶命匣](http://ghoulich.xninja.org/2018/01/27/understanding-g1-garbage-collector-in-java/)



## ASM

[Java ASM系列：（024）修改已有的方法（添加－进入和退出）](https://blog.51cto.com/lsieun/2955681)

[史上最通俗易懂的ASM教程 - 知乎](https://zhuanlan.zhihu.com/p/94498015)

[StringFog插件对Dex字符串加密原理解析_MegatronKing的博客-CSDN博客](https://blog.csdn.net/MegatronKings/article/details/63252266)

[深入探索编译插桩技术（四、ASM 探秘） - 掘金](https://juejin.cn/post/6844904118700474375)

[Java ASM系列：（017）frame介绍_修俟微渐的技术博客_51CTO博客](https://blog.51cto.com/lsieun/2949733)

[Java ASM系列：（076）if和switch示例_修俟微渐的技术博客_51CTO博客](https://blog.51cto.com/lsieun/4231719)













