# 运维

[toc]

## 性能工具图

![image](https://static.lovedata.net/20-11-11-7ceebb617ce3ee156789b652255df844.png-wm)



## 基本

### 查看机器配置

```shelll
lscpu
```

### 查看内存大小

```shell
free -m
```

### 硬盘大小

```shell
lsblk
```

### ssh-copy-id远程登录

```shell
#生成公钥
ssh-keygen  
#用ssh-copy-id将公钥复制到远程机器中
ssh-copy-id -i .ssh/id_rsa.pub  root@192.168.x.xxx
#登录到远程机器不用输入密码
ssh root@192.168.x.xxx
```

### 新建软连接

```shell
ln -s source link
```



### find

#### find 命令找到大于100M文件  

```shell
find . -size +100M
```

### sed

[如何使用 sed 命令删除文件中的行](https://juejin.cn/post/6844903926756704269)



## 磁盘

### du

####  查看某个目录 大小

```shell
du -bsh /usr/
```

#### 查看当前目录下各个文件占用情况

```shell
du -ah --max-depth=1 .
```

#### 按照MB来显示单位并排序

```shell
du -ahm --max-depth=1  ./|sort -n
```

#### 查看文件夹占用(查看根目录下所有文件的大小)

```shell
du -sm /*
```



## 网络

#### 查看监听端口

```shell
netstat -atunlp | grep LISTEN
```

#### 查看 某一个端口的占用情况

```shell
netstat -atunlp | grep 2181 | awk '{ print $5" : "$7 }' | sort | uniq -c
```

## CPU

### 查看当前系统的 NUMA Node

```shell
numactl --hardware
```

```bash
available: 2 nodes (0-1)
node 0 cpus: 0 2 4 6 8 10 12 14 16 18 20 22 24 26 28 30 32 34 36 38
node 0 size: 65442 MB
node 0 free: 294 MB
node 1 cpus: 1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31 33 35 37 39
node 1 size: 65536 MB
node 1 free: 4251 MB
node distances:
node   0   1
  0:  10  21
  1:  21  10
```

### 查看Socket信息

> 一个Socket对应主板上面的一个插槽，也指一个CPU封装，在/proc/cpuinfo中，physical id就是Socket的ID

```shell
cat /proc/cpuinfo | grep "physical id"
```

```bash
physical id	: 0
physical id	: 1
physical id	: 0
physical id	: 1
#...后面省略了36行，都是0，1
```

### 查看有几个Socket

```shell
grep 'physical id' /proc/cpuinfo | awk -F: '{print $2 | "sort -un"}'
```

```bash
 0
 1
```

### 查看每个 Socket 有几个 Processor

```shell
grep 'physical id' /proc/cpuinfo | awk -F: '{print $2}' | sort | uniq -c
```

```bash
 20  0
 20  1
```

查看Socket对应哪些Processor

```shell
awk -F: '{ 
    if ($1 ~ /processor/) {
        gsub(/ /,"",$2);
        p_id=$2;
    } else if ($1 ~ /physical id/){
        gsub(/ /,"",$2);
        s_id=$2;
        arr[s_id]=arr[s_id] " " p_id
    }
} 

END{
    for (i in arr) 
        print arr[i];
}' /proc/cpuinfo | cut -c2-
```

```bash
0 2 4 6 8 10 12 14 16 18 20 22 24 26 28 30 32 34 36 38
1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31 33 35 37 39
```



### 在 /proc/cpuinfo 中查看 Core 信息

> 表明一个Socket有10个Core，他们的id分别是 0,1,10,11,12,2,3,4,8,9
>
> 前面的查到机器有2个socket，所以总共有20个Core，每个Core有两个Processor，总共四十个

```shell
cat /proc/cpuinfo |grep "core id" | sort -u
```

```bash
core id		: 0
core id		: 1
core id		: 10
core id		: 11
core id		: 12
core id		: 2
core id		: 3
core id		: 4
core id		: 8
core id		: 9
cpu cores	: 10
```

### 获取总的 Processor 数

```shell
cat /proc/cpuinfo | grep "processor" | wc -l
```

```bash
40
```

### 获取每个 Socket 的 Processor 数

```shell
cat /proc/cpuinfo | grep "siblings" | sort -u
```

```bash
siblings	: 20
```





## 程序

### 循环干掉job

```shell
ps -ef | grep flume  | grep -v grep | awk '{print $2}' | xargs kill -9
```

### 杀死一个程序

```shell
kill -9 `ps aux|grep redis|grep -v grep|awk '{print $2}'`
```



### tmux

#### 新建窗口

```shell
tmux   new -s peng
```

#### 打开窗

```shell
#Ctrl+B  然后按一下D  就可以退出这个窗口，进入外部shell
tmux a -t peng
```



### 文件输入

```shell
cat >1.txt<<EOF  
Hello,world!  
EOF  

cat << EOF > 1.txt
Hello,world! 
EOF
```

## docker

### docker查看日志

```shell
docker logs  -f -t --tail 100  pushgateway
```



### docker日志过大，清空日志

```shell
cd /var/lib/docker/containers/ab3424fef89b061abce15854402d125afb59558c6aced9088d7bc2c588abb101
cat /dev/null > *-json.log
```

### 批量杀死删除容器

```shell
docker kill `docker ps -a | grep 'xxx' | grep -v grep|awk '{print $1}'`
docker rm `docker ps -a | grep 'xxx' | grep -v grep|awk '{print $1}'`
```





## Git

### 恢复修改

#### 未使用 git add 缓存代码

```shell
#放弃修改某一个文件(注意加上"--")
git checkout -- readme.md
#放弃所有的文件修改
git checkout . 
```



#### 已经使用了 git add 缓存了代码

```shell
 #放弃某个文件
 git reset HEAD readme.md
 #放弃所有缓存
 git reset HEAD .
```

#### 已经用 git commit 提交了代码

```shell
#来回退到上一次commit的状态
git reset --hard HEAD^
#回退到任何一个版本
git reset --hard  commitid 
```



## Kafka

### 查看指定消息

#### 旧版本查看指定Offset消息

```shell
./kafka-run-class.sh kafka.tools.SimpleConsumerShell \
  --broker-list '' \
  --topic '' \
  --max-messages 1 \
  --offset 12351880242 \
  --partition 2
```



#### Kafka 2.x版本查看制定Offset消息

```shell
kafka-console-consumer --bootstrap-server '' --topic ''  --offset 9043367 --partition 0  --max-messages 10  
```



## hadoop

### HDFS

#### 查看hdfs的文件占用

```shell
sudo -u hdfs hadoop fs  -du -h /
```





