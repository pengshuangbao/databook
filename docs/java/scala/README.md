## Scala

[toc]

## 一、异步编程

###  java的Future和Scala的Future有何区别?

Jav a 也提供了 Future ，它跟 S ca l a 的 Futur e 非常不同 。 两种Future 都是用来表示某个异步计算的结果，但 Ja va 的 Future 要求通过阻塞的 ge t 方法来访问这个结果 。 虽然可以在调用 ge t 之前线调用 i sDone 来判断某个 Java 的 Future 是否已经完成，从而避免阻塞，你却必须等到 Java 的Future 完成之后才能继续用这个结果做进一步的计算

Scal a 的 Futur e 则不同 ， 不论计算是否完成 ， 你都可以指定对它的变换逻辑 。

每一个变换都产生新的 Future 来表示原始的 Future 经过给定的函数变换后产生的异步结果 



###  Future 使用

```scala
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.ExecutionContext.Implicits.global
scala> val fut= Future { Thread.sleep(lOOOO); 21 + 21}
fut: scala.concurrent.Future[Int]
```

完成

```scala
scala> fut.isCompleted
resO: Boolean = false
scala> fut.value
resl: Option[scala. util. Try[Int]] = None
```

未完成

```scala
scala> fut.isCompleted
resO: Boolean = false
scala> fut.value
resl: Option[scala. util. Try[Int]] = None
```



这里有一个展示了异步活动失败场景的例子 ：

```scala
scala> val fut= Future { Thread.sleep(lOOOO); 21 I 0}
fut: scala.concurrent.Future[Int] = .
scala> fut.value
res4: Option [seala. util. Try [Int]] = None
10 秒钟过后：
scala> fut .value
resS: Option[scala.util.Try[Int]] =
Some(Failure(java.lang.ArithmeticException: I by zero))
```

![image](https://static.lovedata.net/20-07-30-521674357264a6f13627ae3af9069150.png)