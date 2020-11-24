# 大数据

[toc]



## Hadoop

### HDFS

![image](https://static.lovedata.net/20-11-14-d49d7e3da21361172ebac59925d3bfe0.png-wm)

![image](https://static.lovedata.net/20-11-14-05f910e5845a2203d4a264423cfb5827.png-wm)

### Yarn

![image](https://static.lovedata.net/20-11-14-1451617abad849214404f81317333628.png-wm)

## Flink

![image](https://static.lovedata.net/20-11-12-4de097552699ea1f899d8682ab03f59a.png-wm)

![image](https://static.lovedata.net/20-11-16-74ce5da5cc6e21ba0a8bea275b1d4c18.png-wm)



![image](https://static.lovedata.net/20-11-16-c173a7f003f9e89550ea1f3e1175f922.png-wm)

### Hbase

![image](https://static.lovedata.net/20-11-16-3a3de65539fc9cf41a9abc8cfb13cc9c.png-wm)

![image](https://static.lovedata.net/20-11-16-4ba32f05c0430ffa4b9f15023dd75e92.png-wm)



### Redis

![image](https://static.lovedata.net/20-11-16-a3153b91abfe866f6654a8e10160b6a1.png-wm)



![image](https://static.lovedata.net/20-11-16-a69a39febc0ce88ae987d5b343d1e38a.png-wm)



## 命令

### Kafka

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

































