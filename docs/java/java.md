# 面试题

[toc]

## 内存溢出了怎么去定位?

[Java内存溢出定位和解决方案（new）](https://www.cnblogs.com/snowwhite/p/9471710.html "  ")

[Java 出现内存溢出的定位以及解决方案](https://www.cnblogs.com/zhchoutai/p/7270886.html "")

https://www.cnblogs.com/LUO77/p/5816326.html)



## HashMap

### HashMap 的数据结构?

A：哈希表结构（链表散列：数组+链表）实现，结合数组和链表的优点。当链表长度超过 8 时，链表转换为红黑树。

transient Node<K,V>\[\] table;

### HashMap 的工作原理?

HashMap 底层是 hash 数组和单向链表实现，数组中的每个元素都是链表，由 Node 内部类（实现 Map.Entry接口）实现，HashMap 通过 put & get 方法存储和获取。

存储对象时，将 K/V 键值传给 put() 方法：

①、调用 hash(K) 方法计算 K 的 hash 值，然后结合数组长度，计算得数组下标；

②、调整数组大小（当容器中的元素个数大于 capacity * loadfactor 时，容器会进行扩容resize 为 2n）；

③、i.如果 K 的 hash 值在 HashMap 中不存在，则执行插入，若存在，则发生碰撞；

ii.如果 K 的 hash 值在 HashMap 中存在，且它们两者 equals 返回 true，则更新键值对；

iii. 如果 K 的 hash 值在 HashMap 中存在，且它们两者 equals 返回 false，则插入链表的尾部（尾插法）或者红黑树中（树的添加方式）。

（JDK 1.7 之前使用头插法、JDK 1.8 使用尾插法）（注意：当碰撞导致链表大于 TREEIFY_THRESHOLD = 8 时，就把链表转换成红黑树）

获取对象时，将 K 传给 get() 方法：①、调用 hash(K) 方法（计算 K 的 hash 值）从而获取该键值所在链表的数组下标；②、顺序遍历链表，equals()方法查找相同 Node 链表中 K 值对应的 V 值。

hashCode 是定位的，存储位置；equals是定性的，比较两者是否相等。

### 当两个对象的 hashCode 相同会发生什么?

[因为 hashCode 相同，不一定就是相等的（equals方法比较），所以两个对象所在数组的下标相同，"碰撞"就此发生。又因为 HashMap 使用链表存储对象，这个 Node 会存储到链表中。为什么要重写 hashcode 和 equals 方法？推荐看下。](http://mp.weixin.qq.com/s?__biz=MzI2MTIzMzY3Mw==&mid=2247489051&idx=4&sn=651c4a067c2f1d59151f484475144c20&chksm=ea5cdb7ddd2b526bcb46214f83f80859c8603497323a3cf933e511b6f018af666dd74b0e584d&scene=21#wechat_redirect)

### 你知道 hash 的实现吗?为什么要这样实现?

JDK 1.8 中，是通过 hashCode() 的高 16 位异或低 16 位实现的：(h = k.hashCode()) ^ (h >>> 16)，主要是从速度，功效和质量来考虑的，减少系统的开销，也不会造成因为高位没有参与下标的计算，从而引起的碰撞。

### 为什么要用异或运算符?

保证了对象的 hashCode 的 32 位值只要有一位发生改变，整个 hash() 返回值就会改变。尽可能的减少碰撞。

### HashMap 的 table 的容量如何确定?loadFactor 是什么?该容量如何变化?这种变化会带来什么问题?

[①、table 数组大小是由 capacity 这个参数确定的，默认是16，也可以构造时传入，最大限制是1<<30；](http://mp.weixin.qq.com/s?__biz=MzI2MTIzMzY3Mw==&mid=2247489478&idx=4&sn=ad7321cd1948f0c8eaf955aaaa7a2046&chksm=ea5cdaa0dd2b53b67ac2b9ba12935e13cb59250180fa302bd61629968e24f8853f208790fe80&scene=21#wechat_redirect)

[②、loadFactor 是装载因子，主要目的是用来确认table 数组是否需要动态扩展，默认值是0.75，比如table 数组大小为 16，装载因子为 0.75 时，threshold 就是12，当 table 的实际大小超过 12 时，table就需要动态扩容；](http://mp.weixin.qq.com/s?__biz=MzI2MTIzMzY3Mw==&mid=2247489478&idx=4&sn=ad7321cd1948f0c8eaf955aaaa7a2046&chksm=ea5cdaa0dd2b53b67ac2b9ba12935e13cb59250180fa302bd61629968e24f8853f208790fe80&scene=21#wechat_redirect)

[③、扩容时，调用 resize() 方法，将 table 长度变为原来的两倍（注意是 table 长度，而不是 threshold）](http://mp.weixin.qq.com/s?__biz=MzI2MTIzMzY3Mw==&mid=2247489478&idx=4&sn=ad7321cd1948f0c8eaf955aaaa7a2046&chksm=ea5cdaa0dd2b53b67ac2b9ba12935e13cb59250180fa302bd61629968e24f8853f208790fe80&scene=21#wechat_redirect)

④、如果数据很大的情况下，扩展时将会带来性能的损失，在性能要求很高的地方，这种损失很可能很致命。

### HashMap中put方法的过程?

答：“调用哈希函数获取Key对应的hash值，再计算其数组下标；

如果没有出现哈希冲突，则直接放入数组；如果出现哈希冲突，则以链表的方式放在链表后面；

如果链表长度超过阀值( TREEIFY THRESHOLD==8)，就把链表转成红黑树，链表长度低于6，就把红黑树转回链表;

如果结点的key已经存在，则替换其value即可；

如果集合中的键值对大于12，调用resize方法进行数组扩容。”

### 数组扩容的过程?

创建一个新的数组，其容量为旧数组的两倍，并重新计算旧数组中结点的存储位置。结点在新数组中的位置只有两种，原下标位置或原下标+旧数组的大小。

### 拉链法导致的链表过深问题为什么不用二叉查找树代替,而选择红黑树?为什么不一直使用红黑树?

[之所以选择红黑树是为了解决二叉查找树的缺陷，二叉查找树在特殊情况下会变成一条线性结构（这就跟原来使用链表结构一样了，造成很深的问题），遍历查找会非常慢。推荐：面试问红黑树，我脸都绿了。](http://mp.weixin.qq.com/s?__biz=MzI2MTIzMzY3Mw==&mid=2247489139&idx=2&sn=9670f4aa9a1b240352b5387f776fb284&chksm=ea5cdb15dd2b5203cd904cdadf8e1061b6e1e6af6a51c9116eceee4313f889945e529381162d&scene=21#wechat_redirect)

[而红黑树在插入新数据后可能需要通过左旋，右旋、变色这些操作来保持平衡，引入红黑树就是为了查找数据快，解决链表查询深度的问题，我们知道红黑树属于平衡二叉树，但是为了保持“平衡”是需要付出代价的，但是该代价所损耗的资源要比遍历线性链表要少，所以当长度大于8的时候，会使用红黑树，如果链表长度很短的话，根本不需要引入红黑树，引入反而会慢。](http://mp.weixin.qq.com/s?__biz=MzI2MTIzMzY3Mw==&mid=2247489139&idx=2&sn=9670f4aa9a1b240352b5387f776fb284&chksm=ea5cdb15dd2b5203cd904cdadf8e1061b6e1e6af6a51c9116eceee4313f889945e529381162d&scene=21#wechat_redirect)

### 说说你对红黑树的见解?

- 每个节点非红即黑
- 根节点总是黑色的
- 如果节点是红色的，则它的子节点必须是黑色的（反之不一定）
- 每个叶子节点都是黑色的空节点（NIL节点）
- 从根节点到叶节点或空子节点的每条路径，必须包含相同数目的黑色节点（即相同的黑色高度）

#### 

####  

### jdk8中对HashMap做了哪些改变?

在java 1.8中，如果链表的长度超过了8，那么链表将转换为红黑树。（桶的数量必须大于64，小于64的时候只会扩容）

发生hash碰撞时，java 1.7 会在链表的头部插入，而java 1.8会在链表的尾部插入

在java 1.8中，Entry被Node替代(换了一个马甲。

#### 

### HashMap,LinkedHashMap,TreeMap 有什么区别?

HashMap 参考其他问题；

LinkedHashMap 保存了记录的插入顺序，在用 Iterator 遍历时，先取到的记录肯定是先插入的；遍历比 HashMap 慢；

TreeMap 实现 SortMap 接口，能够把它保存的记录根据键排序（默认按键值升序排序，也可以指定排序的比较器）



### HashMap & TreeMap & LinkedHashMap 使用场景?

一般情况下，使用最多的是 HashMap。

HashMap：在 Map 中插入、删除和定位元素时；

TreeMap：在需要按自然顺序或自定义顺序遍历键的情况下；

LinkedHashMap：在需要输出的顺序和输入的顺序相同的情况下。



### HashMap 和 HashTable 有什么区别?

①、HashMap 是线程不安全的，HashTable 是线程安全的；

②、由于线程安全，所以 HashTable 的效率比不上 HashMap；

③、HashMap最多只允许一条记录的键为null，允许多条记录的值为null，而 HashTable不允许；

④、HashMap 默认初始化数组的大小为16，HashTable 为 11，前者扩容时，扩大两倍，后者扩大两倍+1；

⑤、HashMap 需要重新计算 hash 值，而 HashTable 直接使用对象的 hashCode



### Java 中的另一个线程安全的与 HashMap 极其类似的类是什么?同样是线程安全,它与 HashTable 在线程同步上有什么不同?

ConcurrentHashMap 类（是 Java并发包 java.util.concurrent 中提供的一个线程安全且高效的 HashMap 实现）。

HashTable 是使用 synchronize 关键字加锁的原理（就是对对象加锁）；

而针对 ConcurrentHashMap，在 JDK 1.7 中采用 分段锁的方式；JDK 1.8 中直接采用了CAS（无锁算法）+ synchronized。



### HashMap & ConcurrentHashMap 的区别?

除了加锁，原理上无太大区别。另外，HashMap 的键值对允许有null，但是ConCurrentHashMap 都不允许。

### 为什么 ConcurrentHashMap 比 HashTable 效率要高?

HashTable 使用一把锁（锁住整个链表结构）处理并发问题，多个线程竞争一把锁，容易阻塞；

ConcurrentHashMap

- JDK 1.7 中使用分段锁（ReentrantLock + Segment + HashEntry），相当于把一个 HashMap 分成多个段，每段分配一把锁，这样支持多线程访问。锁粒度：基于 Segment，包含多个 HashEntry。

- JDK 1.8 中使用 CAS + synchronized + Node + 红黑树。锁粒度：Node（首结

  点）（实现 Map.Entry）。锁粒度降低了。



### 针对 ConcurrentHashMap 锁机制具体分析（JDK 1.7 VS JDK 1.8）

JDK 1.7 中，采用分段锁的机制，实现并发的更新操作，底层采用数组+链表的存储结构，包括两个核心静态内部类 Segment 和 HashEntry。

①、Segment 继承 ReentrantLock（重入锁） 用来充当锁的角色，每个 Segment 对象守护每个散列映射表的若干个桶；

②、HashEntry 用来封装映射表的键-值对；

③、每个桶是由若干个 HashEntry 对象链接起来的链表

![image](https://static.lovedata.net/20-06-03-c97f24463903a7a7e9e5a46803deef03.png-wm)

JDK 1.8 中，采用Node + CAS + Synchronized来保证并发安全。取消类 Segment，直接用 table 数组存储键值对；当 HashEntry 对象组成的链表长度超过 TREEIFY_THRESHOLD 时，链表转换为红黑树，提升性能。底层变更为数组 + 链表 + 红黑树。

![image](https://static.lovedata.net/20-06-03-6c387f8657b63bc3b88e5f249784cde7.png-wm)

####  

### ConcurrentHashMap 在 JDK 1.8 中,为什么要使用内置锁 synchronized 来代替重入锁 ReentrantLock?

①、粒度降低了；

②、JVM 开发团队没有放弃 synchronized，而且基于 JVM 的 synchronized 优化空间更大，更加自然。

③、在大量的数据操作下，对于 JVM 的内存压力，基于 API 的 ReentrantLock 会开销更多的内存。

 

### ConcurrentHashMap 简单介绍?

①、重要的常量：

private transient volatile int sizeCtl;

当为负数时，-1 表示正在初始化，-N 表示 N - 1 个线程正在进行扩容；

当为 0 时，表示 table 还没有初始化；

当为其他正数时，表示初始化或者下一次进行扩容的大小。

②、数据结构：

Node 是存储结构的基本单元，继承 HashMap 中的 Entry，用于存储数据；

TreeNode 继承 Node，但是数据结构换成了二叉树结构，是红黑树的存储结构，用于红黑树中存储数据；

TreeBin 是封装 TreeNode 的容器，提供转换红黑树的一些条件和锁的控制。

③、存储对象时（put() 方法）：

如果没有初始化，就调用 initTable() 方法来进行初始化；

如果没有 hash 冲突就直接 CAS 无锁插入；

如果需要扩容，就先进行扩容；

如果存在 hash 冲突，就加锁来保证线程安全，两种情况：一种是链表形式就直接遍历

到尾端插入，一种是红黑树就按照红黑树结构插入；

如果该链表的数量大于阀值 8，就要先转换成红黑树的结构，break 再一次进入循环

如果添加成功就调用 addCount() 方法统计 size，并且检查是否需要扩容。

④、扩容方法 transfer()：默认容量为 16，扩容时，容量变为原来的两倍。

helpTransfer()：调用多个工作线程一起帮助进行扩容，这样的效率就会更高。

⑤、获取对象时（get()方法）：

计算 hash 值，定位到该 table 索引位置，如果是首结点符合就返回；

如果遇到扩容时，会调用标记正在扩容结点 ForwardingNode.find()方法，查找该结点，匹配就返回；

以上都不符合的话，就往下遍历结点，匹配就返回，否则最后就返回 null。

### ConcurrentHashMap 的并发度是什么?

程序运行时能够同时更新 ConccurentHashMap 且不产生锁竞争的最大线程数。默认为 16，且可以在构造函数中设置。

当用户设置并发度时，ConcurrentHashMap 会使用大于等于该值的最小2幂指数作为实际并发度（假如用户设置并发度为17，实际并发度则为32）

## Java核心技术

### 第16讲 | synchronized底层如何实现?什么是锁的升级、降级?

### 第17讲｜一个线程两次调用 start() 方法会出现什么情况？谈谈线程的生命周期和状态转移。

Java 的线程是不允许启动两次的，第二次调用必然会抛出 IllegalThreadStateException，这是一种运行时异常，多次调用 start 被认为是编程错误。

线程状态(java.lang.Thread.State):

新建（NEW），表示线程被创建出来还没真正启动的状态，可以认为它是个 Java 内部状态。

- **新建（NEW）**，表示线程被创建出来还没真正启动的状态，可以认为它是个 Java 内部状态。
- **就绪（RUNNABLE）**，表示该线程已经在 JVM 中执行，当然由于执行需要计算资源，它可能是正在运行，也可能还在等待系统分配给它 CPU 片段，在就绪队列里面排队。
- 在其他一些分析中，会额外区分一种状态 RUNNING，但是从 Java API 的角度，并不能表示出来。
- **阻塞（BLOCKED）**，这个状态和我们前面两讲介绍的同步非常相关，阻塞表示线程在等待 Monitor lock。比如，线程试图通过 synchronized 去获取某个锁，但是其他线程已经独占了，那么当前线程就会处于阻塞状态。
- **等待（WAITING）**，表示正在等待其他线程采取某些操作。一个常见的场景是类似生产者消费者模式，发现任务条件尚未满足，就让当前消费者线程等待（wait），另外的生产者线程去准备任务数据，然后通过类似 notify 等动作，通知消费线程可以继续工作了。Thread.join() 也会令线程进入等待状态。
- **计时等待（TIMED_WAIT）**，其进入条件和等待状态类似，但是调用的是存在超时条件的方法，比如 wait 或 join 等方法的指定超时版本，如下面示例：
- **终止（TERMINATED）**，不管是意外退出还是正常执行结束，线程已经完成使命，终止运行，也有人把这个状态叫作死亡。

#### 线程是什么？

1. 操作系统的角度：线程被认为是最小的调度单元，一个进程有多个线程

2. 任务的真正运作者，有自己的栈（Stack）、寄存器（Register）、本地存储（Thread Local）等

3. 和进程内其他线程共享文件描述符、虚拟地址空间

具体实现中，线程还分为<u>**内核线程**</u>、<u>**用户线程**</u>。 

当前JVM ： 现在的模型是**一对一映射**到操作系统**内核线程**。

内部源码都是JNI

```java
private native void start0();
private native void setPriority0(int newPriority);
private native void interrupt0();
```



#### 线程状态转换

![image](https://static.lovedata.net/20-11-10-e4595cfcccbe936fcf0f9030ad397382.png-wm)



#### 为什么需要并发包？

Thread 和 Object 的方法，听起来简单，但是实际应用中被证明**非常晦涩、易错**，这也是为什么 Java 后来又引入了并发包。总的来说，有了并发包，大多数情况下，我们已经不再需要去调用 wait/notify 之类的方法了。



#### 守护线程（Daemon Thread）

有的时候应用中需要一个长期驻留的服务程序，但是不希望其影响应用退出，就可以将其设置为守护线程，如果 JVM 发现只有守护线程存在时，将结束进程，具体可以参考下面代码段。注意，**必须在线程启动之前设置。**

```java
Thread daemonThread = new Thread();
daemonThread.setDaemon(true);
daemonThread.start();
```



#### ThreadLocal(线程本地变量)

Java 提供的一种**保存线程私有信息**的机制，因为其在整个**线程生命周期内有效**，所以可以方便地在一个线程关联的不同业务模块之间**<u>传递信息</u>**，比如事务 ID、Cookie 等上下文相关信息。

废弃项目的回收依赖于显式地触发，否则就要等待线程结束，进而回收相应 ThreadLocalMap！这就是很多 **<u>OOM 的来源</u>**，所以通常都会建议，应用一定要自己负责 remove，并且不要和线程池配合，因为 worker 线程往往是不会退出的。

**线程池一般不建议和thread local配合...**

### 第18讲 | 什么情况下Java程序会产生死锁？如何定位、修复？

死锁是一种特定的程序状态，在实体之间，由于循环依赖导致彼此一直处于等待之中，没有任何个体可以继续前进。死锁不仅仅是在线程之间会发生，存在资源独占的进程之间同样也可能出现死锁。通常来说，我们大多是聚焦在多线程场景中的死锁，指两个或多个线程之间，由于互相持有对方需要的锁，而永久处于阻塞的状态。

![image](https://static.lovedata.net/20-11-10-d59a0eed6e578bf4624dd61bdbfacf13.png-wm)

定位问题四板斧

**free  df.  jstack  jstat**

死锁代码

```java

public class DeadLockSample extends Thread {
  private String first;
  private String second;
  public DeadLockSample(String name, String first, String second) {
      super(name);
      this.first = first;
      this.second = second;
  }

  public  void run() {
      synchronized (first) {
          System.out.println(this.getName() + " obtained: " + first);
          try {
              Thread.sleep(1000L);
              synchronized (second) {
                  System.out.println(this.getName() + " obtained: " + second);
              }
          } catch (InterruptedException e) {
              // Do nothing
          }
      }
  }
  public static void main(String[] args) throws InterruptedException {
      String lockA = "lockA";
      String lockB = "lockB";
      DeadLockSample t1 = new DeadLockSample("Thread1", lockA, lockB);
      DeadLockSample t2 = new DeadLockSample("Thread2", lockB, lockA);
      t1.start();
      t2.start();
      t1.join();
      t2.join();
  }
}
```



#### 如何在编程中尽量预防死锁呢？

1. 如果可能的话，尽量避免使用多个锁，并且只有需要时才持有锁
2. 如果必须使用多个锁，尽量设计好锁的获取顺序  
3. 使用带超时的方法，为程序带来更多可控性。



### 第19讲 | Java并发包提供了哪些并发工具类？

- 提供了比 synchronized 更加高级的各种同步结构，包括 **CountDownLatch、CyclicBarrier、Semaphore** 等，可以实现更加丰富的多线程操作，比如利用 Semaphore 作为资源控制器，限制同时进行工作的线程数量。
- 各种线程安全的容器，比如最常见的 **ConcurrentHashMap、有序的 ConcurrentSkipListMap**，或者通过类似快照机制，实现线程安全的动态数组 CopyOnWriteArrayList 等。
- 各种并发队列实现，如各种 BlockingQueue 实现，比较典型的 **ArrayBlockingQueue、 SynchronousQueue** 或针对特定场景的 PriorityBlockingQueue 等。
- 强大的 **Executor** 框架，可以创建各种不同类型的线程池，调度任务运行等，绝大部分情况下，不再需要自己从头实现线程池和任务调度器。



#### Semaphore信号量

它通过控制一定数量的允许（permit）的方式，来达到限制通用资源访问的目的。

#### CountDownLatch 和 CyclicBarrier

- **CountDownLatch** 是**不可以重置**的，所以**无法重用**；而 CyclicBarrier 则没有这种限制，可以重用。
- CountDownLatch 的基本操作组合是 **countDown/await。**调用 await 的线程阻塞等待 **countDown** 足够的次数，不管你是在一个线程还是多个线程里 countDown，只要次数足够即可。所以就像 Brain Goetz 说过的，***CountDownLatch 操作的是事件***。
- **CyclicBarrier** 的基本操作组合，则就是 **await**，当所有的伙伴（parties）都调用了 **await**，才会继续进行任务*，**并自动进行重置**。注意，正常情况下，CyclicBarrier 的重置都是自动发生的，如果我们调用 reset 方法，但还有线程在等待，就会导致等待线程被打扰，抛出 BrokenBarrierException 异常。
- CyclicBarrier 侧重点是**<u>*线程*</u>**，而不是**<u>*调用事件*</u>**，它的典型应用场景是用来***<u>等待并发线程结束</u>***。

![image](https://static.lovedata.net/20-11-10-8bb926900cc9db63c472e4e89d9ab60c.png-wm)





Map 放入或者获取的速度，而不在乎顺序，大多推荐使用 **ConcurrentHashMap**，反之则使用 **ConcurrentSkipListMap**；

如果我们需要对大量数据进行非常频繁地修改，**ConcurrentSkipListMap** 也可能表现出优势。



#### 为什么并发容器里面没有 ConcurrentTreeMap 呢？

这是因为 TreeMap 要实现**高效的线程安全**是非常困难的，它的实现基于复杂的红黑树。为保证访问效率，当我们**<u>*插入或删除节点时，会移动节点进行平衡操作*</u>**，这导致在并发场景中难以进行合理粒度的同步。而 **SkipList** 结构则要相对简单很多，通过**层次结构提高访问速度**，虽然不够紧凑，空间使用有一定提高（O(nlogn)），但是在增删元素时线程安全的开销要好很多

![image](https://static.lovedata.net/20-11-10-c3dceb25c189ab256550fc6fb7896b39.png-wm)



#### CopyOnWrite 到底是什么意思呢？

它的原理是，任何修改操作，如 add、set、remove，都会拷贝原数组，修改后替换原来的数组，通过这种防御性的方式，实现另类的线程安全

```java

public boolean add(E e) {
  synchronized (lock) {
      Object[] elements = getArray();
      int len = elements.length;
           // 拷贝
      Object[] newElements = Arrays.copyOf(elements, len + 1);
      newElements[len] = e;
           // 替换
      setArray(newElements);
      return true;
            }
}
final void setArray(Object[] a) {
  array = a;
}
```



### 第20讲 | 并发包中的ConcurrentLinkedQueue和LinkedBlockingQueue有什么区别？ ***

Concurrent 类型基于 **lock-free**，在常见的多线程访问场景，一般可以<u>*提供较高吞吐量</u>*。

而 LinkedBlockingQueue 内部则是**基于锁**，并提供了 **BlockingQueue** 的等待性方法。

java.util.concurrent 包提供的容器（Queue、List、Set）、Map，从命名上可以大概区分为 **Concurrent***、**CopyOnWrite**和 **Blocking**等三类

- Concurrent 类型没有类似 CopyOnWrite 之类容器相对较重的修改开销
- Concurrent 往往提供了较低的遍历一致性 遍历的时候容器发生修改，迭代器仍然可以继续进行遍历。
- 与弱一致性对应的，就是我介绍过的同步容器常见的行为“fail-fast”，也就是检测到容器在遍历过程中发生了修改，则抛出 ConcurrentModificationException，不再继续遍历。
- 弱一致性的另外一个体现是，size 等操作准确性是有限的 未必是 100% 准确。
- 读取的性能具有一定的不确定性。

![image](https://static.lovedata.net/20-11-11-f161aac8ce385005fdf088facbfcaed1.png-wm)



**Blocking** 意味着其提供了特定的等待性操作，获取时（take）等待元素进队，或者插入时（put）等待队列出现空位。

```java

 /**
 * 获取并移除队列头结点，如果必要，其会等待直到队列出现元素
…
 */
E take() throws InterruptedException;

/**
 * 插入元素，如果队列已满，则等待直到队列出现空闲空间
   …
 */
void put(E e) throws InterruptedException;  
```



#### BlockingQueue是否有界的问题

1. ArrayBlockingQueue 是最典型的的有界队列 内部是final 数组，初始化的时候指定容量。
2. LinkedBlockingQueue，容易被误解为**无边界**，但其实其行为和内部代码都是基于有界的逻辑实现的，只不过如果我们没有在创建队列时就指定容量，那么其容量限制就自动被设置为 Integer.MAX_VALUE，成为了无界队列
3. SynchronousQueue，这是一个非常奇葩的队列实现，每个删除操作都要等待插入操作，反之每个插入操作也都要等待删除动作。那么这个队列的容量是多少呢？是 1 吗？其实不是的，其内部容量是 0
4. PriorityBlockingQueue 是无边界的优先队列，虽然严格意义上来讲，其大小总归是要受系统资源影响。
5. DelayedQueue 和 LinkedTransferQueue 同样是无边界的队列。对于无边界的队列，有一个自然的结果，就是 put 操作永远也不会发生其他 BlockingQueue 的那种等待情况。

LinkedBlockingQueue

```java

/** Lock held by take, poll, etc */
private final ReentrantLock takeLock = new ReentrantLock();

/** Wait queue for waiting takes */
private final Condition notEmpty = takeLock.newCondition();

/** Lock held by put, offer, etc */
private final ReentrantLock putLock = new ReentrantLock();

/** Wait queue for waiting puts */
private final Condition notFull = putLock.newCondition();
```





#### 场景

- 考虑应用场景中对队列边界的要求。ArrayBlockingQueue 是有明确的容量限制的，而 LinkedBlockingQueue 则取决于我们是否在创建时指定，SynchronousQueue 则干脆不能缓存任何元素。
- 从空间利用角度，数组结构的 ArrayBlockingQueue 要比 LinkedBlockingQueue 紧凑，因为其不需要创建所谓节点，但是其初始分配阶段就需要一段连续的空间，所以初始内存需求更大。
- 通用场景中，LinkedBlockingQueue 的吞吐量一般优于 ArrayBlockingQueue，因为它实现了<u>***更加细粒度的锁操作***</u>。ArrayBlockingQueue 实现比较简单，性能更好预测，属于表现稳定的“选手”。
- 如果我们需要实现的是**两个线程之间接力性（handoff）的场景**，按照专栏上一讲的例子，你可能会选择 **CountDownLatch**，但是SynchronousQueue也是完美符合这种场景的，**而且线程间协调和数据传输统一起来**，代码更加规范。
- 可能令人意外的是，很多时候 SynchronousQueue 的性能表现，往往大大超过其他实现，尤其是在队列元素较小的场景。



#### 阻塞队列与非阻塞队列

##### 非阻塞队列：

也就是一般的队列，没有阻塞队列的两个阻塞功能。其主要方法如下

- boolean add(E e)：将元素e插入到队列末尾，插入成功，返回true；插入失败（即队列已满），抛出异常；
- boolean offer(E e)：将元素e插入到队列末尾，插入成功，则返回true；插入失败（即队列已满），返回false；
- E remove()：移除队首元素，若移除成功，则返回true；移除失败（队列为空），则会抛出异常；
- E poll()：获取队首元素并移除，若队列不为空，则返回队首元素；否则返回null；
- E element()：获取队首元素并不移除元素，若队列不为空，则返回队首元素；否则抛出异常;
- [E peek](https://www.baidu.com/s?wd=peek&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)()：获取队首元素并不移除元素，若队列不为空，则返回队首元素；否则返回null;

##### 阻塞队列

队列一般都有着两个阻塞操作，即插入与取出。

当队列满时，会阻塞元素的插入，直到队列有空闲时停止阻塞，新元素才可以继续插入。

当队列为空时，移除元素的线程会一直被阻塞等待，直到队列中有元素时才可以继续取出。

**除拥有普通队列的方法之外，阻塞队列提供了另外4个常用的方法：**

- put(E e)：向队尾插入元素，若队列已满，则被阻塞等待，直到有空闲才继续插入。

- take()：从队首取出元素，若队列为空，则被阻塞等待，直到有元素才继续取出。

-  offer(E e,long timeout, TimeUnit unit)：向队尾插入元素，若队列已满，则计时等待，当时间期限达到时，若队列还是满的，则返回false；若等待在期限内，队列空闲，则插入成功，返回true；

-  poll(long timeout, TimeUnit unit)：从队首取出元素，如果队列空，则计时等待，当时间期限达到时，若队列还是空的，则返回null；若等待在期限内，队列中有元素，否则返回取得的元素；

#### 二者区别

首先二者都是线程安全的得队列，都可以用于生产与消费模型的场景。

|          | ConcurrentLinkedQueue | LinkedBlockingQueue |
| -------- | --------------------- | ------------------- |
| 线程安全 | 安全                  | 安全                |
| 阻塞     | 阻塞                  | 不阻塞              |
| 实现     | ReentranceLock        | CAS+自旋锁          |



### 第21讲 | Java并发类库提供的线程池有哪几种？ 分别有什么特点？

	[Java线程池的四种用法与使用场景](https://juejin.im/post/6844904020792836103)

- newCachedThreadPool()，它是一种用来处理大量短时间工作任务的线程池，具有几个鲜明特点：**它会试图缓存线程并重用**，当无缓存线程可用时，就会创建新的**工作线程**；如果线程闲置的时间超过 60 秒，则被终止并移出缓存；长时间闲置时，这种线程池，不会消耗什么资源。其内部使用 SynchronousQueue 作为工作队列。
  - **不足**：这种方式虽然可以根据业务场景自动的扩展线程数来处理我们的业务，但是最多需要多少个线程同时处理缺是我们无法控制的；
  - **优点**：如果当第二个任务开始，第一个任务已经执行结束，那么第二个任务会复用第一个任务创建的线程，并不会重新创建新的线程，提高了线程的复用率；
- newFixedThreadPool(int nThreads)，重用指定数目（nThreads）的线程，其背后使用的是无界的工作队列，任何时候最多有 nThreads 个工作线程是活动的。这意味着，如果任务数量超过了活动队列数目，将在工作队列中等待空闲线程出现；如果有工作线程退出，将会有新的工作线程被创建，以补足指定的数目 nThreads。
  - 优点： newFixedThreadPool的线程数是可以进行控制的，因此我们可以通过控制最大线程来使我们的服务器打到最大的使用率，同事又可以保证及时流量突然增大也不会占用服务器过多的资源
- newSingleThreadExecutor()，它的特点在于工作线程数目被限制为 1，操作一个无界的工作队列，所以它保证了所有任务的都是被顺序执行，最多会有一个任务处于活动状态，并且不允许使用者改动线程池实例，因此可以避免其改变线程数目。
- newSingleThreadScheduledExecutor() 和 newScheduledThreadPool(int corePoolSize)，创建的是个 ScheduledExecutorService，可以进行定时或周期性的工作调度，区别在于单一工作线程还是多个工作线程。
- newWorkStealingPool(int parallelism)，这是一个经常被人忽略的线程池，Java 8 才加入这个创建方法，其内部会构建ForkJoinPool，利用Work-Stealing算法，并行地处理任务，不保证处理顺序。