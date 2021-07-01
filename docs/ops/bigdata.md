# 大数据运维

[toc]



## Kafka

### 测试生产者性能

```shell
$ bin/kafka-producer-perf-test.sh --topic test-topic --num-records 10000000 --throughput -1 --record-size 1024 --producer-props bootstrap.servers=kafka-host:port acks=-1 linger.ms=2000 compression.type=lz4

2175479 records sent, 435095.8 records/sec (424.90 MB/sec), 131.1 ms avg latency, 681.0 ms max latency.
4190124 records sent, 838024.8 records/sec (818.38 MB/sec), 4.4 ms avg latency, 73.0 ms max latency.
10000000 records sent, 737463.126844 records/sec (720.18 MB/sec), 31.81 ms avg latency, 681.00 ms max latency, 4 ms 50th, 126 ms 95th, 604 ms 99th, 672 ms 99.9th.
```

### 测试消费者性能

```shell
$ bin/kafka-consumer-perf-test.sh --broker-list kafka-host:port --messages 10000000 --topic test-topic
start.time, end.time, data.consumed.in.MB, MB.sec, data.consumed.in.nMsg, nMsg.sec, rebalance.time.ms, fetch.time.ms, fetch.MB.sec, fetch.nMsg.sec
2019-06-26 15:24:18:138, 2019-06-26 15:24:23:805, 9765.6202, 1723.2434, 10000000, 1764602.0822, 16, 5651, 1728.1225, 1769598.3012
```



### 查看消息总数

```shell
$ bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list kafka-host:port --time -2 --topic test-topic

test-topic:0:0
test-topic:1:0

$ bin/kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list kafka-host:port --time -1 --topic test-topic

test-topic:0:5500000
test-topic:1:5500000
```



### MirrorMaker镜像

```shell
$ bin/kafka-mirror-maker.sh --consumer.config ./config/consumer.properties --producer.config ./config/producer.properties --num.streams 8 --whitelist ".*"
```



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



#### 查看topic详细信息

```shell
 kafka-topics.sh --zookeeper localhost:2181 --describe --topic main_topic
```



#### 查看指定offset

```shell
kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list 10.1.4.10:9092,10.1.4.13:9092,10.1.4.6:9092 --topic main_topic --time -1
```



> -1表示查询test各个分区当前最大的消息位移值(注意，这里的位移不只是consumer端的位移，而是指消息在每个分区的位置)
>
> ​    如果你要查询曾经生产过的最大消息数，那么只运行上面这条命令然后把各个分区的结果相加就可以了。但如果你需要查询当前集群中该topic的消息数，那么还需要运行下面这条命令：
>
> ```shell
> kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list 10.162.160.115:9092 --topic s1mmetest --time -2
> ```
>
> ​    -2表示去获取当前各个分区的最小位移。之后把运行第一条命令的结果与刚刚获取的位移之和相减就是集群中该topic的当前消息总数。



### 监控消费进度

```shell
# 查看所有groupid
kafka-consumer-groups  --bootstrap-server 172.28.19.115:9092,172.28.19.116:9092,172.28.19.117:9092 -list

# 查看消费进度
kafka-consumer-groups  --bootstrap-server 172.28.19.115:9092,172.28.19.116:9092,172.28.19.117:9092  --group  custom_events_test_25 --describe

```



```text
TOPIC                   PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID     HOST            CLIENT-ID
custom_event_topic_test 0          1442178         1442182         4               -               -               -
```



## hadoop

### HDFS

#### 查看hdfs的文件占用

```shell
sudo -u hdfs hadoop fs  -du -h /
```

### Hive

导出csv

```shell
hive -e "set hive.cli.print.header=false; select * from device" | sed 's/[\t]/\001/g'  > device.csv
```





## Kudu

### 健康检查

```shell
sudo -u kudu kudu cluster ksck impala5.fibodata.com:7051,impala6.fibodata.com:7051
```

### 获取kudu-flags

```shell
sudo -u kudu kudu tserver get_flags  localhost
```

### 设置kudu-flags

```shell
sudo -u kudu kudu tserver set_flag localhost  maintenance_manager_num_threads 6 --force
```

### 获取master的状态

```shell
sudo -u kudu kudu master  status  impala5.fibodata.com:7051
```

### 获取所有的kudu表

```shell
sudo -u kudu kudu table list impala5.fibodata.com:7051,impala6.fibodata.com:7051
```
### 重平衡

> 参考 [Apache Kudu - Apache Kudu Command Line Tools Reference](https://kudu.apache.org/docs/command_line_tools_reference.html#cluster-rebalance)

```shell
sudo -u kudu  kudu cluster rebalance impala5.fibodata.com,impala6.fibodata.com
```







