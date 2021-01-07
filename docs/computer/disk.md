# 磁盘

[toc]

## 分区

### parted

[分区工具parted的详解及常用分区使用方法_伏虎游侠的博客-CSDN博客](https://blog.csdn.net/dufufd/article/details/53508367)

## 逻辑卷管理

### 逻辑卷管理详解

[LVM原理及PV、VG、LV、PE、LE关系图_北极星的专栏-CSDN博客_lvm pe](https://blog.csdn.net/lenovouser/article/details/54233570)

  在**零停机**前提下可以自如对文件系统的大小进行调整，可以方便实现文件系统跨越不同磁盘和分区。那么我们可以通过逻辑盘卷管理（LVM，Logical Volume Manager）的方式来非常完美的实现这一功能。

-  LVM是逻辑盘卷管理（Logical Volume Manager） 一种磁盘管理工具
- LVM是建立在硬盘和分区之上的一个逻辑层，来提高磁盘分区管理的灵活性
- 能够实现
  - 若干个磁盘分区连接为一个整块的卷组（volume group）形成一个存储池
  - 在卷组上随意创建逻辑卷组（logical volumes）
  - 并进一步在逻辑卷组上创建文件系统
  - 管理员通过LVM可以方便的调整存储卷组的大小
  - 对磁盘存储按照组的方式进行命名、管理和分配 随便取名字 比如 DBData 而不是使用 sda sdb 

![image](https://static.lovedata.net/21-01-06-7f984fae6c53848f218010bc6aa4172c.png-wm)

#### LVM基本术语

1. 物理存储介质（The physical media）指硬盘

2. 物理卷(physical volume) 

   1. 物理卷就是指硬盘分区或从逻辑上与磁盘分区具有同样功能的设备(如RAID)，是LVM的基本存储逻辑块

3. 卷组（Volume Group）

   1. LVM卷组类似于非LVM系统中的物理硬盘，其由物理卷组成。
   2. 可以在卷组上建立多个LVM分区（逻辑卷）
   3. LVM卷组有一个或多个物理卷组成

4. 逻辑卷（Logicalvolume）

   1. LVM的逻辑卷类似于非LVM系统中的硬盘分区

5. PE（physical extent）

   1. 物理卷被划分为称为PE(Physical Extents)的基本单元
   2. 有编号，PE是可以被LVM寻址的最小单元，可配置 默认 4MB

6. LE（logical extent）

   1. 逻辑卷也被分成为LE的可被寻址的基本单位
   2. 同一个卷组与PE大小相同，一一对应

   ![image](https://static.lovedata.net/21-01-06-c50f972ab1c65e6a1ce9a108208721af.png-wm)

   ![image](https://static.lovedata.net/21-01-06-fe7583ce01b4e7d8b6fa3dd62e605307.png-wm)

磁盘分区、卷组、逻辑卷和文件系统之间的逻辑关系的示意图

![image](https://static.lovedata.net/21-01-06-2d3436190f33b215a4d3379367adb0a3.png-wm)