# LSM-Tree

[toc]



## 【Paper笔记】The Log structured Merge-Tree（LSM-Tree）

> [【Paper笔记】The Log structured Merge-Tree（LSM-Tree）  ](https://kernelmaker.github.io/lsm-tree)

## 彻底搞懂LSM-Tree

> [彻底搞懂LSM-Tree](https://mp.weixin.qq.com/s/2Njngm52jNOo0nu50TvRyQ)

### 是什么？

- LSM-Tree，即Log-Structured Merge-Tree（**日志结构合并树**）。

- LevelDB和RocksDB等使用的存储引擎，拥有着优异的写性能和不错的读性能。

### 有什么特点？

- 优异的写性能
- 不错的读性能
- 顺序写磁盘，大幅度提升写的性能，牺牲一部分读的性能提高写性能

### 磁盘结构

![image](https://static.lovedata.net/21-06-07-4dc24c6f2bda17693df82ada49375934.png)

### 结构组成

LSM-Tree是由两个或以上的存储结构组成的，由一个驻存在内存中的树结构和多个位于磁盘的树结构组成。我们一般把在内存中的树结构称为C0-Tree（小树），具体结构可以是任何方便键值查找的数据结构，例如**红黑树，跳表等**；在磁盘中的树一开始为C1-Tree（大树），以后由于合并递增会有C2-Tree，C3-Tree……Ck-Tree，树从小到大依次递增。

![image](https://static.lovedata.net/21-06-07-6149b08557d2a7eb0004748f036db23b.png)



### 写lsm-tree

每次写操作，要先写WAL，然后再去更新内存

### 合并

![image](https://static.lovedata.net/21-06-07-4af8ac6f120a72a5b1f2ca6fe7686f49.png)

一开始数据会存放在C0-Tree中即内存中，当达到C0-Tree的阈值时会触发合并，将C0-Tree的数据合并写入到C1-Tree，过程类似于归并排序。C0-Tree和C1-Tree（old）会合并成为一个C1-Tree（new），C1-Tree（old）会被删除，用C1-Tree（new）代替。当C1-Tree达到一定大小，也会和下一层进行合并。

**数据插入，删除，更新**都是**通过****追加**的方式进行（后面会通过图的方式形象的展示给大家），尽最大可能保证顺序写，避免随机写。。



### 读写例子

例如往树中写入了`a = 5`，然后该数据经过多次的合并已经存储到Ck-Tree了，但是现在写入一个`a = 100`，那么会先写入log，然后在C0-Tree进行更新。那么我们要进行查询的时候，首先会到内存中进行查询a，内存中有直接进行返回，内存中没有会先查找C1-Tree，如果还是没有则查找C2-Tree……Ck-Tree。所以Ck-Tree存在有老数据是不影响正确结果的返回，查找循序是从小阶级Tree开始，所以会先返回`a = 100`，虽然不会读取到老数据，但是会造成老数据（无用的数据）暂时停留在磁盘中，当数据a也被合并到Ck-Tree时，会把老数据清理合并，解决这个问题。



### 合并过程

![image](https://static.lovedata.net/21-06-07-90ce05c8ab77cfc7e27763d8d2a46055.png)





