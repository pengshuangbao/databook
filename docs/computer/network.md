# 网络

[toc]

## iptables

### I-tables常用参数

![image](https://static.lovedata.net/21-01-21-7fff7d1b872ba63ab9a9a4375fd733a9.png)

![image](https://static.lovedata.net/21-01-21-5373e11dfc760d54949dc30b425ec96a.png)

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

![image](https://static.lovedata.net/21-01-22-6302aa42576353b0606bc6614d9368e6.png)

### Firewall-cmd命令行参数和作用

![image](https://static.lovedata.net/21-01-22-402a9c106b7897ef832d5d7a94a7ede8.png)

### 常用命令

#### 查看firewalld服务当前所使用的区域：

```shell
firewall-cmd --get-default-zone
```



## https

[为什么https是安全的](https://mp.weixin.qq.com/s/-o2FDyUuECZhHCIOJsesNA)



## 题目

### [TCP灵魂之问](https://mp.weixin.qq.com/s/2RnhbJxHm2lt1o-qvIEo6Q)

#### 说说 TCP 三次握手的过程？为什么是三次而不是两次、四次？

> 恋爱模拟
>
> 第一次:
>
> 男: **我爱你。**
>
> 女方收到。
>
> 由此证明男方拥有`爱`的能力。
>
> 第二次:
>
> 女: **我收到了你的爱，我也爱你。**
>
> 男方收到。
>
> OK，现在的情况说明，女方拥有`爱`和`被爱`的能力。
>
> 第三次:
>
> 男: **我收到了你的爱。**
>
> 女方收到。
>
> 现在能够保证男方具备`被爱`的能力。
>
> 由此完整地确认了双方`爱`和`被爱`的能力，两人开始一段甜蜜的爱情。

对应到 TCP 的三次握手，也是需要确认双方的两样能力: `发送的能力`和`接收的能力`

![image](https://static.lovedata.net/21-04-02-69b4951df2e7b1f9326e3671f251fb28.png)

从最开始双方都处于`CLOSED`状态。然后服务端开始监听某个端口，进入了`LISTEN`状态。

然后客户端主动发起连接，发送 SYN , 自己变成了`SYN-SENT`状态。

服务端接收到，返回`SYN`和`ACK`(对应客户端发来的SYN)，自己变成了`SYN-REVD`。

之后客户端再发送`ACK`给服务端，自己变成了`ESTABLISHED`状态；服务端收到`ACK`之后，也变成了`ESTABLISHED`状态。



SYN 是需要消耗一个序列号的，下次发送对应的 ACK 序列号要加1，为什么呢？只需要记住一个规则:

> 凡是需要对端确认的，一定消耗TCP报文的序列号

**SYN 需要对端的确认， 而 ACK 并不需要，因此 SYN 消耗一个序列号而 ACK 不需要**



#### 四次挥手

![image](https://static.lovedata.net/21-04-02-5946e08e1f8e0d944d23b165d9de23e6.png)



刚开始双方处于`ESTABLISHED`状态。

客户端要断开了，向服务器发送 `FIN` 报文，在 TCP 报文中的位置如下图:

![image](https://static.lovedata.net/21-04-02-b49eb4eeecbc3af98841882e060817b9.png)

发送后客户端变成了`FIN-WAIT-1`状态。注意, 这时候客户端同时也变成了`half-close(半关闭)`状态，即无法向服务端发送报文，只能接收。

服务端接收后向客户端确认，变成了`CLOSED-WAIT`状态。

客户端接收到了服务端的确认，变成了`FIN-WAIT2`状态。

随后，服务端向客户端发送`FIN`，自己进入`LAST-ACK`状态，

客户端收到服务端发来的`FIN`后，自己变成了`TIME-WAIT`状态，然后发送 ACK 给服务端。

注意了，这个时候，客户端需要等待足够长的时间，具体来说，是 2 个 `MSL`(`Maximum Segment Lifetime，报文最大生存时间`), 在这段时间内如果客户端没有收到服务端的重发请求，那么表示 ACK 成功到达，挥手结束，否则客户端重发 ACK。































