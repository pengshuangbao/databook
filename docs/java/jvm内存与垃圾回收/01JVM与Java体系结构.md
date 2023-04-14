# 第一章、JVM与Java体系结构

[toc]

## JVM所处的位置

![image](https://static.lovedata.net/20-11-08-515e0fbe2aa525b7861e3c837874abfc.png)

## JDK构成

![image](https://static.lovedata.net/20-11-08-0aa7fa5a5b4f691f142c87db5c4e7bf9.png)

javac 前端编译器，是把java文件

还有一个后端编译器，这个是将java指令编译为机器指令的的过程

## JVM的整体结构

![image](https://static.lovedata.net/20-11-08-5727a50d2e3c4c8e8f00ae903cfb078e.png)

![image](https://static.lovedata.net/20-11-08-1f1723f4fedeb90bab21f8c81a7c6cfa.png)



执行引擎。  把类加载到内存中去了之后，下一步，解释运行了，就用到了解释器 ，如果只用解释器，可能性能差一点，所以对于反复执行的代码，需要提前编译起来，就用到了 即时编译器

> 这个编译器不同于前面javac的那个编译器，那个是前端编译器，这个是后端编译器

还有一个垃圾回收器。 

操作系统： 只能够识别机器指令，字节码不等同于机器指令。 需要执行引擎，充当一个高级语言和机器语言的翻译者

![image](https://static.lovedata.net/20-11-08-8ceb134c94fdf0c49fdd1dfe53fd5ce2.png)



## Java代码的执行流程

![image](https://static.lovedata.net/20-11-08-9583d67ffab38e5ce486e43057864f4e.png)

![image](https://static.lovedata.net/20-11-08-07273db5306a5fb062f8dd4218b97a62.png)



## JVM的架构模型

Java编译器输入的指令流基本上是一种基于<mark>栈的指令集架构</mark>，另外一种指令集架构则是基于<mark>寄存器的指令集架构</mark>。

具体来说：这两种架构之间的区别：

**基于栈式架构的特点**

- 设计和实现更简单，适用于资源受限的系统
- 避开了寄存器的分配难题：使用零地址指令方式分配
- 指令流中的指令大部分是零地址指令，其执行过程依赖于操作栈。指令集更小，编译器容易实现
- 不需要硬件支持，可移植性更好，更好实现跨平台

**基于寄存器架构的特点**

- 典型的应用是x86的二进制指令集：比如传统的PC以及Android的Davlik虚拟机
- 指令集架构则完全依赖硬件，可移植性差
- 性能优秀和执行更高效
- 花费更少的指令去完成一项操作
- 在大部分情况下，基于寄存器架构的指令集往往都以一地址指令、二地址指令和三地址指令为主，而基于栈式架构的指令集却是以零地址指令为主

**举例1**

同样执行2+3这种逻辑操作，其指令分别如下：

基于栈的计算流程（以Java虚拟机为例）：

```java
iconst_2 //常量2入栈
istore_1
iconst_3 // 常量3入栈
istore_2
iload_1
iload_2
iadd //常量2/3出栈，执行相加
istore_0 // 结果5入栈
```

而基于寄存器的计算流程

```java
mov eax,2 //将eax寄存器的值设为1
add eax,3 //使eax寄存器的值加3
```

**举例2**

```java
public int calc(){
    int a=100;
    int b=200;
    int c=300;
    return (a + b) * c;
}
```

```java
> javap -c Test.class
...
public int calc();
    Code:
    Stack=2,Locals=4,Args_size=1
       0: bipush        100
       2: istore_1
       3: sipush        200
       6: istore_2
       7: sipush        300
      10: istore_3
      11: iload_1
      12: iload_2
      13: iadd
      14: iload_3
      15: imul
      16: ireturn
}
```

**总结**

<mark>由于跨平台性的设计，Java的指令都是根据栈来设计的。</mark>不同平台CPU架构不同，所以不能设计为基于寄存器的。优点是跨平台，指令集小，编译器容易实现，缺点是性能下降，实现同样的功能需要更多的指令。

时至今日，尽管嵌入式平台已经不是Java程序的主流运行平台了（准确来说应该是HotSpotVM的宿主环境已经不局限于嵌入式平台了），那么为什么不将架构更换为基于寄存器的架构呢？

![image](https://static.lovedata.net/20-11-08-bfe554e99e1b3c07ec2cf7182ee1fab0.png)

### 举例：

![image](https://static.lovedata.net/20-11-08-77f15e3c29a7bec43e77b1df31fbe681.png)

![image](https://static.lovedata.net/20-11-08-25d0d6f7689a955d0e2de240ba2aebd2.png)



![image](https://static.lovedata.net/20-11-08-bdb8332efb1e9afcfdf23eee9b4d8672.png)



![image](https://static.lovedata.net/20-11-08-9d276f4c9384bd6b9357316ca9458955.png)



## JVM的生命周期



**虚拟机的启动**

Java虚拟机的启动是通过引导类加载器（bootstrap class loader）创建一个初始类（initial class）来完成的，这个类是由虚拟机的具体实现指定的。

**虚拟机的执行**

- 一个运行中的Java虚拟机有着一个清晰的任务：执行Java程序。
- 程序开始执行时他才运行，程序结束时他就停止。
- <mark>执行一个所谓的Java程序的时候，真真正正在执行的是一个叫做Java虚拟机的进程。</mark>

**虚拟机的退出**

有如下的几种情况：

- 程序正常执行结束
- 程序在执行过程中遇到了异常或错误而异常终止
- 由于操作系统用现错误而导致Java虚拟机进程终止
- 某线程调用Runtime类或system类的exit方法，或Runtime类的halt方法，并且Java安全管理器也允许这次exit或halt操作。
- 除此之外，JNI（Java Native Interface）规范描述了用JNI Invocation API来加载或卸载 Java虚拟机时，Java虚拟机的退出情况。



## X. JVM的发展历程

### Sun Classic VM

- 早在1996年Java1.0版本的时候，Sun公司发布了一款名为sun classic VM的Java虚拟机，它同时也是<mark>世界上第一款商用Java虚拟机</mark>，JDK1.4时完全被淘汰。
- 这款虚拟机内部只提供解释器。现在还有及时编译器，因此效率比较低，而及时编译器会把热点代码缓存起来，那么以后使用热点代码的时候，效率就比较高。
-  如果使用JIT编译器，就需要进行外挂。但是一旦使用了JIT编译器，JIT就会接管虚拟机的执行系统。解释器就不再工作。解释器和编译器不能配合工作。
- 现在hotspot内置了此虚拟机。

### Exact VM

- 为了解决上一个虚拟机问题，jdk1.2时，Sun提供了此虚拟机。 
- Exact Memory Management：准确式内存管理
  - 也可以叫Non-Conservative/Accurate Memory Management
  - 虚拟机可以知道内存中某个位置的数据具体是什么类型。
- 具备现代高性能虚拟机的维形
  - 热点探测
  - 编译器与解释器混合工作模式
- 只在solaris平台短暂使用，其他平台上还是classic vm
  - 英雄气短，终被Hotspot虚拟机替换

### HotSpot VM

- HotSpot历史
  - 最初由一家名为“Longview Technologies”的小公司设计
  - 1997年，此公司被sun收购；2009年，Sun公司被甲骨文收购。
  - JDK1.3时，HotSpot VM成为默认虚拟机
- <mark>目前Hotspot占有绝对的市场地位，称霸武林。</mark>
  - 不管是现在仍在广泛使用的JDK6，还是使用比例较多的JDK8中，默认的虚拟机都是HotSpot
  - Sun / Oracle JDK 和 OpenJDK 的默认虚拟机
  - 因此本课程中默认介绍的虚拟机都是HotSpot，相关机制也主要是指HotSpot的Gc机制。（比如其他两个商用虚机都没有方法区的概念）
- 从服务器、桌面到移动端、嵌入式都有应用。
- 名称中的HotSpot指的就是它的热点代码探测技术。
  - 通过计数器找到最具编译价值代码，触发即时编译或栈上替换
  - 通过编译器与解释器协同工作，在最优化的程序响应时间与最佳执行性能中取得平衡

### JRockit

- <mark>专注于服务器端应用</mark>
  - 它可以不太关注程序启动速度，因此JRockit内部不包含解析器实现，全部代码都靠即时编译器编译后执行。
  
- 大量的行业基准测试显示，<mark>JRockit JVM是世界上最快的JVM。</mark>

  - 使用JRockit产品，客户已经体验到了显著的性能提高（一些超过了70%）和硬件成本的减少（达50%）。

- 优势：全面的Java运行时解决方案组合

  - JRockit面向延迟敏感型应用的解决方案JRockit Real Time提供以毫秒或微秒级的JVM响应时间，适合财务、军事指挥、电信网络的需要
  - MissionControl服务套件，它是一组以极低的开销来监控、管理和分析生产环境中的应用程序的工具。

- 2008年，JRockit被oracle收购。

- Oracle表达了整合两大优秀虚拟机的工作，大致在JDK8中完成。整合的方式是在HotSpot的基础上，移植JRockit的优秀特性。

- 高斯林：目前就职于谷歌，研究人工智能和水下机器人

### IBM的J9

- 全称：IBM Technology for Java Virtual Machine，简称IT4J，内部代号：J9

- 市场定位与HotSpot接近，服务器端、桌面应用、嵌入式等多用途VM
- 广泛用于IBM的各种Java产品。
- 目前，有影响力的三大商用虚拟机之一，也号称是世界上最快的Java虚拟机。

- 2017年左右，IBM发布了开源J9VM，命名为openJ9，交给EClipse基金会管理，也称为Eclipse OpenJ9

### KVM和CDC / CLDC Hotspot

- Oracle在Java ME产品线上的两款虚拟机为：CDC/CLDC HotSpot Implementation VM 
- KVM（Kilobyte）是CLDC-HI早期产品
- 目前移动领域地位尴尬，智能机被Android和iOS二分天下。
- KVM简单、轻量、高度可移植，面向更低端的设备上还维持自己的一片市场

  - 智能控制器、传感器
  - 老人手机、经济欠发达地区的功能手机
- 所有的虚拟机的原则：一次编译，到处运行。


### Azul VM

- 前面三大“高性能Java虚拟机”使用在通用硬件平台上这里Azul VW和BEA Liquid VM是<mark>与特定硬件平台绑定、软硬件配合的专有虚拟机</mark>

  - 高性能Java虚拟机中的战斗机。

- Azul VM是Azul Systems公司在HotSpot基础上进行大量改进，运行于Azul Systems公司的专有硬件Vega系统上的Java虚拟机。

- <mark>每个Azul VM实例都可以管理至少数十个CPU和数百GB内存的硬件资源，并提供在巨大内存范围内实现可控的GC时间的垃圾收集器、专有硬件优化的线程调度等优秀特性。</mark>

- 2010年，AzulSystems公司开始从硬件转向软件，发布了自己的Zing JVM，可以在通用x86平台上提供接近于Vega系统的特性。

### Liquid VM

- 高性能Java虚拟机中的战斗机。

- BEA公司开发的，直接运行在自家Hypervisor系统上
- Liquid VM即是现在的JRockit VE（Virtual Edition），<mark>Liquid VM不需要操作系统的支持，或者说它自己本身实现了一个专用操作系统的必要功能，如线程调度、文件系统、网络支持等。</mark>
- 随着JRockit虚拟机终止开发，Liquid vM项目也停止了。


### Apache Harmony

- Apache也曾经推出过与JDK1.5和JDK1.6兼容的Java运行平台Apache Harmony。

- 它是IBM和Intel联合开发的开源JVM，受到同样开源的OpenJDK的压制，Sun坚决不让Harmony获得JCP认证，最终于2011年退役，IBM转而参与OpenJDK

- 虽然目前并没有Apache Harmony被大规模商用的案例，但是它的Java类库代码吸纳进了Android SDK。


### Micorsoft JVM

- 微软为了在IE3浏览器中支持Java Applets，开发了Microsoft JVM。

- 只能在Windows平台下运行。但确是当时Windows下性能最好的Java VM。

- 1997年，Sun以侵犯商标、不正当竞争罪名指控微软成功，赔了Sun很多钱。微软WindowsXP SP3中抹掉了其VM。现在Windows上安装的jdk都是HotSpot。

### Taobao JVM

- 由AliJVM团队发布。阿里，国内使用Java最强大的公司，覆盖云计算、金融、物流、电商等众多领域，需要解决高并发、高可用、分布式的复合问题。有大量的开源产品。

- <mark>基于OpenJDK 开发了自己的定制版本AlibabaJDK</mark>，简称AJDK。是整个阿里Java体系的基石。
- 基于OpenJDK Hotspot VM发布的国内第一个优化、<mark>深度定制且开源的高性能服务器版Java虚拟机</mark>。

  - 创新的GCIH（GC invisible heap）技术实现了off-heap，<mark>即将生命周期较长的Java对象从heap中移到heap之外，并且GC不能管理GCIH内部的Java对象，以此达到降低GC的回收频率和提升GC的回收效率的目的。</mark>
  - GCIH中的<mark>对象还能够在多个Java虚拟机进程中实现共享</mark>
  - 使用crc32指令实现JVM intrinsic 降低JNI 的调用开销
  - PMU hardware 的Java profiling tool 和诊断协助功能
  - 针对大数据场景的ZenGc

- taobao vm应用在阿里产品上性能高，硬件严重依赖intel的cpu，损失了兼容性，但提高了性能

  - 目前已经在淘宝、天猫上线，把oracle官方JvM版本全部替换了。


### Dalvik VM

- 谷歌开发的，应用于Android系统，并在Android2.2中提供了JIT，发展迅猛。

- Dalvik VM只能称作虚拟机，而不能称作“Java虚拟机”，它没有遵循 Java虚拟机规范，不能直接执行Java的Class文件

- 基于寄存器架构，不是jvm的栈架构。

- 执行的是编译以后的dex（Dalvik Executable）文件。执行效率比较高。

  - 它执行的dex（Dalvik Executable）文件可以通过class文件转化而来，使用Java语法编写应用程序，可以直接使用大部分的Java API等。

- Android 5.0使用支持提前编译（Ahead of Time Compilation，AoT）的ART VM替换Dalvik VM。


### Graal VM

- 2018年4月，oracle Labs公开了Graal VM，号称 "Run Programs Faster Anywhere"，野心勃勃。与1995年java的”write once，run anywhere"遥相呼应。
- Graal VM在HotSpot VM基础上增强而成的跨语言全栈虚拟机，可以作为“任何语言” 的运行平台使用。语言包括：Java、Scala、Groovy、Kotlin；C、C++、Javascript、Ruby、Python、R等

- 支持不同语言中混用对方的接口和对象，支持这些语言使用已经编写好的本地库文件

- 工作原理是将这些语言的源代码或源代码编译后的中间格式，通过解释器转换为能被Graal VM接受的中间表示。Graal VM提供Truffle工具集快速构建面向一种新语言的解释器。在运行时还能进行即时编译优化，获得比原生编译器更优秀的执行效率。

- 如果说HotSpot有一天真的被取代，Graal VM希望最大。但是Java的软件生态没有丝毫变化。


### 总结

具体JVM的内存结构，其实取决于其实现，不同厂商的JVM，或者同一厂商发布的不同版本，都有可能存在一定差异。主要以Oracle HotSpot VM为默认虚拟机。



