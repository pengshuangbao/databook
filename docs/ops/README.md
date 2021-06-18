# 运维

[toc]

## 性能工具图 

![image](https://static.lovedata.net/20-11-11-7ceebb617ce3ee156789b652255df844.png-wm)



## 基本

### 查看系统信息

```shell
# 方法1
cat /proc/version

# 方法2
uname -a
```



###  查看系统版本信息

```shell
lsb_release -a
```



### 查看CPU配置

```shelll
lscpu
```

### top

[top图解PDF](https://drive.google.com/file/d/1C9HxJDVXc3F6Wr4mlxBpmEFFizDW_MsI/view)

![top](https://static.lovedata.net/top.gif-wm)



#### 查看进程下的线程信息

```shell
top -Hp pid
```





### 查看内存大小

![image](https://static.lovedata.net/20-12-25-d5d85be0e48724a26aa85d9cc9c2e860.png-wm)

#### 输出便于理解的内存信息

```shell
free -h
```

```bash
              total        used        free      shared  buff/cache   available
Mem:           125G         71G        5.1G        4.0G         49G         49G
Swap:          127G        2.0G        126G
```

#### 定时输出

```shell
free -h -s 3
```

```bash
 total        used        free      shared  buff/cache   available
Mem:           125G         71G        6.3G        4.0G         48G         49G
Swap:          127G        2.0G        126G

              total        used        free      shared  buff/cache   available
Mem:           125G         71G        6.3G        4.0G         48G         49G
Swap:          127G        2.0G        126G

              total        used        free      shared  buff/cache   available
Mem:           125G         71G        6.3G        4.0G         48G         49G
Swap:          127G        2.0G        126G

              total        used        free      shared  buff/cache   available
Mem:           125G         71G        6.3G        4.0G         48G         49G
Swap:          127G        2.0G        126G
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



### 代理隧道

```shell
# 如果以前有这个用户，删除
userdel sshproxyuser
rm -rf  /home/sshproxyuser

# 添加用户
useradd --create-home sshproxyuser

# 转至用户
su - sshproxyuser
ssh-keygen 
vim /home/sshproxyuser/.ssh/authorized_keys

# 修改shell，改为不能登陆
chsh -s /sbin/nologin sshproxyuser
# 删除密码
passwd --delete sshproxyuser

```

问题

使用 下面命令登陆会提示输入密码

```shell
ssh -D 1078 -f -C -q -N sshproxyuser@120.77.38.170 -p 65022
```

查看authorized_keys权限，如果除了自己的其他人可以修改，那么ssh会跳过认证，还是要求输入密码，所以需要修改权限

```shell
-rw-rw-r-- 1 sshproxyuser sshproxyuser  398 Mar  4 15:46 authorized_keys
```

修改权限

```shell
chmod g-w /home/sshproxyuser/.ssh/authorized_keys
#修改完成后
-rw-r--r-- 1 sshproxyuser sshproxyuser  398 Mar  4 15:46 authorized_keys
```

### find

#### find 命令找到大于100M文件  

```shell
find . -size +100M
```

### sed

[如何使用 sed 命令删除文件中的行](https://juejin.cn/post/6844903926756704269)

### Rsysc

#### 复制文件夹并且排除某一些文件

> `-a`参数表示archive模式，`-v`表示详细链模式输出，`-z`表示传输文件时使用压缩传输的模式
>
> `--exclude`后面的路径不能为绝对路径，必须为相对路径才可以，否则出错

```shell
rsync -av --exclude=theme-default/README.md --exclude=theme-default/__tests__  --exclude=theme-default/package.json theme-default /Applications/projects/databook/
```

[Linux下tar、cp命令排除某个目录或文件 - ReggieQiao - 博客园](https://www.cnblogs.com/reggieqiao/p/13268584.html)

### dmesg

查看系统消息

```shell
dmesg -T | less
```

### lsof

[linux lsof命令详解 - 星火spark - 博客园](https://www.cnblogs.com/sparkbj/p/7161669.html)

```shell
# 1.列出所有打开的文件:
lsof
备注: 如果不加任何参数，就会打开所有被打开的文件，建议加上一下参数来具体定位

# 2. 查看谁正在使用某个文件
lsof   /filepath/file

# 3.递归查看某个目录的文件信息 备注: 使用了+D，对应目录下的所有子目录和文件都会被列出
lsof +D /filepath/filepath2/

# 4. 比使用+D选项，遍历查看某个目录的所有文件信息 的方法
lsof | grep ‘/filepath/filepath2/’

# 5. 列出某个用户打开的文件信息
lsof  -u username

#6. 列出某个程序所打开的文件信息
lsof -c mysql

#7. 列出多个程序多打开的文件信息
lsof -c mysql -c apache

#8. 列出某个用户以及某个程序所打开的文件信息
lsof -u test -c mysql

# 9. 列出除了某个用户外的被打开的文件信息

lsof   -u ^root

# 10. 通过某个进程号显示该进行打开的文件
lsof -p 1

# 11. 列出多个进程号对应的文件信息
lsof -p 123,456,789

# 12. 列出除了某个进程号，其他进程号所打开的文件信息
lsof -p ^1

# 13 . 列出所有的网络连接
lsof -i

# 14. 列出所有tcp 网络连接信息
lsof  -i tcp

# 15. 列出所有udp网络连接信息
lsof  -i udp

# 16. 列出谁在使用某个端口
lsof -i :3306

# 17. 列出谁在使用某个特定的udp端口
lsof -i udp:55

# 特定的tcp端口
lsof -i tcp:80

# 18. 列出某个用户的所有活跃的网络端口
lsof  -a -u test -i

# 19. 列出所有网络文件系统
lsof -N

# 20.域名socket文件
lsof -u

# 21.某个用户组所打开的文件信息
lsof -g 5555

# 22. 根据文件描述列出对应的文件信息
lsof -d description(like 2)

# 23. 根据文件描述范围列出文件信息
lsof -d 2-3
```



### crontab

#### crontab批量修改替换

比如之前有这些 ，每周五执行clearLog.sh

```shell
30 3 * * * /bin/find /var/log/kudu/ -mtime +60 -type f -name "*invalid-user.log*" -exec /bin/rm -f {} \;
00 19 * * 5 sh /root/clearLog.sh
```

现在想修改一下，改为每天执行

```shell
(crontab -l | sed 's/5 sh/* sh/') | crontab
```

#### 基于cron定时删除日志

```shell
30 3 * * * /bin/find /root/zbmy/realtime/logs/error/ -mtime +60 -type f -name "error*.*.log" -exec /bin/rm -f {} \;

30 3 * * * /bin/find /var/log/kudu/ -mtime +60 -type f -name "*invalid-user.log*" -exec /bin/rm -f {} \;
```







## Mac

### 定时任务相关

```shell
#加载定时任务
launchctl load  com.lovedata.checktoken.plist 

#卸载
launchctl unload  com.lovedata.checktoken.plist 

#执行
launchctl start  com.lovedata.checktoken.plist
```

### 批量杀死同名进程

```shell
kill $(ps -ef|grep chromedriver |awk '$0 !~/grep/ {print $2}' |tr -s '\n' ' ')
kill $(ps -ef|grep 'Google Chrome Helper' |awk '$0 !~/grep/ {print $2}' |tr -s '\n' ' ')
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

#### 查看文件占用大小

```shell
du -h --max-depth=1 /usr/hdp/2.6.5.0-292
```





### IO测试

#### 粗略测试磁盘速度

```shell
dd if=cm6.3.1-redhat7.tar.gz  bs=8k count=300000 of=/dev/null
```

#### 生成大文件

```shell
dd if=/dev/zero of=test bs=1M count=1000
```



#### 随机生成10个小文件

```shell
seq 10 | xargs -i dd if=/dev/zero of={}.dat bs=1024 count=1
```



## 网络

#### 查看监听端口

```shell
netstat -atunlp | grep LISTEN
```

#### 查看 某一个端口的占用情况

```shell
# 查看 某一个端口的占用情况，去重要先排序才能去重计数
netstat -atunlp | grep 2181 | awk '{ print $5" : "$7 }' | sort | uniq -c
```

## 内存

### 清除PageCache

#### 仅清除页面缓存PageCache方法：

```bash
echo 1 > /proc/sys/vm/drop_caches
```

#### 清除目录项和inode节点：

```bash
echo 2 > /proc/sys/vm/drop_caches
```

#### 清除页面缓存、目录项和inode节点：

```bash
echo 3 > /proc/sys/vm/drop_caches
```

## CPU

### CPU概览

```shell
lscpu
```

```bash
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                40 #总的逻辑CPU个数
On-line CPU(s) list:   0-39 #在线CPU编号列表
Thread(s) per core:    2 #每个Core的逻辑CPU个数
Core(s) per socket:    10 #每个Socket上的Core个数
Socket(s):             2#多少个Socket(插槽,物理CPU)
NUMA node(s):          2#多少个node
Vendor ID:             GenuineIntel
CPU family:            6
Model:                 79
Model name:            Intel(R) Xeon(R) CPU E5-2630 v4 @ 2.20GHz
Stepping:              1
CPU MHz:               1319.484
BogoMIPS:              4399.44
Virtualization:        VT-x
L1d cache:             32K
L1i cache:             32K
L2 cache:              256K
L3 cache:              25600K
NUMA node0 CPU(s):     0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38
NUMA node1 CPU(s):     1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39
```



### 查看当前系统的 NUMA Node

 [打印CPU拓扑](https://databook.lovedata.net/computer/cpu.html#cpu%E6%8B%93%E6%89%91%E6%89%93%E5%8D%B0%E8%84%9A%E6%9C%AC)

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



### 性能CPU监控 淘宝监控

```shell
git clone https://github.com/oldratlee/useful-scripts.git

scp -r useful-scripts root@server3:/data3/test/
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

### Docker镜像加速

创建或修改 /etc/docker/daemon.json 文件，修改为如下形式

```json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "http://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```



### Docker杀死所有容器

```shell
 docker ps -a -q | xargs docker rm -f
```

### Docker定时清理日志

```shell
#!/bin/sh

DockerLogPath='/var/lib/docker/containers/'
if test -e $DockerLogPath && test -d $DockerLogPath; 
then
    dockerList=`ls $DockerLogPath`
    for fileName in $dockerList;
    do
    wholeFolderPath=$DockerLogPath$fileName
    #if test -f $fileName; then
    if test -f $wholeFolderPath; 
    then
        echo $wholeFolderPath;
    elif test -d $wholeFolderPath; 
    then
        cd $wholeFolderPath;
        jsonFile=$wholeFolderPath'/'$fileName-json.log
        if test -e  $jsonFile && test -f $jsonFile;
        then
            echo 'Clean '$jsonFile
            cat /dev/null > $jsonFile;
        else
            echo $jsonFile' not exists!'
        fi
    else
        echo  "$DockerLogPath is a invalid path";
    fi 
    done

    echo "Done"
else
   echo  "$DockerLogPath is a invalid path";
fi
```

```shell
crontab -e
00 19 * * * sh /root/clean_docker_log.sh
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

