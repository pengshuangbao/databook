# 第一章、JVM与Java体系结构

[toc]

## JVM所处的位置

![image](https://static.lovedata.net/20-11-08-515e0fbe2aa525b7861e3c837874abfc.png-wm)

## JDK构成

![image](https://static.lovedata.net/20-11-08-0aa7fa5a5b4f691f142c87db5c4e7bf9.png-wm)

javac 前端编译器，是把java文件

还有一个后端编译器，这个是将java指令编译为机器指令的的过程

## JVM的整体结构

![image](https://static.lovedata.net/20-11-08-5727a50d2e3c4c8e8f00ae903cfb078e.png-wm)

![image](https://static.lovedata.net/20-11-08-1f1723f4fedeb90bab21f8c81a7c6cfa.png-wm)



执行引擎。  把类加载到内存中去了之后，下一步，解释运行了，就用到了解释器 ，如果只用解释器，可能性能差一点，所以对于反复执行的代码，需要提前编译起来，就用到了 即时编译器

> 这个编译器不同于前面javac的那个编译器，那个是前端编译器，这个是后端编译器

还有一个垃圾回收器。 

操作系统： 只能够识别机器指令，字节码不等同于机器指令。 需要执行引擎，充当一个高级语言和机器语言的翻译者

![image](https://static.lovedata.net/20-11-08-8ceb134c94fdf0c49fdd1dfe53fd5ce2.png-wm)



## Java代码的执行流程

![image](https://static.lovedata.net/20-11-08-9583d67ffab38e5ce486e43057864f4e.png-wm)

![image](https://static.lovedata.net/20-11-08-07273db5306a5fb062f8dd4218b97a62.png-wm)



## JVM的架构模型

![image](https://static.lovedata.net/20-11-08-d96d4d7789140b67717e156ec9ab0ed5.png-wm)

![image](https://static.lovedata.net/20-11-08-bfe554e99e1b3c07ec2cf7182ee1fab0.png-wm)

### 举例：

![image](https://static.lovedata.net/20-11-08-77f15e3c29a7bec43e77b1df31fbe681.png-wm)

![image](https://static.lovedata.net/20-11-08-25d0d6f7689a955d0e2de240ba2aebd2.png-wm)



![image](https://static.lovedata.net/20-11-08-bdb8332efb1e9afcfdf23eee9b4d8672.png-wm)



![image](https://static.lovedata.net/20-11-08-9d276f4c9384bd6b9357316ca9458955.png-wm)



## JVM的生命周期



### 启动

![image](https://static.lovedata.net/20-11-08-9c1ea56cc29257f4180fbe40b6b96821.png-wm)

### 执行

![image](https://static.lovedata.net/20-11-08-043164fbe30b073c07fa8caf1ccc1bb2.png-wm)

### 退出

![image](https://static.lovedata.net/20-11-08-9bdb00125baf04329e03f405d008af22.png-wm)

