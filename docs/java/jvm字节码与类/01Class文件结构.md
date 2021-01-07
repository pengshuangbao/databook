# 第一章、Class文件结构

[toc]

![image](https://static.lovedata.net/21-01-03-6a6300625544f18349132676935d5b18.png-wm)

## 概述

### 字节码文件的跨平台性

#### java语音：跨平台的语言

![image](https://static.lovedata.net/21-01-03-2f800b65ab97f52298e2504a1312ac1c.png-wm)

#### java虚拟机：跨语言的平台

![image](https://static.lovedata.net/21-01-03-fd787e3621e60d0808167dbba62e8171.png-wm)

![image](https://static.lovedata.net/21-01-03-5167ed0fc0810ef048fcdeef6fd733e2.png-wm)



![image](https://static.lovedata.net/21-01-03-e93a6414349ada7f42dae936a2df1075.png-wm)

![image](https://static.lovedata.net/21-01-03-3dc98d3f97f95e5cbd98ce70e7a0b3dc.png-wm)

![image](https://static.lovedata.net/21-01-03-6320f112f6d9666fdfc88248a84bf5de.png-wm)

### java的前端编译器

![image](https://static.lovedata.net/21-01-03-4aaa7aafe278291bdbdd21da3a60f14b.png-wm)

![image](https://static.lovedata.net/21-01-03-2c37595e9d9765ba04fa7e032ead8ec9.png-wm)

### 透过字节码指令看代码细节

![image](https://static.lovedata.net/21-01-03-551832759b5e190d7bed8c6a4cf87dfd.png-wm)

![image](https://static.lovedata.net/21-01-03-ef1cda5d13bcce2c226cf245de8c035d.png-wm)



![image](https://static.lovedata.net/21-01-03-493dc9a3b9ff3334c79b1f3a12acedaa.png-wm)



![image](https://static.lovedata.net/21-01-03-5e914c67ac2a6c6f98f93456c4dcf877.png-wm)

#### 成员变量（非静态的）的赋值过程：

 ① 默认初始化 

 ② 显式初始化 /代码块中初始化 -

③ 构造器中初始化 

 ④ 有了对象之后，可以“对象.属性”或"对象.方法"

 的方式对成员变量进行赋值。

![image](https://static.lovedata.net/21-01-03-6aa9c945d19858e3802afc9caae56847.png-wm)

## 虚拟机的基石:class文件

### 字节码文件是什么

![image](https://static.lovedata.net/21-01-03-1e22e72da69fb9475fc1eec57cfa4f28.png-wm)



### 什么事字节码指令

![image](https://static.lovedata.net/21-01-03-34fb292a60f0d9b4998483f61be567e7.png-wm)

![image](https://static.lovedata.net/21-01-03-9d3cf7be65110b65989f880a389a08dd.png-wm)

## Class文件结构

## class文件的本质

![image](https://static.lovedata.net/21-01-04-403eb4d5095ad023f3ced544a9b047c6.png-wm)

## class文件结构

![image](https://static.lovedata.net/21-01-04-9023e57459717c423a5d4594948b90a6.png-wm)

![image](https://static.lovedata.net/21-01-04-43a5e9416f3a8ec3b71dfab8690eaae8.png-wm)

![image](https://static.lovedata.net/21-01-04-8450e70f19d53af03164e5972381ae6d.png-wm)

![image](https://static.lovedata.net/21-01-04-8bf8c1d15f1380b7362d6979c730160c.png-wm)

[Chapter 4. The class File Format](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html)

![image](https://static.lovedata.net/21-01-04-049d195a42b46423f8d64c6ccc0432ff.png-wm)



### 使用excel展示字节码数据

```java
public class Demo {
    private int num = 1;

    public int add(){
        num = num + 2;
        return num;

    }
}
```

![image](https://static.lovedata.net/21-01-05-1d311f8b27dcd9ec29e5fe5c544a6ca9.png-wm)

### 魔数

![image](https://static.lovedata.net/21-01-05-2635d937687f68c841cd2b770bce4b82.png-wm)

### 版本号

![image](https://static.lovedata.net/21-01-05-70be54f9207ed29718fe9b175670b6dd.png-wm)

![image](https://static.lovedata.net/21-01-05-1990681b2000e434d3a6360f0e711360.png-wm)

#### 使用低版本的jdk运行高版本jdk编译的class文件

![image](https://static.lovedata.net/21-01-05-44575f5ddbb868dd007f1d9c87dcda97.png-wm)

### 常量池：存放所有常量

![image](https://static.lovedata.net/21-01-05-f94e26dae185a9a189f55c5083436eb8.png-wm)

![image](https://static.lovedata.net/21-01-05-4fa77f955394aeb04de436ace3d23016.png-wm)

#### 常量池计数器

![image](https://static.lovedata.net/21-01-05-982f0e10fdb60071ab52eecaf0c73686.png-wm)

#### 常量池

![image](https://static.lovedata.net/21-01-05-9250f633283e1e82b35eb381cdf110b1.png-wm)

![image](https://static.lovedata.net/21-01-05-4bf9d3ef9fe2b6d390178d6a8bf61053.png-wm)



### 字面量和符号引用

![image](https://static.lovedata.net/21-01-05-0faccd76d23befdde321045b72c2a380.png-wm)

![image](https://static.lovedata.net/21-01-05-40b78f1cc4fa9c52c0374883129f9130.png-wm)

![image](https://static.lovedata.net/21-01-05-5247b1306c1ad86f5af886061be6aba0.png-wm)

![image](https://static.lovedata.net/21-01-05-e05cdb2c45a9a7b2db5262811b7d2963.png-wm)

![image](https://static.lovedata.net/21-01-05-fa7e3daab468ccc5075707ae6d9e353b.png-wm)

![image](https://static.lovedata.net/21-01-05-5be80e22bbd87c9dd9c62138f69184dc.png-wm)

![image](https://static.lovedata.net/21-01-05-a0b1257239eb40ea08c1ba7cde8978d0.png-wm)

常量池已经加载到方法区中，成了运行时常量，具体的引用，动态链接指向具体的引用了。

![image](https://static.lovedata.net/21-01-05-3e31b620f78b7173e50c179c9e80e833.png-wm)

### 常量池常量解析

```java
package com.lovedata.bigdata.jvm;

public class Demo {
    private int num = 1;

    public int add(){
        num = num + 2;
        return num;

    }
}
```

![image](https://static.lovedata.net/21-01-07-1a430c84d89c085aab64286bc7f1efd8.png-wm)

![image](https://static.lovedata.net/21-01-07-3878c8cf8f25160cae846adca3d1c2df.png-wm)

![image](https://static.lovedata.net/21-01-07-d57a3ddbdadcd40b7b063f7d3b622745.png-wm)

![image](https://static.lovedata.net/21-01-07-34a004d6eb562c8885cba7139ecdf03b.png-wm)



### 常量池总结

总结1

![image](https://static.lovedata.net/21-01-07-37a2cdbea3571472bc89b333c758ce07.png-wm)

总结2

![image](https://static.lovedata.net/21-01-07-2ffbb542ec4711b778944e600c852dd7.png-wm)



## 使用javap指令解析class文件

### javap的用法

### 使用举例

### 总结