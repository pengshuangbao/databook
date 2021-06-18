# Java

[toc]

## JVM

### 内存溢出的时候生成Dump文件

给 JVM 环境参数设置-XX:+HeapDumpOnOutOfMemoryError 参数，让 JVM 碰到 OOM场景时输出 dump 信息

```shell
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=path
```

### Jstat

#### gcutil

```shell
jstat -gcutil pid 1000 100
```



### Jmap

#### 生成Dump文件jmap

```shell
jmap -dump:live,format=b,file=xxxx.hprof pid
```

#### 查看JVM内存信息 jmap

```shell
jmap -heap pid
```



### Jstack

#### 生成线程dump

```shell
jstack pid > thread.dump
# 输出各种状态的统计
grep java.lang.Thread.State thread.dump | awk '{print$2$3$4$5}'|uniq -c
```



#### 根据线程id去搜索

```shell
# 查看进程的所有线程 按P按照CPU来排序
top -Hp pid
# 打印出十六进制
printf "%x\n" 1208
# 有颜色输出
jstack 1205 | grep '4b8' -C5 --color
```



## Tomcat

### tomcat 新增jvm参数

```shell
vim /usr/local/apache-tomcat-8.5.12/bin/catalina.sh
```

![image](https://static.lovedata.net/20-12-28-586872716c786d567f1c7de48fb452d6.png-wm)



## 实战

### Java程序CPU100%,快速定位排查

- top -c 显示进程运行信息列表 键入P(大写p)，线程按照CPU使用率排序
- top -Hp 10765 显示一个进程的线程运行信息列表(线程肯定是归属于某一个进程的) 键入P(大写p)，线程按照CPU使用率排序
- 将线程PID转化为16进制 printf "%x\n" 10804
- 使用 jstack 工具 jstack 10765 | grep '0x2a34' -C5 --color

参考

- [线上服务CPU100%问题快速定位实战](http://www.cnblogs.com/winner-0715/p/7521638.html)
- [线上服务 CPU 100%？一键定位 so easy！](https://my.oschina.net/leejun2005/blog/1524687)



