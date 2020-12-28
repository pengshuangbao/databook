# Python

## 基础



## Pandas

### dataframe修改列序列

```python
order = ['date', 'time', 'open', 'high', 'low', 'close', 'volumefrom', 'volumeto']
df = df[order]
```
[Python dataframe修改列顺序(pandas学习)_肥宅Sean-CSDN博客_pandas 调整列顺序](https://blog.csdn.net/a19990412/article/details/81945315)

### dataframe修改列名称

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

```python
import pandas as pd
lists = pd.read_excel("../007/List.xlsx")
# 按指定的一列排序
lists.sort_values(by="Price",inplace=True,ascending=False)
# 指定多列排序(注意：对Worthy列升序，再对Price列降序)，ascending不指定的话，默认是True升序
lists.sort_values(by=["Worthy","Price"],inplace=True,ascending=[True,False])
print(lists)
```

### 单列多列运算

#### 单列运算

```python
df['col2'] = df['col1'].map(lambda x: x**2)
```

#### 多列运算

```python
df['col3'] = df.apply(lambda x: x['col1'] + 2 * x['col2'], axis=1)
```

[Pandas对DataFrame单列/多列进行运算（map, apply, transform, agg）_zwhooo的博客-CSDN博客](https://blog.csdn.net/zwhooo/article/details/79696558)

### 合并dataframe

```python
df = pd.read_csv('csv', low_memory=False, encoding='utf-8',
                     dtype=str, engine='c')
df_est = pd.read_csv('csv', low_memory=False,
                         encoding='utf-8',
                         dtype=str, engine='c') 
mpd = pd.merge(df, df_est, how='inner', on=['province', 'global_day'])
```

[Python3 pandas库（8） 匹配合并merge() - 知乎](https://zhuanlan.zhihu.com/p/30113030)



## 代码

### 计算百分比

```python
'{:.2f}%'.format(member/denominator*100)
```

[Python 百分比计算 - Blue·Sky - 博客园](https://www.cnblogs.com/BlueSkyyj/p/9451767.html)



