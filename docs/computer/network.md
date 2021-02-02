# 网络

[toc]

## iptables

### I-tables常用参数

![image](https://static.lovedata.net/21-01-21-7fff7d1b872ba63ab9a9a4375fd733a9.png-wm)

![image](https://static.lovedata.net/21-01-21-5373e11dfc760d54949dc30b425ec96a.png-wm)

### 常用命令

> ⚠️注意：防火墙策略规则是从上到下的顺序匹配，因此一定要把允许动作放到拒绝动作前面，否则所有流量都会被拒绝掉

#### 查看已有的防火墙规则链

```shell
iptables -L
```



#### 清空已有的防火墙规则链

```shell
iptables -F
iptables -L
```

#### 把INPUT规则链的默认策略设置为拒绝

```shell
iptables -P INPUT DROP
```



#### 向INPUT链中添加允许ICMP流量进入策略规则

```shell
iptalbes -I INPUT -p icmp -j ACCEPT
```

#### 将INPUT规则链设置为只允许指定网段的主机访问本机的22端口，拒绝来自其他所有主机的流量：

```shell
iptables -I INPUT -s 192.168.10.0/24 -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j REJECT
```

#### 向INPUT规则链中添加拒绝所有人访问本机12345端口的策略规则：

```shell
iptables -I INPUT -p tcp -dport 12345 -j REJECT
iptables -I INPUT -p udp -dport 12345 -j REJECT
```



#### 向INPUT规则链中添加拒绝192.168.10.5主机访问本机80端口（Web服务）的策略规则：

```shell
iptables -I INPUT -p tcp -s 192.168.10.5 --dport 80 -j REJECT
```

#### 向INPUT规则链中添加拒绝所有主机访问本机1000～1024端口的策略规则：

```shell
iptables -i INPUT -p tcp --dport 1000:1024 -j REJECT
iptables -i INPUT -p udp --dport 1000:1024 -j REJECT
```



#### 让iptables防火墙立即生效

```shell
service iptables save
```

## firewalld

### 常用区域

![image](https://static.lovedata.net/21-01-22-6302aa42576353b0606bc6614d9368e6.png-wm)

### Firewall-cmd命令行参数和作用

![image](https://static.lovedata.net/21-01-22-402a9c106b7897ef832d5d7a94a7ede8.png-wm)

### 常用命令

#### 查看firewalld服务当前所使用的区域：

```shell
firewall-cmd --get-default-zone
```

