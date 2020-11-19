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



#### 文件输入

```shell
cat >1.txt<<EOF  
Hello,world!  
EOF  

cat << EOF > 1.txt
Hello,world! 
EOF
```





