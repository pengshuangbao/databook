# java

[[toc]]

## 1. 内存溢出了怎么去定位？

[Java内存溢出定位和解决方案（new）](https://www.cnblogs.com/snowwhite/p/9471710.html "  ")

[Java 出现内存溢出的定位以及解决方案](https://www.cnblogs.com/zhchoutai/p/7270886.html "")


## 2. 线程间如何通讯

CountDownLatch 利用它可以实现类似计数器的功能。比如有一个任务A，它要等待其他4个任务执行完毕之后才能执行，此时就可以利用CountDownLatch来实现这种功能了。

CyclicBarrier 字面意思回环栅栏，通过它可以实现让**一组线程等待至某个状态之后**再全部同时执行。叫做回环是因为当所有等待线程都被释放以后，**CyclicBarrier可以被重用**。我们暂且把这个状态就叫做barrier，当调用await()方法之后，线程就处于barrier了
1）CountDownLatch和CyclicBarrier都能够实现线程之间的等待，只不过它们侧重点不同：

　　　　CountDownLatch一般用于某个线程A等待若干个其他线程执行完任务之后，它才执行；

　　　　而CyclicBarrier一般用于一组线程互相等待至某个状态，然后这一组线程再同时执行；

　　　　另外，CountDownLatch是不能够重用的，而CyclicBarrier是可以重用的。

2）Semaphore其实和锁有点类似，它一般用于控制对某组资源的访问权限。

[Java并发编程：CountDownLatch、CyclicBarrier和Semaphore](https://www.cnblogs.com/dolphin0520/p/3920397.html)

[Java 里如何实现线程间通信](http://www.importnew.com/26850.html)

[java线程间通信](https://blog.csdn.net/u011514810/article/details/77131296)




## 3. 进程间如何通讯 

[进程通讯（太过复杂）](https://www.cnblogs.com/LUO77/p/5816326.html)