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

