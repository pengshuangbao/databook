

# java

[toc]

## 架构

### JVM架构

![image](https://static.lovedata.net/20-11-17-044cf0d9b97f77d6cdd803486d68119e.png-wm)

### YGC过程

![image](https://static.lovedata.net/20-11-17-a9dff8adcf7b43db91c7b42e6e506a75.png-wm)



### 方法区演进

![image](https://static.lovedata.net/20-11-17-d9b5fc39f9efb516d20a168aa74f77e3.png-wm)

## 命令

### 堆内存快找Dump

```shell
jmap -dump:live,format=b,file=xxxx.hprof pid
```



#### 查看JVM内存信息 jmap

```shell
jmap -heap pid
```





