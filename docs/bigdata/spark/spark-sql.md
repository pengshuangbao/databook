# Spark SQL

[[toc]]

文档地址

[Spark SQL and DataFrames - Spark 2.2.0 中文文档 - ApacheCN](http://spark.apachecn.org/docs/cn/2.2.0/sql-programming-guide.html)

## Spark sql 是什么？

Spark SQL 是 Spark 处理结构化数据的一个模块.与基础的 Spark RDD API 不同, Spark SQL 提供了查询结构化数据及计算结果等信息的接口.在内部, Spark SQL 使用这个额外的信息去执行额外的优化.有几种方式可以跟 Spark SQL 进行交互, 包括 SQL 和 Dataset API.当使用相同执行引擎进行计算时, 无论使用哪种 API / 语言都可以快速的计算.这种统一意味着开发人员能够在基于提供最自然的方式来表达一个给定的 transformation API 之间实现轻松的来回切换不同的 .

Spark SQL 的功能之一是执行 SQL 查询.Spark SQL 也能够被用于从已存在的 Hive 环境中读取数据

当以另外的编程语言运行SQL 时, 查询结果将以 Dataset/DataFrame的形式返回

## RDD Datasets and DataFrames 的概念和区别？

![image](http://static.lovedata.net/jpg/2018/6/30/12b6c98673ad154e2de0a741fe012b92.jpg-wm)

![image](http://static.lovedata.net/jpg/2018/6/30/bb2f7bee46b8c557ed722937adb7ea77.jpg-wm)


### DateSet


一个 Dataset 是一个分布式的数据集合 Dataset 是在 Spark 1.6 中被添加的新接口, 它提供了 RDD 的优点（强类型化, 能够使用强大的 lambda 函数）  Spark SQL执行引擎的优点.一个 Dataset 可以从 JVM 对象来 构造 并且使用转换功能（map, flatMap, filter, 等等）.

从Spark 2.0开始始，Dataset开始具有两种不同类型的API特征：有明确类型的API和无类型的API。从概念上来说，你可以把DataFrame当作一些通用对象Dataset[Row]的集合的一个别名，而一行就是一个通用的无类型的JVM对象。与之形成对比，Dataset就是一些有明确类型定义的JVM对象的集合，通过你在Scala中定义的Case Class或者Java中的Class来指定。

#### Dataset API的优点

1. 静态类型与运行时类型安全  更早的发现错误  图谱的另一端是最严格的Dataset。因为Dataset API都是用lambda函数和JVM类型对象表示的，所有不匹配的类型参数都可以在编译时发现。而且在使用Dataset时，你的分析错误也会在编译时被发现，这样就节省了开发者的时间和代价。 Dataset是最严格的一端，但对于开发者来说也是效率最高的。 ![image](http://static.lovedata.net/jpg/2018/6/30/0901282d05ea829125c01afa9d501c86.jpg-wm)
2. 关于结构化和半结构化数据的高级抽象和定制视图
3. 方便易用的结构化API  它比用RDD数据行的数据字段进行agg、select、sum、avg、map、filter或groupBy等操作简单得多，只需要处理Dataset类型的DeviceIoTData对象即可。
4. 性能与优化
    1. DataFrame和Dataset API带来的空间效率和性能提升 因为DataFrame和Dataset API都是基于Spark SQL引擎构建的，它使用Catalyst来生成优化后的逻辑和物理查询计划。所有R、Java、Scala或Python的DataFrame/Dataset API，所有的关系型查询的底层使用的都是相同的代码优化器，因而会获得空间和速度上的效率。尽管有类型的Dataset[T] API是对数据处理任务优化过的，无类型的Dataset[Row]（别名DataFrame）却运行得更快，适合交互式分析。
    2. Spark作为一个编译器，它可以理解Dataset类型的JVM对象，它会使用编码器来把特定类型的JVM对象映射成Tungsten的内部内存表示。结果，Tungsten的编码器就可以非常高效地将JVM对象序列化或反序列化，同时生成压缩字节码，这样执行效率就非常高了。

### DataFrame

一个 DataFrame 是一个 Dataset 组成的指定列.它的概念与一个在关系型数据库或者在 R/Python 中的表是相等的, 但是有很多优化. DataFrames 可以从大量的 sources 中构造出来, 比如: 结构化的文本文件, Hive中的表, 外部数据库, 或者已经存在的 RDDs. DataFrame API 可以在 Scala, Java, Python, 和 R中实现. 在 Scala 和 Java中, DataFrame 由 DataSet 中的 RowS（多个 Row）来表示. 在 the Scala API中, DataFrame 仅仅是一个 Dataset[Row]类型的别名. 然而, 在 Java API中, 用户需要去使用 Dataset<Row> 去代表一个 DataFrame.

与RDD相似，DataFrame也是数据的一个不可变分布式集合。但与RDD不同的是，数据都被组织到有名字的列中，就像关系型数据库中的表一样。 **设计DataFrame的目的就是要让对大型数据集的处理变得更简单** ，它让开发者可以为分布式的数据集指定一个模式，进行更高层次的抽象。它提供了特定领域内专用的API来处理你的分布式数据，并让更多的人可以更方便地使用Spark，而不仅限于专业的数据工程师。

### RDD

### 该什么时候使用DataFrame或Dataset呢？

- 如果你需要丰富的语义、高级抽象和特定领域专用的API，那就使用DataFrame或Dataset；
- 如果你的处理需要对半结构化数据进行高级处理，如filter、map、aggregation、average、sum、SQL查询、列式访问或使用lambda函数，那就使用DataFrame或Dataset；
- 如果你想在编译时就有高度的类型安全，想要有类型的JVM对象，用上Catalyst优化，并得益于Tungsten生成的高效代码，那就使用Dataset；
- 如果你想在不同的Spark库之间使用一致和简化的API，那就使用DataFrame或Dataset；
- 如果你是R语言使用者，就用DataFrame；
- 如果你是Python语言使用者，就用DataFrame，在需要更细致的控制时就退回去使用RDD；

总之，在什么时候该选用RDD、DataFrame或Dataset看起来好像挺明显。前者可以提供底层的功能和控制，后者支持定制的视图和结构，可以提供高级和特定领域的操作，节约空间并快速运行。

参考
[RDD、DataFrame和DataSet的区别 - 简书](https://www.jianshu.com/p/c0181667daa0)


## RDD的互操作性

Spark SQL 支持两种不同的方法用于转换已存在的 RDD 成为 Dataset.第一种方法是使用反射去推断一个包含指定的对象类型的 RDD 的 Schema.在你的 Spark 应用程序中当你已知 Schema 时这个基于方法的反射可以让你的代码更简洁.

第二种用于创建 Dataset 的方法是通过一个允许你构造一个 Schema 然后把它应用到一个已存在的 RDD 的编程接口.然而这种方法更繁琐, 当列和它们的类型知道运行时都是未知时它允许你去构造 Dataset.