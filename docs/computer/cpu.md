# CPU

[toc]

## NUMA

### 概述

[Wiki](https://zh.wikipedia.org/wiki/%E9%9D%9E%E5%9D%87%E5%8C%80%E8%AE%BF%E5%AD%98%E6%A8%A1%E5%9E%8B)

> **非统一内存访问架构**（英语：**Non-uniform memory access**，简称NUMA）是一种为[多处理器](https://zh.wikipedia.org/wiki/多處理器)的电脑设计的内存架构，内存访问时间取决于内存相对于处理器的位置。在NUMA下，处理器访问它自己的本地内存的速度比非本地内存（内存位于另一个处理器，或者是处理器之间共享的内存）快一些。
>
> 非统一内存访问架构的特点是：被共享的内存物理上是分布式的，所有这些内存的集合就是全局[地址空间](https://zh.wikipedia.org/wiki/地址空间)。所以处理器访问这些内存的时间是不一样的，显然访问本地内存的速度要比访问全局共享内存或远程访问外地内存要快些。另外，NUMA中内存可能是分层的：本地内存，群内共享内存，全局共享内存。

### CPU 拓扑：从 SMP 谈到 NUMA （理论篇）

[CPU 拓扑：从 SMP 谈到 NUMA （理论篇） | 长亭的网志空间](https://ctimbai.github.io/2018/05/10/tech/CPU%E6%8B%93%E6%89%91%EF%BC%9A%E4%BB%8ESMP%E8%B0%88%E5%88%B0NUMA%EF%BC%88%E5%AE%9E%E8%B7%B5%E7%AF%87%EF%BC%89/)

[CPU 拓扑：从 SMP 谈到 NUMA （理论篇） | 长亭的网志空间](https://ctimbai.github.io/2018/05/03/tech/CPU%E6%8B%93%E6%89%91%E4%BB%8ESMP%E8%B0%88%E5%88%B0NUMA%EF%BC%88%E7%90%86%E8%AE%BA%E7%AF%87%EF%BC%89/)

几个概念：Node，Socket，Core，Thread

NUMA 技术的主要思想是将 CPU 进行**分组**，Node 即是分组的抽象，一个 Node 表示一个分组，一个分组可以由多个 CPU 组成。每个 Node 都有自己的**本地资源，包括内存、IO 等**。

每个 Node 之间通过互联模块（**QPI**）进行通信，Node之间可以互相访问，性能会差些，一般用 **distance** 这个抽象的概念来表示各个 Node 之间互访资源的开销。

![image](https://static.lovedata.net/20-12-24-70779e16caf99a72384a2a5c70ab1267.png-wm)

**Node** 逻辑概念，Socket 物理概念，代表一个CPU封装，主板上的吃草

Core 就是socket里独立的一组程序执行单元， **物理核**

Thread就是**逻辑核**，或者称之为超线程，提升CPU的处理能力，将Core划分为多个逻辑核(**一般是两个**)，有独立寄存器和终端逻辑。 多个逻辑核共享Core内的**执行单元**和**Cache**

![image](https://static.lovedata.net/20-12-24-c722fec48014089d49c39b55440406ca.png-wm)



**一个** **NUMA Node** 可以有一个或者多个 **Socket**，每个 Socket 也可以有一个（单核）或者多个（多核）Core，一个 Core 如果打开超线程，则会变成两个逻辑核（Logical Processor，简称 Processor）。

**Node > Socket > Core > Processor**。



## CPU拓扑

[CPU Topology - 团子的小窝](https://kodango.com/cpu-topology)

```shell
#!/bin/bash
function get_nr_processor()
{
    grep '^processor' /proc/cpuinfo | wc -l
}

function get_nr_socket()
{
    grep 'physical id' /proc/cpuinfo | awk -F: '{
            print $2 | "sort -un"}' | wc -l
}

function get_nr_siblings()
{
    grep 'siblings' /proc/cpuinfo | awk -F: '{
            print $2 | "sort -un"}'
}

function get_nr_cores_of_socket()
{
    grep 'cpu cores' /proc/cpuinfo | awk -F: '{
            print $2 | "sort -un"}'
}

echo '===== CPU Topology Table ====='
echo

echo '+--------------+---------+-----------+'
echo '| Processor ID | Core ID | Socket ID |'
echo '+--------------+---------+-----------+'

while read line; do
    if [ -z "$line" ]; then
        printf '| %-12s | %-7s | %-9s |\n' $p_id $c_id $s_id
        echo '+--------------+---------+-----------+'
        continue
    fi

    if echo "$line" | grep -q "^processor"; then
        p_id=`echo "$line" | awk -F: '{print $2}' | tr -d ' '` 
    fi

    if echo "$line" | grep -q "^core id"; then
        c_id=`echo "$line" | awk -F: '{print $2}' | tr -d ' '` 
    fi

    if echo "$line" | grep -q "^physical id"; then
        s_id=`echo "$line" | awk -F: '{print $2}' | tr -d ' '` 
    fi
done < /proc/cpuinfo

echo

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
        printf "Socket %s:%s\n", i, arr[i];
}' /proc/cpuinfo

echo
echo '===== CPU Info Summary ====='
echo

nr_processor=`get_nr_processor`
echo "Logical processors: $nr_processor"

nr_socket=`get_nr_socket`
echo "Physical socket: $nr_socket"

nr_siblings=`get_nr_siblings`
echo "Siblings in one socket: $nr_siblings"

nr_cores=`get_nr_cores_of_socket`
echo "Cores in one socket: $nr_cores"

let nr_cores*=nr_socket
echo "Cores in total: $nr_cores"

if [ "$nr_cores" = "$nr_processor" ]; then
    echo "Hyper-Threading: off"
else
    echo "Hyper-Threading: on"
fi

echo
echo '===== END ====='
```

```bash
===== CPU Topology Table =====

+--------------+---------+-----------+
| Processor ID | Core ID | Socket ID |
+--------------+---------+-----------+
| 0            | 0       | 0         |
+--------------+---------+-----------+
| 1            | 0       | 1         |
+--------------+---------+-----------+
| 2            | 1       | 0         |
+--------------+---------+-----------+
| 3            | 1       | 1         |
+--------------+---------+-----------+
| 4            | 2       | 0         |
+--------------+---------+-----------+
| 5            | 2       | 1         |
+--------------+---------+-----------+
| 6            | 3       | 0         |
+--------------+---------+-----------+
| 7            | 3       | 1         |
+--------------+---------+-----------+
| 8            | 4       | 0         |
+--------------+---------+-----------+
| 9            | 4       | 1         |
+--------------+---------+-----------+
| 10           | 8       | 0         |
+--------------+---------+-----------+
| 11           | 8       | 1         |
+--------------+---------+-----------+
| 12           | 9       | 0         |
+--------------+---------+-----------+
| 13           | 9       | 1         |
+--------------+---------+-----------+
| 14           | 10      | 0         |
+--------------+---------+-----------+
| 15           | 10      | 1         |
+--------------+---------+-----------+
| 16           | 11      | 0         |
+--------------+---------+-----------+
| 17           | 11      | 1         |
+--------------+---------+-----------+
| 18           | 12      | 0         |
+--------------+---------+-----------+
| 19           | 12      | 1         |
+--------------+---------+-----------+
| 20           | 0       | 0         |
+--------------+---------+-----------+
| 21           | 0       | 1         |
+--------------+---------+-----------+
| 22           | 1       | 0         |
+--------------+---------+-----------+
| 23           | 1       | 1         |
+--------------+---------+-----------+
| 24           | 2       | 0         |
+--------------+---------+-----------+
| 25           | 2       | 1         |
+--------------+---------+-----------+
| 26           | 3       | 0         |
+--------------+---------+-----------+
| 27           | 3       | 1         |
+--------------+---------+-----------+
| 28           | 4       | 0         |
+--------------+---------+-----------+
| 29           | 4       | 1         |
+--------------+---------+-----------+
| 30           | 8       | 0         |
+--------------+---------+-----------+
| 31           | 8       | 1         |
+--------------+---------+-----------+
| 32           | 9       | 0         |
+--------------+---------+-----------+
| 33           | 9       | 1         |
+--------------+---------+-----------+
| 34           | 10      | 0         |
+--------------+---------+-----------+
| 35           | 10      | 1         |
+--------------+---------+-----------+
| 36           | 11      | 0         |
+--------------+---------+-----------+
| 37           | 11      | 1         |
+--------------+---------+-----------+
| 38           | 12      | 0         |
+--------------+---------+-----------+
| 39           | 12      | 1         |
+--------------+---------+-----------+

Socket 0: 0 2 4 6 8 10 12 14 16 18 20 22 24 26 28 30 32 34 36 38
Socket 1: 1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31 33 35 37 39

===== CPU Info Summary =====

Logical processors: 40
Physical socket: 2
Siblings in one socket:  20
Cores in one socket:  10
Cores in total: 20
Hyper-Threading: on

===== END =====
```





