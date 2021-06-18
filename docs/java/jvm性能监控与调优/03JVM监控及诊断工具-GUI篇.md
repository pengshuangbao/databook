# JVM监控及诊断工具-GUI篇

[toc]



## 3.1. 工具概述

使用上一章命令行工具或组合能帮您获取目标Java应用性能相关的基础信息，但它们存在下列局限：

- 1．无法获取方法级别的分析数据，如方法间的调用关系、各方法的调用次数和调用时间等（这对定位应用性能瓶颈至关重要）。
- 2．要求用户登录到目标 Java 应用所在的宿主机上，使用起来不是很方便。
- 3．分析数据通过终端输出，结果展示不够直观。

为此，JDK提供了一些内存泄漏的分析工具，如jconsole，jvisualvm等，用于辅助开发人员定位问题，但是这些工具很多时候并不足以满足快速定位的需求。所以这里我们介绍的工具相对多一些、丰富一些。

**JDK自带的工具**

- jconsole：JDK自带的可视化监控工具。查看Java应用程序的运行概况、监控堆信息、永久区（或元空间）使用情况、类加载情况等

- Visual VM：Visual VM是一个工具，它提供了一个可视界面，用于查看Java虚拟机上运行的基于Java技术的应用程序的详细信息。

- JMC：Java Mission Control，内置Java Flight Recorder。能够以极低的性能开销收集Java虚拟机的性能数据。

**第三方工具**

- MAT：MAT（Memory Analyzer Tool）是基于Eclipse的内存分析工具，是一个快速、功能丰富的Java heap分析工具，它可以帮助我们查找内存泄漏和减少内存消耗

- JProfiler：商业软件，需要付费。功能强大。


## 3.2. JConsole

jconsole：从Java5开始，在JDK中自带的java监控和管理控制台。用于对JVM中内存、线程和类等的监控，是一个基于JMX（java management extensions）的GUI性能监控工具。

官方地址：[https://docs.oracle.com/javase/7/docs/technotes/guides/management/jconsole.html](https://docs.oracle.com/javase/7/docs/technotes/guides/management/jconsole.html)

![image-20210505141631635](https://static.lovedata.net/zs/20210505141653.png-wm)
![image-20210505141726143](https://static.lovedata.net/zs/20210505141728.png-wm)
![image-20210505141924211](https://static.lovedata.net/zs/20210505141930.png-wm)
![image-20210505141950000](https://static.lovedata.net/zs/20210505141952.png-wm)
![image-20210505142050157](https://static.lovedata.net/zs/20210505142053.png-wm)
## 3.3. Visual VM

Visual VM是一个功能强大的多合一故障诊断和性能监控的可视化工具。它集成了多个JDK命令行工具，使用Visual VM可用于显示虚拟机进程及进程的配置和环境信息（jps，jinfo），监视应用程序的CPU、GC、堆、方法区及线程的信息（jstat、jstack）等，甚至代替JConsole。在JDK 6 Update 7以后，Visual VM便作为JDK的一部分发布（VisualVM 在JDK／bin目录下）即：它完全免费。

**主要功能：**

- 1.生成/读取堆内存/线程快照
- 2.查看JVM参数和系统属性
- 3.查看运行中的虚拟机进程
- 4.程序资源的实时监控
- 5.JMX代理连接、远程环境监控、CPU分析和内存分析

官方地址：[https://visualvm.github.io/index.html](https://visualvm.github.io/index.html)

![image-20210505143844282](https://static.lovedata.net/zs/20210505144206.png-wm)
![image-20210505144716064](https://static.lovedata.net/zs/20210505144718.png-wm)
![image-20210505144805307](https://static.lovedata.net/zs/20210505144806.png-wm)



### 远程连接

1.确定远程服务器的ip地址
2-添加IMX (通过MX技术具体监控远锅服努器哪个Java进程
3-修改bin/catalina.sh文件，连接远程的tomcat
4:在_/conf中添加imoremote accessjimurermote password文件 远程连接
5-将服务器地址改为公网ip地址
C6设置阿里云安全策略和防火植策略。
7-启动tomcat,查看tomcat启动日志和端口监听
8-JM中输入端口号、用户名、密码登录



## 3.4. Eclipse MAT

MAT（Memory Analyzer Tool）工具是一款功能强大的Java堆内存分析器。可以用于查找内存泄漏以及查看内存消耗情况。MAT是基于Eclipse开发的，不仅可以单独使用，还可以作为插件的形式嵌入在Eclipse中使用。是一款免费的性能分析工具，使用起来非常方便。

MAT可以分析heap dump文件。在进行内存分析时，只要获得了反映当前设备内存映像的hprof文件，通过MAT打开就可以直观地看到当前的内存信息。一般说来，这些内存信息包含：

- 所有的对象信息，包括对象实例、成员变量、存储于栈中的基本类型值和存储于堆中的其他对象的引用值。
- 所有的类信息，包括classloader、类名称、父类、静态变量等
- GCRoot到所有的这些对象的引用路径
- 线程信息，包括线程的调用栈及此线程的线程局部变量（TLS）

MAT 不是一个万能工具，它并不能处理所有类型的堆存储文件。但是比较主流的厂家和格式，例如Sun，HP，SAP 所采用的 HPROF 二进制堆存储文件，以及 IBM的 PHD 堆存储文件等都能被很好的解析。

最吸引人的还是能够快速为开发人员生成内存泄漏报表，方便定位问题和分析问题。虽然MAT有如此强大的功能，但是内存分析也没有简单到一键完成的程度，很多内存问题还是需要我们从MAT展现给我们的信息当中通过经验和直觉来判断才能发现。

官方地址： [https://www.eclipse.org/mat/downloads.php](https://www.eclipse.org/mat/downloads.php) 

![image-20210505145708567](https://static.lovedata.net/zs/20210505145710.png-wm)
![image-20210505145826442](https://static.lovedata.net/zs/20210505145828.png-wm)
![image-20210505145945951](https://static.lovedata.net/zs/20210505145951.png-wm)
![image-20210505150039376](https://static.lovedata.net/zs/20210505150040.png-wm)

### 浅堆与深堆

#### 浅堆

浅堆(Shallow Heap)是指一个对象所消耗的内存在32位系统中，一个对象引用会占据4个字节，-一个int类型会占据4个字节，long型变量会占据8个字节，每个对象头需要占用8个字节。根据堆快照格式不同，对象的大小可能会向8字节进行对齐。以String为例: 2个int值共占8字节， 对象引用占用4字节，对象头8字节，合计20字节，向8字节对齐，故占24字节。(jdk7中)

![image](https://static.lovedata.net/21-06-13-87d0b71cb6a5ba5ac971eacb196e3975.png-wm)

这24字节为yString对象的浅堆大小。它与String的value实际取值无关，无论字符串长度如何，浅堆大小始
终是24字节，



#### 深堆

保留集(Retained Set); 
**对象A的保留集指当对象A被垃圾回收后，可以被释放的所有的对象集合(包括对象A本身)**，即对象A的保留集可以被认为是只能通过对象A被直接或间接访问到的所有对象的集合。通俗地说，就是指仅被对象A所持有的对象的集合。

深堆(Retained Heap): I
深堆是指对象的保留集中所有的对象的浅堆大小之和。

注意;浅堆指对象本身占用的内存，不包括其内部引用对象的大小。一个对象的深堆指只能通过该对象访问到的(直接或间接)所有对象的浅堆之和，即对象被回收后，可以释放的真实空间。



### 对象的实际大小

另外一个常用的概念是对象的实际大小。这里，对象的实际大小定义为一个对象所能触及的所有对象的浅堆大小之和，也就是通常意义上我们说的对象大小。与深堆相比，似乎这个在日常开发中更为直观和被人接受，但实际上，这个概念和垃圾回收无关。

下图显示了一个简单的对象引用关系图，对象A引用了C和D，对象B引用了C和E。那么对象A的浅堆大
小只是A本身，不含C和D,而A的实际大小为A、C、D三者之和。而A的深堆大小为A与D之和，由于对
象C还可以通过对象B访问到，因此不在对象A的深堆范围内。

![image](https://static.lovedata.net/21-06-13-16e90bad10c5af4c56749836e64c5d86.png-wm)



## 补充1:再谈内存泄漏

### 何为内存泄漏

![image](https://static.lovedata.net/21-06-14-06932c870b027fa6213141c548ab3613.png-wm)

可达性分析算法来判断对象是否是不再使用的对象，本质都是判断一个对象是否还被引用。那么对于这种情况下，由于代码的实现不同就会出现很多种内存泄漏问题(让JVM误以为此对象还在引用中，无法回收，造成内存泄漏)。

### 内存泄漏(memory leak)的理解

**严格来说**，只有对象不会再被程序用到了，但是GC又不能回收他们的情况，才叫内存泄漏。但实际情况很多时候- -些不太好的实践 (或疏忽)会导致**对象的生命周期变得很长甚至导致00M**，也可以叫做宽泛意义上的“内存泄漏”。

![image](https://static.lovedata.net/21-06-14-3dcae25527ff86cedfe2ee766b28a505.png-wm)



对象X引用对象Y. x的生命周期比Y的生命周期长;那么当Y生命周期结束的时候，X依然引用着Y,这时候，垃圾回收期是不会回收对象Y的;
如果对象X还引用着生命周期比较短的A、B、C，对象A又引用着对象a、b、c，这样就可能造成大量无用的对象不能被回收，进而占据了内存资源，造成内存泄漏，直到内存溢出。



### 内存泄漏与内存溢出的关系:

1.内存泄漏(memory leak )

申请了内存用完了不释放，比如一共有1024M 的内存，分配了512M 的内存一直不回收，那么可以用的内存只有512M了，仿佛泄露掉了”部分:<mark>**通俗点讲的话， 内存泄漏就是[占着茅坑不拉shij。**</mark>

2.内存溢出(out of memory)

申请内存时，没有足够的内存可以使用:
通俗一点儿讲，**一个厕所就三个坑，有两个站着茅坑不走的(内存泄漏)，剩下最后一个坑，厕所表**
**示接待压力很大，这时候一下子来了两个人，坑位(内存)就不够了，内存泄漏变成内存溢出了**

### 泄漏的分类

经常发生:发生内存泄露的代码会被多次执行，每次执行，泄露一块内存:
偶然发生:在某些特定情况下才会发生:

一次性: 发生内存泄露的方法只会执行一次:
隐式泄漏:一直占着内存不释放，直到执行结束;严格的说这个不算内存泄漏，因为最终释放掉了，但是如果执行时间特别长，也可能会导致内     存耗尽。

### Java中内存泄漏的八种情况

#### 静态集合类

静态集合类，如HashMap、LinkedList等等。如果这些容器为静态的，那么它们的生命周期与JVM程序一致，则容器中的对象在程序结束之前将不能被释放，从而造成内存泄漏。简单而言，长生命周期的对象持有短生命周期对象的引用，尽管短生命周期的对象不再使用，但是因为长生命周期对象持有它的引用而导致不能被回收。

![image](https://static.lovedata.net/21-06-14-ce822d381687be365702e4bab2b511a5.png-wm)



#### 单例模式

单例模式，和静态集合导致内存泄露的原因类似，因为单例的静态特性，它的生命周期和JVM的生命周期一样长，所以如果单例对象如果持有外部对象的引用，那么这个外部对象也不会被回收，那么就会造成内存泄漏。

### 内部类持有外部类

内部类持有外部类，如果一个外部类的实例对象的方法返回了一个内部类的实例对象。这个内部类对象被长期引用了，即使那个外部类实例对象不再被使用，但由于内部类持有外部类的实例对象，这个外部类对象将不会被垃圾回收，这也会造成内存泄漏。

#### 各种连接，如数据库连接、网络连接和IO连接等

各种连接，如数据库连接、网络连接和IO连接等。在对数据库进行操作的过程中，首先霄要建立与数据库的连接，当不再使用时，需要调用close方法来释放与数据库的连接。只有连接被关闭后，垃圾回收器才会回收对应的对象。否则，如果在访问数据库的过程中，对Connection、 Statement或ResultSet不显性地关闭， 将会造成大量的对象无法被回收，从而引起内存泄漏。

![image](https://static.lovedata.net/21-06-14-03ba7d1ed033217f780e9d3372b9056b.png-wm)





#### 变量不合理的作用域。

一般而言，一个变量的定义的作用范围大于其使用范围，很有可能会造成内存泄漏。另一方面，如果没有及时地把对象设置为null,很有可能导致内存泄漏的发生。

```java
public class UsingRandom {
private String msg;
public void receiveMsg( ){
  //private String msg;
  readFromNet();//从网络中接受数据保存到msg中
  saveDB();//把msg保存到数据库中
  //msg = null;
|}
```



如上面这个伪代码，通过readFromNet 方法把接受的消息保存在变量msg中，然后调用saveDB方法把msg的内容保存到数据库中，此时msg已经就没用了，由于msg的生 命周期与对象的生命周期相同，此时msg还不能回收，因此造成了内存泄漏。实际上这个msg变量可以放在receiveMsg方法内部，当方法使用完，那么msg的生 命周期也就结束，此时就可以回收了。还有一-种方法，在使用完msg后， 把msg设置为nu1l,这样垃圾回收器也会回收



#### 6- 改变哈希值

改变哈希值，当一个对象被存储进HashSet集合唾以后，就不能修改这个对象中的那些参与计算哈希值的字段了。

否则，对象修改后的哈希值与最初存储进HashSet集合中时的哈希值就不同了，在这种情况下，即使在contains方法使用该对象的当前引用作为的参数去HashSet集合中检索对象，也将返回找不到对象的结果，这也会导致无法从HashSet集合中单独删除当前对象，造成内存泄漏。这也是String 为什么被设置成了不可变类型，我们可以放心地把String 存入HashSet, 或者把String当做HashMap的key 值;当我们想把自己定义的类保存到散列表的时候，霄要保证对象的hashCode不可变。

举例1:

![image](https://static.lovedata.net/21-06-14-2b0982bc19f9e73dda0a2b3aa6739754.png-wm)



#### 7-缓存泄漏

内存泄漏的另一个常见来源是缓存，-”旦你把对象引用放入到缓存中，他就很容易遗忘。比如:之前项目在一次上线的时候，应用启动奇慢直到夯死，就是因为代码中会加载一个表中的数据到缓存(内存)中，测试环境只有几百条数据，但是生产环境有几百万的数据。

对于这个问题，可以使用WeakHashMap代表缓存，此种Map的特点是，当除了自身有对key的引用外，此key没有其他引用那么此map会自动丢弃此值。



#### 8-监听器和回调

内存泄漏第三个常见来源是监听器和其他回调，如果客户端在你实现的API中注册回调，却没有显示的取消，那么就会积聚。
需要确保回调立即被当作垃圾回收的最佳方法是只保存它的弱引用，例如将他们保存成为WeakHashMap中的键。



## 3.5. JProfiler

在运行Java的时候有时候想测试运行时占用内存情况，这时候就需要使用测试工具查看了。在eclipse里面有 Eclipse Memory Analyzer tool（MAT）插件可以测试，而在IDEA中也有这么一个插件，就是JProfiler。JProfiler 是由 ej-technologies 公司开发的一款 Java 应用性能诊断工具。功能强大，但是收费。

**特点：**

- 使用方便、界面操作友好（简单且强大）
- 对被分析的应用影响小（提供模板）
- CPU，Thread，Memory分析功能尤其强大
- 支持对jdbc，noSql，jsp，servlet，socket等进行分析
- 支持多种模式（离线，在线）的分析
- 支持监控本地、远程的JVM
- 跨平台，拥有多种操作系统的安装版本

**主要功能：**

- 1-方法调用：对方法调用的分析可以帮助您了解应用程序正在做什么，并找到提高其性能的方法
- 2-内存分配：通过分析堆上对象、引用链和垃圾收集能帮您修复内存泄露问题，优化内存使用
- 3-线程和锁：JProfiler提供多种针对线程和锁的分析视图助您发现多线程问题
- 4-高级子系统：许多性能问题都发生在更高的语义级别上。例如，对于JDBC调用，您可能希望找出执行最慢的SQL语句。JProfiler支持对这些子系统进行集成分析

官网地址：[https://www.ej-technologies.com/products/jprofiler/overview.html](https://www.ej-technologies.com/products/jprofiler/overview.html)

**数据采集方式：**

JProfier数据采集方式分为两种：Sampling（样本采集）和Instrumentation（重构模式）

**Instrumentation**：这是JProfiler全功能模式。在class加载之前，JProfier把相关功能代码写入到需要分析的class的bytecode中，对正在运行的jvm有一定影响。

- 优点：功能强大。在此设置中，调用堆栈信息是准确的。
- 缺点：若要分析的class较多，则对应用的性能影响较大，CPU开销可能很高（取决于Filter的控制）。因此使用此模式一般配合Filter使用，只对特定的类或包进行分析

**Sampling**：类似于样本统计，每隔一定时间（5ms）将每个线程栈中方法栈中的信息统计出来。

- 优点：对CPU的开销非常低，对应用影响小（即使你不配置任何Filter）
- 缺点：一些数据／特性不能提供（例如：方法的调用次数、执行时间）

注：JProfiler本身没有指出数据的采集类型，这里的采集类型是针对方法调用的采集类型。因为JProfiler的绝大多数核心功能都依赖方法调用采集的数据，所以可以直接认为是JProfiler的数据采集类型。

**遥感监测 Telemetries**

![image-20210505164521410](https://static.lovedata.net/zs/20210505164523.png-wm)
![image-20210505164907312](https://static.lovedata.net/zs/20210505164909.png-wm)
![image-20210505164815324](https://static.lovedata.net/zs/20210505164918.png-wm)
![image-20210505164945192](https://static.lovedata.net/zs/20210505164947.png-wm)
![image-20210505165010529](https://static.lovedata.net/zs/20210505165012.png-wm)
![image-20210505165128212](https://static.lovedata.net/zs/20210505165215.png-wm)
![image-20210505165249919](https://static.lovedata.net/zs/20210505165252.png-wm)
**内存视图 Live Memory**

Live memory 内存剖析：class／class instance的相关信息。例如对象的个数，大小，对象创建的方法执行栈，对象创建的热点。

- **所有对象 All Objects**：显示所有加载的类的列表和在堆上分配的实例数。只有Java 1.5（JVMTI）才会显示此视图。
- **记录对象 Record Objects**：查看特定时间段对象的分配，并记录分配的调用堆栈。
- **分配访问树 Allocation Call Tree**：显示一棵请求树或者方法、类、包或对已选择类有带注释的分配信息的J2EE组件。
- **分配热点 Allocation Hot Spots**：显示一个列表，包括方法、类、包或分配已选类的J2EE组件。你可以标注当前值并且显示差异值。对于每个热点都可以显示它的跟踪记录树。
- **类追踪器 Class Tracker**：类跟踪视图可以包含任意数量的图表，显示选定的类和包的实例与时间。

![image-20210505164554298](https://static.lovedata.net/zs/20210505164556.png-wm)
![image-20210505165519790](https://static.lovedata.net/zs/20210505165521.png-wm)
**堆遍历 heap walker**

![image-20210505165710620](https://static.lovedata.net/zs/20210505165712.png-wm)
![image-20210505165823201](https://static.lovedata.net/zs/20210505193750.png-wm)
**cpu视图 cpu views**

JProfiler 提供不同的方法来记录访问树以优化性能和细节。线程或者线程组以及线程状况可以被所有的视图选择。所有的视图都可以聚集到方法、类、包或J2EE组件等不同层上。

- **访问树 Call Tree**：显示一个积累的自顶向下的树，树中包含所有在JVM中已记录的访问队列。JDBC，JMS和JNDI服务请求都被注释在请求树中。请求树可以根据Servlet和JSP对URL的不同需要进行拆分。
- **热点 Hot Spots**：显示消耗时间最多的方法的列表。对每个热点都能够显示回溯树。该热点可以按照方法请求，JDBC，JMS和JNDI服务请求以及按照URL请求来进行计算。
- **访问图 Call Graph**：显示一个从已选方法、类、包或J2EE组件开始的访问队列的图。
- **方法统计 Method Statistis**：显示一段时间内记录的方法的调用时间细节。

![image-20210505170055722](https://static.lovedata.net/zs/20210505170057.png-wm)
![image-20210505170141278](https://static.lovedata.net/zs/20210505170143.png-wm)
**线程视图 threads**

JProfiler通过对线程历史的监控判断其运行状态，并监控是否有线程阻塞产生，还能将一个线程所管理的方法以树状形式呈现。对线程剖析。

- **线程历史 Thread History**：显示一个与线程活动和线程状态在一起的活动时间表。
- **线程监控 Thread Monitor**：显示一个列表，包括所有的活动线程以及它们目前的活动状况。
- **线程转储 Thread Dumps**：显示所有线程的堆栈跟踪。

线程分析主要关心三个方面：

- 1．web容器的线程最大数。比如：Tomcat的线程容量应该略大于最大并发数。
- 2．线程阻塞
- 3．线程死锁

![image-20210505170739972](https://static.lovedata.net/zs/20210505170742.png-wm)
**监控和锁 Monitors ＆Locks**

所有线程持有锁的情况以及锁的信息。观察JVM的内部线程并查看状态：

- **死锁探测图表 Current Locking Graph**：显示JVM中的当前死锁图表。
- **目前使用的监测器 Current Monitors**：显示目前使用的监测器并且包括它们的关联线程。
- **锁定历史图表 Locking History Graph**：显示记录在JVM中的锁定历史。
- **历史检测记录 Monitor History**：显示重大的等待事件和阻塞事件的历史记录。
- **监控器使用统计 Monitor Usage Statistics**：显示分组监测，线程和监测类的统计监测数据

## 3.6. Arthas

上述工具都必须在服务端项目进程中配置相关的监控参数，然后工具通过远程连接到项目进程，获取相关的数据。这样就会带来一些不便，比如线上环境的网络是隔离的，本地的监控工具根本连不上线上环境。并且类似于Jprofiler这样的商业工具，是需要付费的。

那么有没有一款工具不需要远程连接，也不需要配置监控参数，同时也提供了丰富的性能监控数据呢？

阿里巴巴开源的性能分析神器Arthas应运而生。

Arthas是Alibaba开源的Java诊断工具，深受开发者喜爱。在线排查问题，无需重启；动态跟踪Java代码；实时监控JVM状态。Arthas 支持JDK 6＋，支持Linux／Mac／Windows，采用命令行交互模式，同时提供丰富的 Tab 自动补全功能，进一步方便进行问题的定位和诊断。当你遇到以下类似问题而束手无策时，Arthas可以帮助你解决：

- 这个类从哪个 jar 包加载的？为什么会报各种类相关的 Exception？
- 我改的代码为什么没有执行到？难道是我没 commit？分支搞错了？
- 遇到问题无法在线上 debug，难道只能通过加日志再重新发布吗？
- 线上遇到某个用户的数据处理有问题，但线上同样无法 debug，线下无法重现！
- 是否有一个全局视角来查看系统的运行状况？
- 有什么办法可以监控到JVM的实时运行状态？
- 怎么快速定位应用的热点，生成火焰图？

官方地址：[https://arthas.aliyun.com/doc/quick-start.html](https://arthas.aliyun.com/doc/quick-start.html)

安装方式：如果速度较慢，可以尝试国内的码云Gitee下载。

```shell
wget https://io/arthas/arthas-boot.jar
wget https://arthas/gitee/io/arthas-boot.jar
```

Arthas只是一个java程序，所以可以直接用java -jar运行。

除了在命令行查看外，Arthas目前还支持 Web Console。在成功启动连接进程之后就已经自动启动,可以直接访问 http://127.0.0.1:8563/ 访问，页面上的操作模式和控制台完全一样。

**基础指令**

```shell
quit/exit 退出当前 Arthas客户端，其他 Arthas喜户端不受影响
stop/shutdown 关闭 Arthas服务端，所有 Arthas客户端全部退出
help 查看命令帮助信息
cat 打印文件内容，和linux里的cat命令类似
echo 打印参数，和linux里的echo命令类似
grep 匹配查找，和linux里的gep命令类似
tee 复制标隹输入到标准输出和指定的文件，和linux里的tee命令类似
pwd 返回当前的工作目录，和linux命令类似
cs 清空当前屏幕区域
session 查看当前会话的信息
reset 重置增强类，将被 Arthas增强过的类全部还原, Arthas服务端关闭时会重置所有增强过的类
version 输出当前目标Java进程所加载的 Arthas版本号
history 打印命令历史
keymap Arthas快捷键列表及自定义快捷键
```

**jvm相关**

```shell
dashboard 当前系统的实时数据面板
thread 查看当前JVM的线程堆栈信息
jvm 查看当前JVM的信息
sysprop 查看和修改JVM的系统属性
sysem 查看JVM的环境变量
vmoption 查看和修改JVM里诊断相关的option
perfcounter 查看当前JVM的 Perf Counter信息
logger 查看和修改logger
getstatic 查看类的静态属性
ognl 执行ognl表达式
mbean 查看 Mbean的信息
heapdump dump java heap，类似jmap命令的 heap dump功能
```

**class/classloader相关**

```shell
sc 查看JVM已加载的类信息
	-d 输出当前类的详细信息，包括这个类所加载的原始文件来源、类的声明、加载的Classloader等详细信息。如果一个类被多个Classloader所加载，则会出现多次
	-E 开启正则表达式匹配，默认为通配符匹配
	-f 输出当前类的成员变量信息（需要配合参数-d一起使用）
	-X 指定输出静态变量时属性的遍历深度，默认为0，即直接使用toString输出
sm 查看已加载类的方法信息
	-d 展示每个方法的详细信息
	-E 开启正则表达式匹配,默认为通配符匹配
jad 反编译指定已加载类的源码
mc 内存编译器，内存编译.java文件为.class文件
retransform 加载外部的.class文件, retransform到JVM里
redefine 加载外部的.class文件，redefine到JVM里
dump dump已加载类的byte code到特定目录
classloader 查看classloader的继承树，urts，类加载信息，使用classloader去getResource
	-t 查看classloader的继承树
	-l 按类加载实例查看统计信息
	-c 用classloader对应的hashcode来查看对应的 Jar urls
```

**monitor/watch/trace相关**

```
monitor 方法执行监控，调用次数、执行时间、失败率
	-c 统计周期，默认值为120秒
watch 方法执行观测，能观察到的范围为：返回值、抛出异常、入参，通过编写groovy表达式进行对应变量的查看
	-b 在方法调用之前观察(默认关闭)
	-e 在方法异常之后观察(默认关闭)
	-s 在方法返回之后观察(默认关闭)
	-f 在方法结束之后(正常返回和异常返回)观察(默认开启)
	-x 指定输岀结果的属性遍历深度,默认为0
trace 方法内部调用路径,并输出方法路径上的每个节点上耗时
	-n 执行次数限制
stack 输出当前方法被调用的调用路径
tt 方法执行数据的时空隧道,记录下指定方法每次调用的入参和返回信息,并能对这些不同的时间下调用进行观测
```

**其他**

```shell
jobs 列出所有job
kill 强制终止任务
fg 将暂停的任务拉到前台执行
bg 将暂停的任务放到后台执行
grep 搜索满足条件的结果
plaintext 将命令的结果去除ANSI颜色
wc 按行统计输出结果
options 查看或设置Arthas全局开关
profiler 使用async-profiler对应用采样，生成火焰图
```

## 3.7. Java Misssion Control

在Oracle收购Sun之前，Oracle的JRockit虚拟机提供了一款叫做 JRockit Mission Control 的虚拟机诊断工具。

在Oracle收购sun之后，Oracle公司同时拥有了Hotspot和 JRockit 两款虚拟机。根据Oracle对于Java的战略，在今后的发展中，会将JRokit的优秀特性移植到Hotspot上。其中一个重要的改进就是在Sun的JDK中加入了JRockit的支持。

在Oracle JDK 7u40之后，Mission Control这款工具己经绑定在Oracle JDK中发布。

自Java11开始，本节介绍的JFR己经开源。但在之前的Java版本，JFR属于Commercial Feature通过Java虚拟机参数-XX:+UnlockCommercialFeatures 开启。

Java Mission Control（简称JMC) ， Java官方提供的性能强劲的工具，是一个用于对 Java应用程序进行管理、监视、概要分析和故障排除的工具套件。它包含一个GUI客户端以及众多用来收集Java虚拟机性能数据的插件如 JMX Console（能够访问用来存放虚拟机齐个于系统运行数据的MXBeans）以及虚拟机内置的高效 profiling 工具 Java Flight Recorder（JFR）。

JMC的另一个优点就是：采用取样，而不是传统的代码植入技术，对应用性能的影响非常非常小，完全可以开着JMC来做压测（唯一影响可能是 full gc 多了）。 

 官方地址：[https://github.com/JDKMissionControl/jmc](https://github.com/JDKMissionControl/jmc)

![image-20210505184358041](https://static.lovedata.net/zs/20210505193559.png-wm)
**Java Flight Recorder**

Java Flight Recorder是JMC的其中一个组件，能够以极低的性能开销收集Java虚拟机的性能数据。与其他工具相比，JFR的性能开销很小，在默认配置下平均低于1%。JFR能够直接访问虚拟机内的敌据并且不会影响虚拟机的优化。因此它非常适用于生产环境下满负荷运行的Java程序。

Java Flight Recorder 和 JDK Mission Control共同创建了一个完整的工具链。JDK Mission Control 可对 Java Flight Recorder 连续收集低水平和详细的运行时信息进行高效、详细的分析。 

当启用时 JFR将记录运行过程中发生的一系列事件。其中包括Java层面的事件如线程事件、锁事件，以及Java虚拟机内部的事件，如新建对象，垃圾回收和即时编译事件。按照发生时机以及持续时间来划分，JFR的事件共有四种类型，它们分别为以下四种：

- 瞬时事件（Instant Event) ，用户关心的是它们发生与否，例如异常、线程启动事件。

- 持续事件(Duration Event) ，用户关心的是它们的持续时间，例如垃圾回收事件。


- 计时事件(Timed Event) ，是时长超出指定阈值的持续事件。

- 取样事件（Sample Event)，是周期性取样的事件。

取样事件的其中一个常见例子便是方法抽样（Method Sampling），即每隔一段时问统计各个线程的栈轨迹。如果在这些抽样取得的栈轨迹中存在一个反复出现的方法，那么我们可以推测该方法是热点方法 

![image-20210505185941373](https://static.lovedata.net/zs/20210505185942.png-wm)
![image-20210505185954567](https://static.lovedata.net/zs/20210505185955.png-wm)
![image-20210505190009274](https://static.lovedata.net/zs/20210505190010.png-wm)
![image-20210505190023099](https://static.lovedata.net/zs/20210505190024.png-wm)
![image-20210505190037354](https://static.lovedata.net/zs/20210505190038.png-wm)
![image-20210505190052561](https://static.lovedata.net/zs/20210505190053.png-wm)
![image-20210505190106004](https://static.lovedata.net/zs/20210505193710.png-wm)
## 3.8. 其他工具

**Flame Graphs（火焰图）**

在追求极致性能的场景下，了解你的程序运行过程中cpu在干什么很重要，火焰图就是一种非常直观的展示CPU在程序整个生命周期过程中时间分配的工具。火焰图对于现代的程序员不应该陌生，这个工具可以非常直观的显示出调用找中的CPU消耗瓶颈。

网上的关于Java火焰图的讲解大部分来自于Brenden Gregg的博客 [http://new.brendangregg.com/flamegraphs.html ](http://new.brendangregg.com/flamegraphs.html)

![image-20210505190823214](https://static.lovedata.net/zs/20210505190824.png-wm)
火焰图，简单通过x轴横条宽度来度量时间指标，y轴代表线程栈的层次。

**Tprofiler**

案例： 使用JDK自身提供的工具进行JVM调优可以将下 TPS 由2.5提升到20（提升了7倍），并准确 定位系统瓶颈。

系统瓶颈有：应用里释态对象不是太多、有大量的业务线程在频繁创建一些生命周期很长的临时对象，代码里有问题。

那么，如何在海量业务代码里边准确定位这些性能代码？这里使用阿里开源工具 Tprofiler 来定位 这些性能代码，成功解决掉了GC 过于频繁的性能瓶预，并最终在上次优化的基础上将 TPS 再提升了4倍，即提升到100。

- Tprofiler配置部署、远程操作、 日志阅谈都不太复杂，操作还是很简单的。但是其却是能够 起到一针见血、立竿见影的效果，帮我们解决了GC过于频繁的性能瓶预。
- Tprofiler最重要的特性就是能够统汁出你指定时间段内 JVM 的 top method 这些 top method 极有可能就是造成你 JVM 性能瓶颈的元凶。这是其他大多数 JVM 调优工具所不具备的，包括 JRockit Mission Control。JRokit 首席开发者 Marcus Hirt 在其私人博客《 Lom Overhead Method Profiling cith Java Mission Control》下的评论中曾明确指出  JRMC 井不支持 TOP 方法的统计。

官方地址：[http://github.com/alibaba/Tprofiler](http://github.com/alibaba/Tprofiler)

**Btrace**

常见的动态追踪工具有BTrace、HouseHD（该项目己经停止开发）、Greys-Anatomy（国人开发 个人开发者）、Byteman（JBoss出品），注意Java运行时追踪工具井不限干这几种，但是这几个是相对比较常用的。 

BTrace是SUN Kenai 云计算开发平台下的一个开源项目，旨在为java提供安全可靠的动态跟踪分析工具。先看一卜日Trace的官方定义： 

![image-20210505192042974](https://static.lovedata.net/zs/20210505192044.png-wm)
大概意思是一个 Java 平台的安全的动态追踪工具，可以用来动态地追踪一个运行的 Java 程序。BTrace动态调整目标应用程序的类以注入跟踪代码（“字节码跟踪“）。

**YourKit**

**JProbe**

**Spring Insight**