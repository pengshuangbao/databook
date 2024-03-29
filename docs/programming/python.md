# Python

[toc]

## 基础

### IO

#### 文件读取模式

| 模式 | 描述                                                         |
| :--- | :----------------------------------------------------------- |
| t    | 文本模式 (默认)。                                            |
| x    | 写模式，新建一个文件，如果该文件已存在则会报错。             |
| b    | 二进制模式。                                                 |
| +    | 打开一个文件进行更新(可读可写)。                             |
| U    | 通用换行模式（**Python 3 不支持**）。                        |
| r    | 以只读方式打开文件。文件的指针将会放在文件的开头。这是默认模式。 |
| rb   | 以二进制格式打开一个文件用于只读。文件指针将会放在文件的开头。这是默认模式。一般用于非文本文件如图片等。 |
| r+   | 打开一个文件用于读写。文件指针将会放在文件的开头。           |
| rb+  | 以二进制格式打开一个文件用于读写。文件指针将会放在文件的开头。一般用于非文本文件如图片等。 |
| w    | 打开一个文件只用于写入。如果该文件已存在则打开文件，并从开头开始编辑，即原有内容会被删除。如果该文件不存在，创建新文件。 |
| wb   | 以二进制格式打开一个文件只用于写入。如果该文件已存在则打开文件，并从开头开始编辑，即原有内容会被删除。如果该文件不存在，创建新文件。一般用于非文本文件如图片等。 |
| w+   | 打开一个文件用于读写。如果该文件已存在则打开文件，并从开头开始编辑，即原有内容会被删除。如果该文件不存在，创建新文件。 |
| wb+  | 以二进制格式打开一个文件用于读写。如果该文件已存在则打开文件，并从开头开始编辑，即原有内容会被删除。如果该文件不存在，创建新文件。一般用于非文本文件如图片等。 |
| a    | 打开一个文件用于追加。如果该文件已存在，文件指针将会放在文件的结尾。也就是说，新的内容将会被写入到已有内容之后。如果该文件不存在，创建新文件进行写入。 |
| ab   | 以二进制格式打开一个文件用于追加。如果该文件已存在，文件指针将会放在文件的结尾。也就是说，新的内容将会被写入到已有内容之后。如果该文件不存在，创建新文件进行写入。 |
| a+   | 打开一个文件用于读写。如果该文件已存在，文件指针将会放在文件的结尾。文件打开时会是追加模式。如果该文件不存在，创建新文件用于读写。 |
| ab+  | 以二进制格式打开一个文件用于追加。如果该文件已存在，文件指针将会放在文件的结尾。如果该文件不存在，创建新文件用于读写。 |

### 生成requirements.txt文件

> 参考:https://github.com/bndr/pipreqs

```shell
#如果是python3,则换成pip3
pip install pipreqs
# 在当前目录生成
pipreqs . --encoding=utf8 --force
```



### 字符串

#### 输出进度条

```python
from time import sleep
from tqdm import tqdm
# 这里同样的，tqdm就是这个进度条最常用的一个方法
# 里面存一个可迭代对象
for i in tqdm(range(1, 500)):
   # 模拟你的任务
   sleep(0.01)
sleep(0.5)
```

![image](https://static.lovedata.net/21-01-12-113e963323391fce21ed0360e7d439a4.png)



#### 格式化输出

| 格式化      | 解释               | 举例                                                         |
| ----------- | ------------------ | ------------------------------------------------------------ |
| %s          | 字符串             | print ("His name is %s"%("Aviad"))                           |
| %d          | 整数               | print ("He is %d years old"%(25))                            |
| %f          | 浮点数             | print ("His height is %f m"%(1.83))                          |
| %.2f        | 浮点数(保留小数点) | print ("His height is %.2f m"%(1.83))                        |
| %10s  %8.2f | 指定占位符宽度     | print ("Name:%10s Age:%8d Height:%8.2f"%("Aviad",25,1.83))<br />![image](https://static.lovedata.net/20-12-29-e710c540b1beb47c4e3e436f14028d63.png) |
| bin(10)     | 二进制整数         |                                                              |
| oct(10)     | 八进制整数         |                                                              |
| hex(10)     | 十六进制整数       |                                                              |

[
Python格式化输出 %s %d %f_ Hey_cancan的博客-CSDN博客](https://blog.csdn.net/weixin_40583388/article/details/78600101)

#### 计算百分比

```python
'{:.2f}%'.format(member/denominator*100)
```

[Python 百分比计算 - Blue·Sky - 博客园](https://www.cnblogs.com/BlueSkyyj/p/9451767.html)

#### 字符串表格格式输出

[Python在命令行输出美观的表格 - FINTHON](https://finthon.com/python-prettytable/)

```python
import prettytable as pt
 
table = pt.PrettyTable(['No', 'JOBID', 'NAME', 'STATUS'])
table.add_row(['1', '101', 'job1', 'R'])
table.add_row(['2', '102', 'job2', 'R'])
table.add_row(['3', '103', 'job3', 'R'])
table.add_row(['4', '104', 'job4', 'R'])
print(table)
```

```bash
+----+-------+------+--------+
| No | JOBID | 名字 | STATUS |
+----+-------+------+--------+
| 1  |  101  | job1 |   R    |
| 2  |  102  | job2 |   R    |
| 3  |  103  | job3 |   R    |
| 4  |  104  | job4 |   R    |
+----+-------+------+--------+
```



#### 字符串驼峰下划线互转

[pyhumps · PyPI](https://pypi.org/project/pyhumps/)

```python
import humps

humps.camelize("jack_in_the_box")  # jackInTheBox
humps.decamelize("rubyTuesdays")  # ruby_tuesdays
humps.pascalize("red_robin")  # RedRobin
humps.kebabize("white_castle")  # white-castle
```





### 日期

#### 格式化输出

[Python中日期和时间格式化输出的方法 - Tom_Mo - 博客园](https://www.cnblogs.com/cxmo/p/10561808.html)

```python
datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S');
# '2013-09-17 08:06:17'

now=datetime.datetime.now()
now.strftime('%Y')
# '2013'

# 显示一周中的第几天，其中星期天为0，星期一为1
import datetime
now=datetime.datetime.now()
now.strftime('%w')
# '2'

# 显示一年中的第几周，星期天为一周的第一天
import datetime
now=datetime.datetime.now()
now.strftime('%U')
# '37'

# 显示一年中的第几周 星期一为一周的第一天
now=datetime.datetime.now()
now.strftime('%W')
#'37'
```



#### 时间加减

```python
import datetime

now = datetime.datetime.now()
print(now.strftime('%Y-%m-%d %H:%M:%S'))

add_hour = now + datetime.timedelta(hours=8)
print(add_hour.strftime('%Y-%m-%d %H:%M:%S'))

# 2021-01-08 15:18:50
# 2021-01-08 23:18:50
```





### 列表

#### 不区分大小写的判断一个元素是否在一个列表中

```python
arr1 = ['Jack', 'mAry', 'bob']
arr2 = ['jack', 'mary']

for a1 in arr1:
    if a1.lower() in [a2.lower() for a2 in arr2]:
        print("%s is in arr2")
    else:
        print("%s is not in arr2")
```

#### list排序

```python
class Student: 
    def __init__(self, name, subject, mark):
        self.name = name
        self.subject = subject
        self.mark = mark

s1 = Student("Jack", "os", 60)
s2 = Student("Jim", "cn", 61)
s3 = Student("Pony", "se", 65)
 
L = [s1, s2, s3]
L.sort(key=lambda t: t.mark)
for i in range(0, len(L)):
    print(L[i].name+","+L[i].subject+","+str(L[i].mark))
```

## Pandas

### 操作

#### dataframe修改列序列

```python
order = ['date', 'time', 'open', 'high', 'low', 'close', 'volumefrom', 'volumeto']
df = df[order]
```
[Python dataframe修改列顺序(pandas学习)_肥宅Sean-CSDN博客_pandas 调整列顺序](https://blog.csdn.net/a19990412/article/details/81945315)

#### dataframe修改列名称

#### 直接修改

```python
mpd.columns = ["精确PV", "精确UV", "省", "日期", "近似PV", "近似UV", "精确度((近似UV-精确UV)/精确UV)"]
```

#### 导入数据的时候修改

```python
col_names = ["City","Colors_Reported","Shape_Reported","State","Time"]
ufo = pd.read_csv(r"ufo.csv", header = 0, names = col_names)
```

[Pandas 3：如何修改columns的名称 - 知乎](https://zhuanlan.zhihu.com/p/104578162)



### 排序

#### 按照列排序

```python
import pandas as pd
lists = pd.read_excel("../007/List.xlsx")
# 按指定的一列排序
lists.sort_values(by="Price",inplace=True,ascending=False)
# 指定多列排序(注意：对Worthy列升序，再对Price列降序)，ascending不指定的话，默认是True升序
lists.sort_values(by=["Worthy","Price"],inplace=True,ascending=[True,False])
print(lists)
```

### 运算

#### 单列运算

```python
df['col2'] = df['col1'].map(lambda x: x**2)
```

#### 多列运算

```python
df['col3'] = df.apply(lambda x: x['col1'] + 2 * x['col2'], axis=1)
```

[Pandas对DataFrame单列/多列进行运算（map, apply, transform, agg）_zwhooo的博客-CSDN博客](https://blog.csdn.net/zwhooo/article/details/79696558)

#### 合并dataframe

```python
df = pd.read_csv('csv', low_memory=False, encoding='utf-8',
                     dtype=str, engine='c')
df_est = pd.read_csv('csv', low_memory=False,
                         encoding='utf-8',
                         dtype=str, engine='c') 
mpd = pd.merge(df, df_est, how='inner', on=['province', 'global_day'])
```

[Python3 pandas库（8） 匹配合并merge() - 知乎](https://zhuanlan.zhihu.com/p/30113030)



## 运维

### 安装venv虚拟环境

```shell
/usr/local/python3/bin/python3.8 -m venv venv
```





## 问题

### Python2

#### urllib2打开https链接报错

```python
<urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:727)>
https://blog.51cto.com/lsieun/2952082
```

原因

Python2.7.9 之后，当使用urllib.urlopen打开一个 https 链接时，会验证一次 SSL 证书。而当目标网站使用的是自签名的证书时就会抛出如下异常：

##### 方案一

使用ssl创建未经验证的上下文，在urlopen中传入上下文参数：

```
import ssl
 
context = ssl._create_unverified_context()
urllib.request.urlopen(req,context=context)
```

##### 方案二

全局取消证书验证：

```
import ssl
 
ssl._create_default_https_context = ssl._create_unverified_context
urllib2.urlopen("https://www.12306.cn/mormhweb/").read()
```

##### 方案三

使用的是requests模块，将方法中的verify设置位False即可：

```
requests.get(url, headers=Hostreferer,verify=False) 
```

 





