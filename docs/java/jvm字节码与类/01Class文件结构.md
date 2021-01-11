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



#### 字面量和符号引用

![image](https://static.lovedata.net/21-01-05-0faccd76d23befdde321045b72c2a380.png-wm)

![image](https://static.lovedata.net/21-01-05-40b78f1cc4fa9c52c0374883129f9130.png-wm)

![image](https://static.lovedata.net/21-01-05-5247b1306c1ad86f5af886061be6aba0.png-wm)

![image](https://static.lovedata.net/21-01-05-e05cdb2c45a9a7b2db5262811b7d2963.png-wm)

![image](https://static.lovedata.net/21-01-05-fa7e3daab468ccc5075707ae6d9e353b.png-wm)

![image](https://static.lovedata.net/21-01-05-5be80e22bbd87c9dd9c62138f69184dc.png-wm)

![image](https://static.lovedata.net/21-01-05-a0b1257239eb40ea08c1ba7cde8978d0.png-wm)

常量池已经加载到方法区中，成了运行时常量，具体的引用，动态链接指向具体的引用了。

![image](https://static.lovedata.net/21-01-05-3e31b620f78b7173e50c179c9e80e833.png-wm)

#### 常量池常量解析

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



#### 常量池总结

总结1

![image](https://static.lovedata.net/21-01-07-37a2cdbea3571472bc89b333c758ce07.png-wm)

总结2

![image](https://static.lovedata.net/21-01-07-2ffbb542ec4711b778944e600c852dd7.png-wm)



### 访问标识

![image](https://static.lovedata.net/21-01-08-12c9aae7288b84cec8a7809bff8096b8.png-wm)



![image](https://static.lovedata.net/21-01-08-11ab37570e9e7d0978fb7d7429dfe9b1.png-wm)

![image](https://static.lovedata.net/21-01-08-23318e9bf0709a68cdfa9c80fd676105.png-wm)

#### 补充说明

![image](https://static.lovedata.net/21-01-08-455f2af30b6fdf9bccbdaccd39206331.png-wm)



### 类索引、父类索引、接口索引集合

![image](https://static.lovedata.net/21-01-08-b5eb407e5d6848c7e51a13e17617f225.png-wm)

![image](https://static.lovedata.net/21-01-08-88236478d51c6667efe29dbda828d5f7.png-wm)

### 字段表集合

![image](https://static.lovedata.net/21-01-08-e11443e0ae905fd303f1ebeba9ca6fc0.png-wm)



#### fields_count 字段计数器

![image](https://static.lovedata.net/21-01-08-1224575c070eaac806c5b21ae8298251.png-wm)

#### fields[] 字段表

![image](https://static.lovedata.net/21-01-08-3d70b297e17bfaf5d05cc597ff16a766.png-wm)

##### 字段表访问标识

![image](https://static.lovedata.net/21-01-08-37cfdeb1e1897c93877175801863e2bc.png-wm)

##### 字段名索引

![image](https://static.lovedata.net/21-01-08-06995beb140c87306ad440fce56fc2e7.png-wm)

##### 描述符索引

![image](https://static.lovedata.net/21-01-08-4af8ac6f120a72a5b1f2ca6fe7686f49.png-wm)

![image](https://static.lovedata.net/21-01-08-054e30960af2a4a9c471d0c2d2b55630.png-wm)

##### 属性表集合

![image](https://static.lovedata.net/21-01-08-769bc8484afd5fcf84698d7aa84d63f3.png-wm)



![image](https://static.lovedata.net/21-01-08-6f063cb4f0306671eeef334ee85f3a0e.png-wm)



### 方法表集合

![image](https://static.lovedata.net/21-01-09-0e5b7209e8c8d60187f86ee893faeb9c.png-wm)

![image](https://static.lovedata.net/21-01-09-5991e72949c264c8a5cd14f58b0a5bc9.png-wm)

#### 

#### 方法计数器

![image](https://static.lovedata.net/21-01-09-879fc24c2515e6e274e47696b14fdbc3.png-wm)

#### 方法表

![image](https://static.lovedata.net/21-01-09-4410438cc0dde99730830b1c82c9d900.png-wm)

![image](https://static.lovedata.net/21-01-09-7ff17d19e041b586ca4e57cc7ea7dfce.png-wm)

### 属性表集合

![image](https://static.lovedata.net/21-01-09-43629a77113899ea6e5754e5386025ca.png-wm)

#### 属性计数器

![image](https://static.lovedata.net/21-01-09-16f9d3b0ebf460acf7dd46a0c096e570.png-wm)

#### 属性表

![image](https://static.lovedata.net/21-01-09-6df7c9f96ffed2b2bd98c00e3ceff997.png-wm)

![image](https://static.lovedata.net/21-01-09-c7102478cd180b9667276744fa24479b.png-wm)

![image](https://static.lovedata.net/21-01-09-8c1e44ca56893a0b738412088ebb6410.png-wm)

![image](https://static.lovedata.net/21-01-09-673aea3f6ba0c3ef60c543ad51018624.png-wm)

![image](https://static.lovedata.net/21-01-09-c207fab428745bc1f2fc9ba6bb569727.png-wm)

![image](https://static.lovedata.net/21-01-09-d6a30f9611e12881eddfc74534653396.png-wm)

![image](https://static.lovedata.net/21-01-09-e08fa9bf65121d1ac08b2ce00bd52109.png-wm)

![image](https://static.lovedata.net/21-01-09-22ba18541749f29c53466031fd3d23f9.png-wm)

![image](https://static.lovedata.net/21-01-09-a424bad6a1433b38b45104c9bdbf7c5d.png-wm)

![image](https://static.lovedata.net/21-01-09-69257a817f16d7fcc1076c7623aec699.png-wm)

![image](https://static.lovedata.net/21-01-09-7df5f4cd48d3df4bd27f46d39749225e.png-wm)

![image](https://static.lovedata.net/21-01-09-87f68b2f80f44d4ba368c0e6e3c71840.png-wm)

![image](https://static.lovedata.net/21-01-09-4e3074d46513cab21160a92a0eb32a4e.png-wm)

![image](https://static.lovedata.net/21-01-09-3013f85a9dfd93483e64a5fcb2bef812.png-wm)

![image](https://static.lovedata.net/21-01-09-5cc4b0d309f63e992cc4781c08ae3ca6.png-wm)

## 使用javap指令解析class文件

### 解析字节码的作用

![image](https://static.lovedata.net/21-01-10-9604673158bd16758b18bbdae9d65b24.png-wm)

### Java -g 操作

![image](https://static.lovedata.net/21-01-10-b39fece3b903afbd6c571d19342f20e4.png-wm)

![image](https://static.lovedata.net/21-01-10-8964e383f650407efa46bdeedf05db78.png-wm)

### javap的用法

![image](https://static.lovedata.net/21-01-10-034f94774b278d4fabbd3ac61a372929.png-wm)

![image](https://static.lovedata.net/21-01-10-f4ba089f44aee525c04767eb00f26749.png-wm)

```java
package com.atguigu.java1;

public class JavapTest {
    private int num;
    boolean flag;
    protected char gender;
    public String info;

    public static final int COUNTS = 1;
    static{
        String url = "www.atguigu.com";
    }
    {
        info = "java";
    }
    public JavapTest(){

    }
    private JavapTest(boolean flag){
        this.flag = flag;
    }
    private void methodPrivate(){

    }
    int getNum(int i){
        return num + i;
    }
    protected char showGender(){
        return gender;
    }
    public void showInfo(){
        int i = 10;
        System.out.println(info + i);
    }
}

```



![image](https://static.lovedata.net/21-01-10-b8938e3068ff91835a18c892b2c11af8.png-wm)

![image](https://static.lovedata.net/21-01-10-62e861361fc9a5c43ef342c111c1139f.png-wm)



![image](https://static.lovedata.net/21-01-10-c3f26d33c087cbbae036cb32744fbeb6.png-wm)



![image](https://static.lovedata.net/21-01-10-c19d05e8858cbe11d5187f5dd783c3d8.png-wm)

![image](https://static.lovedata.net/21-01-10-2df2ca5186ecf408156d635171d2171d.png-wm)

![image](https://static.lovedata.net/21-01-10-f9ee4234d051c4a160c3235e3aa6d222.png-wm)

![image](https://static.lovedata.net/21-01-10-aa6fb3b583953dae6f0c90fee821fafd.png-wm)

![image](https://static.lovedata.net/21-01-10-c5cbe577b971d22d7e36cda3ee20b671.png-wm)



![image](https://static.lovedata.net/21-01-10-6da3b62686a8af007ffe487c716e7e29.png-wm)

![image](https://static.lovedata.net/21-01-10-118456b1e51b01f3cf82bb88d82643d5.png-wm)

#### javap -c 和 javap -v的对比

![image](https://static.lovedata.net/21-01-10-053a36932daa3896f15b8fa621ee40d6.png-wm)

#### -v -l -c 的区别

![image](https://static.lovedata.net/21-01-10-6fc8592bceef5981c3084a2a29d3ca39.png-wm)

#### 使用javap -v -p JavapTest.class 输出所有方法包括私有方法的详细信息

### 使用举例

### 总结

![image](https://static.lovedata.net/21-01-10-48e39458f6cec617697018a62f51494b.png-wm)