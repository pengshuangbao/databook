# Java核心技术

[toc]
## 第16讲 | synchronized底层如何实现?什么是锁的升级、降级?

## 第17讲｜一个线程两次调用 start() 方法会出现什么情况？谈谈线程的生命周期和状态转移。

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

### 线程是什么？

1. 操作系统的角度：线程被认为是最小的调度单元，一个进程有多个线程

2. 任务的真正运作者，有自己的栈（Stack）、寄存器（Register）、本地存储（Thread Local）等

3. 和进程内其他线程共享文件描述符、虚拟地址空间

具体实现中，线程还分为*内核线程**</u>、*用户线程**</u>。 

当前JVM ： 现在的模型是**一对一映射**到操作系统**内核线程**。

内部源码都是JNI

```java
private native void start0();
private native void setPriority0(int newPriority);
private native void interrupt0();
```



### 线程状态转换

![image](https://static.lovedata.net/20-11-10-e4595cfcccbe936fcf0f9030ad397382.png)



### 为什么需要并发包？

Thread 和 Object 的方法，听起来简单，但是实际应用中被证明**非常晦涩、易错**，这也是为什么 Java 后来又引入了并发包。总的来说，有了并发包，大多数情况下，我们已经不再需要去调用 wait/notify 之类的方法了。



### 守护线程（Daemon Thread）

有的时候应用中需要一个长期驻留的服务程序，但是不希望其影响应用退出，就可以将其设置为守护线程，如果 JVM 发现只有守护线程存在时，将结束进程，具体可以参考下面代码段。注意，**必须在线程启动之前设置。**

```java
Thread daemonThread = new Thread();
daemonThread.setDaemon(true);
daemonThread.start();
```



### ThreadLocal(线程本地变量)

Java 提供的一种**保存线程私有信息**的机制，因为其在整个**线程生命周期内有效**，所以可以方便地在一个线程关联的不同业务模块之间**传递信息*，比如事务 ID、Cookie 等上下文相关信息。

废弃项目的回收依赖于显式地触发，否则就要等待线程结束，进而回收相应 ThreadLocalMap！这就是很多 **OOM 的来源*，所以通常都会建议，应用一定要自己负责 remove，并且不要和线程池配合，因为 worker 线程往往是不会退出的。

**线程池一般不建议和thread local配合...**

## 第18讲 | 什么情况下Java程序会产生死锁？如何定位、修复？

死锁是一种特定的程序状态，在实体之间，由于循环依赖导致彼此一直处于等待之中，没有任何个体可以继续前进。死锁不仅仅是在线程之间会发生，存在资源独占的进程之间同样也可能出现死锁。通常来说，我们大多是聚焦在多线程场景中的死锁，指两个或多个线程之间，由于互相持有对方需要的锁，而永久处于阻塞的状态。

![image](https://static.lovedata.net/20-11-10-d59a0eed6e578bf4624dd61bdbfacf13.png)

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



### 如何在编程中尽量预防死锁呢？

1. 如果可能的话，尽量避免使用多个锁，并且只有需要时才持有锁
2. 如果必须使用多个锁，尽量设计好锁的获取顺序  
3. 使用带超时的方法，为程序带来更多可控性。



## 第19讲 | Java并发包提供了哪些并发工具类？

- 提供了比 synchronized 更加高级的各种同步结构，包括 **CountDownLatch、CyclicBarrier、Semaphore** 等，可以实现更加丰富的多线程操作，比如利用 Semaphore 作为资源控制器，限制同时进行工作的线程数量。
- 各种线程安全的容器，比如最常见的 **ConcurrentHashMap、有序的 ConcurrentSkipListMap**，或者通过类似快照机制，实现线程安全的动态数组 CopyOnWriteArrayList 等。
- 各种并发队列实现，如各种 BlockingQueue 实现，比较典型的 **ArrayBlockingQueue、 SynchronousQueue** 或针对特定场景的 PriorityBlockingQueue 等。
- 强大的 **Executor** 框架，可以创建各种不同类型的线程池，调度任务运行等，绝大部分情况下，不再需要自己从头实现线程池和任务调度器。



### Semaphore信号量

它通过控制一定数量的允许（permit）的方式，来达到限制通用资源访问的目的。

### CountDownLatch 和 CyclicBarrier

- **CountDownLatch** 是**不可以重置**的，所以**无法重用**；而 CyclicBarrier 则没有这种限制，可以重用。
- CountDownLatch 的基本操作组合是 **countDown/await。**调用 await 的线程阻塞等待 **countDown** 足够的次数，不管你是在一个线程还是多个线程里 countDown，只要次数足够即可。所以就像 Brain Goetz 说过的，***CountDownLatch 操作的是事件***。
- **CyclicBarrier** 的基本操作组合，则就是 **await**，当所有的伙伴（parties）都调用了 **await**，才会继续进行任务*，**并自动进行重置**。注意，正常情况下，CyclicBarrier 的重置都是自动发生的，如果我们调用 reset 方法，但还有线程在等待，就会导致等待线程被打扰，抛出 BrokenBarrierException 异常。
- CyclicBarrier 侧重点是**线程**，而不是**调用事件**，它的典型应用场景是用来***等待并发线程结束**。

![image](https://static.lovedata.net/20-11-10-8bb926900cc9db63c472e4e89d9ab60c.png)





Map 放入或者获取的速度，而不在乎顺序，大多推荐使用 **ConcurrentHashMap**，反之则使用 **ConcurrentSkipListMap**；

如果我们需要对大量数据进行非常频繁地修改，**ConcurrentSkipListMap** 也可能表现出优势。



### 为什么并发容器里面没有 ConcurrentTreeMap 呢？

这是因为 TreeMap 要实现**高效的线程安全**是非常困难的，它的实现基于复杂的红黑树。为保证访问效率，当我们**插入或删除节点时，会移动节点进行平衡操作**，这导致在并发场景中难以进行合理粒度的同步。而 **SkipList** 结构则要相对简单很多，通过**层次结构提高访问速度**，虽然不够紧凑，空间使用有一定提高（O(nlogn)），但是在增删元素时线程安全的开销要好很多

![image](https://static.lovedata.net/20-11-10-c3dceb25c189ab256550fc6fb7896b39.png)



### CopyOnWrite 到底是什么意思呢？

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



## 第20讲 | 并发包中的ConcurrentLinkedQueue和LinkedBlockingQueue有什么区别？ ***

Concurrent 类型基于 **lock-free**，在常见的多线程访问场景，一般可以提供较高吞吐量。

而 LinkedBlockingQueue 内部则是**基于锁**，并提供了 **BlockingQueue** 的等待性方法。

java.util.concurrent 包提供的容器（Queue、List、Set）、Map，从命名上可以大概区分为 **Concurrent***、**CopyOnWrite**和 **Blocking**等三类

- Concurrent 类型没有类似 CopyOnWrite 之类容器相对较重的修改开销
- Concurrent 往往提供了较低的遍历一致性 遍历的时候容器发生修改，迭代器仍然可以继续进行遍历。
- 与弱一致性对应的，就是我介绍过的同步容器常见的行为“fail-fast”，也就是检测到容器在遍历过程中发生了修改，则抛出 ConcurrentModificationException，不再继续遍历。
- 弱一致性的另外一个体现是，size 等操作准确性是有限的 未必是 100% 准确。
- 读取的性能具有一定的不确定性。

![image](https://static.lovedata.net/20-11-11-f161aac8ce385005fdf088facbfcaed1.png)



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



### BlockingQueue是否有界的问题

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





### 场景

- 考虑应用场景中对队列边界的要求。ArrayBlockingQueue 是有明确的容量限制的，而 LinkedBlockingQueue 则取决于我们是否在创建时指定，SynchronousQueue 则干脆不能缓存任何元素。
- 从空间利用角度，数组结构的 ArrayBlockingQueue 要比 LinkedBlockingQueue 紧凑，因为其不需要创建所谓节点，但是其初始分配阶段就需要一段连续的空间，所以初始内存需求更大。
- 通用场景中，LinkedBlockingQueue 的吞吐量一般优于 ArrayBlockingQueue，因为它实现了**更加细粒度的锁操作***</u>。ArrayBlockingQueue 实现比较简单，性能更好预测，属于表现稳定的“选手”。
- 如果我们需要实现的是**两个线程之间接力性（handoff）的场景**，按照专栏上一讲的例子，你可能会选择 **CountDownLatch**，但是SynchronousQueue也是完美符合这种场景的，**而且线程间协调和数据传输统一起来**，代码更加规范。
- 可能令人意外的是，很多时候 SynchronousQueue 的性能表现，往往大大超过其他实现，尤其是在队列元素较小的场景。



### 阻塞队列与非阻塞队列

##### 非阻塞队列：

也就是一般的队列，没有阻塞队列的两个阻塞功能。其主要方法如下

- boolean add(E e)：将元素e插入到队列末尾，插入成功，返回true；插入失败（即队列已满），抛出异常；
- boolean offer(E e)：将元素e插入到队列末尾，插入成功，则返回true；插入失败（即队列已满），返回false；
- E remove()：移除队首元素，若移除成功，则返回true；移除失败（队列为空），则会抛出异常；
- E poll()：获取队首元素并移除，若队列不为空，则返回队首元素；否则返回null；
- E element()：获取队首元素并不移除元素，若队列不为空，则返回队首元素；否则抛出异常;
- [E peek](https://www.baidu.com/s?wd=peek&tn=24004469_oem_dg&rsv_dl=gh_pl_sl_csd)()：获取队首元素并不移除元素，若队列不为空，则返回队首元素；否则返回null;

#### 阻塞队列

队列一般都有着两个阻塞操作，即插入与取出。

当队列满时，会阻塞元素的插入，直到队列有空闲时停止阻塞，新元素才可以继续插入。

当队列为空时，移除元素的线程会一直被阻塞等待，直到队列中有元素时才可以继续取出。

**除拥有普通队列的方法之外，阻塞队列提供了另外4个常用的方法：**

- put(E e)：向队尾插入元素，若队列已满，则被阻塞等待，直到有空闲才继续插入。

- take()：从队首取出元素，若队列为空，则被阻塞等待，直到有元素才继续取出。

- offer(E e,long timeout, TimeUnit unit)：向队尾插入元素，若队列已满，则计时等待，当时间期限达到时，若队列还是满的，则返回false；若等待在期限内，队列空闲，则插入成功，返回true；

- poll(long timeout, TimeUnit unit)：从队首取出元素，如果队列空，则计时等待，当时间期限达到时，若队列还是空的，则返回null；若等待在期限内，队列中有元素，否则返回取得的元素；

### 二者区别

首先二者都是线程安全的得队列，都可以用于生产与消费模型的场景。

|          | ConcurrentLinkedQueue | LinkedBlockingQueue |
| -------- | --------------------- | ------------------- |
| 线程安全 | 安全                  | 安全                |
| 阻塞     | 阻塞                  | 不阻塞              |
| 实现     | ReentranceLock        | CAS+自旋锁          |



## 第21讲 | Java并发类库提供的线程池有哪几种？ 分别有什么特点？

	[Java线程池的四种用法与使用场景](https://juejin.im/post/6844904020792836103)

- newCachedThreadPool()，它是一种用来处理大量短时间工作任务的线程池，具有几个鲜明特点：**它会试图缓存线程并重用**，当无缓存线程可用时，就会创建新的**工作线程**；如果线程闲置的时间超过 60 秒，则被终止并移出缓存；长时间闲置时，这种线程池，不会消耗什么资源。其内部使用 SynchronousQueue 作为工作队列。
  - **不足**：这种方式虽然可以根据业务场景自动的扩展线程数来处理我们的业务，但是最多需要多少个线程同时处理缺是我们无法控制的；
  - **优点**：如果当第二个任务开始，第一个任务已经执行结束，那么第二个任务会复用第一个任务创建的线程，并不会重新创建新的线程，提高了线程的复用率；
- newFixedThreadPool(int nThreads)，重用指定数目（nThreads）的线程，其背后使用的是无界的工作队列，任何时候最多有 nThreads 个工作线程是活动的。这意味着，如果任务数量超过了活动队列数目，将在工作队列中等待空闲线程出现；如果有工作线程退出，将会有新的工作线程被创建，以补足指定的数目 nThreads。
  - 优点： newFixedThreadPool的线程数是可以进行控制的，因此我们可以通过控制最大线程来使我们的服务器打到最大的使用率，同事又可以保证及时流量突然增大也不会占用服务器过多的资源
- newSingleThreadExecutor()，它的特点在于工作线程数目被限制为 1，操作一个无界的工作队列，所以它保证了所有任务的都是被顺序执行，最多会有一个任务处于活动状态，并且不允许使用者改动线程池实例，因此可以避免其改变线程数目。
- newSingleThreadScheduledExecutor() 和 newScheduledThreadPool(int corePoolSize)，创建的是个 ScheduledExecutorService，可以进行定时或周期性的工作调度，区别在于单一工作线程还是多个工作线程。
- newWorkStealingPool(int parallelism)，这是一个经常被人忽略的线程池，Java 8 才加入这个创建方法，其内部会构建ForkJoinPool，利用Work-Stealing算法，并行地处理任务，不保证处理顺序。

