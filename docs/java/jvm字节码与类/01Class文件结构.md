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









## 使用javap指令解析class文件

### javap的用法

### 使用举例

### 总结