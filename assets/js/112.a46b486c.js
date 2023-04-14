(window.webpackJsonp=window.webpackJsonp||[]).push([[112],{572:function(t,e,l){"use strict";l.r(e);var a=l(14),i=Object(a.a)({},(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[l("h1",{attrs:{id:"kylin"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#kylin"}},[t._v("#")]),t._v(" Kylin")]),t._v(" "),l("p"),l("div",{staticClass:"table-of-contents"},[l("ul",[l("li",[l("a",{attrs:{href:"#kylin-概述"}},[t._v("kylin 概述")])]),l("li",[l("a",{attrs:{href:"#kylin的构建原理"}},[t._v("kylin的构建原理")])]),l("li",[l("a",{attrs:{href:"#kylin的查询流程"}},[t._v("kylin的查询流程?")])])])]),l("p"),t._v(" "),l("h2",{attrs:{id:"kylin-概述"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#kylin-概述"}},[t._v("#")]),t._v(" kylin 概述")]),t._v(" "),l("p",[t._v("Hadoop平台上的开源OLAP引擎,多维立方体预计算技术，将sql提升到亚秒级别")]),t._v(" "),l("p",[l("img",{attrs:{src:"https://static.lovedata.net/jpg/2018/7/4/4bb2dc72ea9e7c1ca0fe7f39b39ee58a.jpg",alt:"image"}})]),t._v(" "),l("p",[t._v("空间换时间，线性增加的资源需求到线性降低的查询时间")]),t._v(" "),l("h2",{attrs:{id:"kylin的构建原理"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#kylin的构建原理"}},[t._v("#")]),t._v(" kylin的构建原理")]),t._v(" "),l("ol",[l("li",[l("p",[t._v("Apache Kylin Cube 构建原理")]),t._v(" "),l("ol",[l("li",[l("blockquote",[l("p",[l("a",{attrs:{href:"https://blog.bcmeng.com/post/kylin-cube.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("编程小梦|Apache Kylin Cube 构建原理"),l("OutboundLink")],1)])])]),t._v(" "),l("li",[l("p",[l("img",{attrs:{src:"https://static.lovedata.net/jpg/2018/7/10/05133de3b393e6366d11797a2386987b.jpg",alt:"image"}})])]),t._v(" "),l("li",[l("p",[l("img",{attrs:{src:"https://static.lovedata.net/jpg/2018/7/10/da963f940d5ec0716df33433d0d5811d.jpg",alt:"image"}})])])])]),t._v(" "),l("li",[l("p",[t._v("Apache Kylin On Druid Storage 原理与实践")]),t._v(" "),l("ol",[l("li",[l("blockquote",[l("p",[l("a",{attrs:{href:"https://blog.bcmeng.com/post/kylin-on-druid-storage.html#4-%E7%A7%BB%E9%99%A4kylin%E6%9F%A5%E8%AF%A2%E6%97%B6%E7%9A%84%E6%A0%B8%E5%BF%83%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84gtrecord",target:"_blank",rel:"noopener noreferrer"}},[t._v("编程小梦|Apache Kylin On Druid Storage 原理与实践"),l("OutboundLink")],1)])])])])]),t._v(" "),l("li",[l("p",[t._v("Kylin构建Cube过程详解")]),t._v(" "),l("ol",[l("li",[l("blockquote",[l("p",[l("a",{attrs:{href:"https://juejin.cn/post/6844903967671975943",target:"_blank",rel:"noopener noreferrer"}},[t._v("Kylin构建Cube过程详解"),l("OutboundLink")],1)])])]),t._v(" "),l("li",[l("p",[t._v("理念：空间换时间")])]),t._v(" "),l("li",[l("p",[t._v("HTable对应的RowKey，就是各种维度组合，指标存在Column中")])]),t._v(" "),l("li",[l("p",[t._v("将不同维度组合查询SQL，转换成基于RowKey的范围扫描，然后对指标进行汇总计算，以实现快速分析查询")])]),t._v(" "),l("li",[l("p",[l("img",{attrs:{src:"https://static.lovedata.net/21-06-17-fae29d95e812359f8bce6d36a5c0b199.png",alt:"image"}})])]),t._v(" "),l("li",[l("p",[t._v("步骤：")]),t._v(" "),l("ol",[l("li",[t._v("创建Hive事实表中间表。hive 外部表。根据cube定义，查询出度量 维度 插入到新表去")]),t._v(" "),l("li",[t._v("重新分配中间表 文件的有的大有的小，不均匀，重分区，一百万行一个文件")]),t._v(" "),l("li",[t._v("提取事实表不同列值。计算出每一个出现在事实表中的维度列的distinct值 写入文件，如果有的列dinstinct值过大，就会OOM")]),t._v(" "),l("li",[t._v("创建维度字典 上一步生成的distinct column文件和维度表计算出所有维度的子典信息，并以字典树的方式压缩编码，生成维度字典，目的是节约空间")]),t._v(" "),l("li",[t._v("保存Cuboid的统计信息")]),t._v(" "),l("li",[t._v("创建HTable。 列族的设置，默认是一个列族， 默认使用lzo压缩 kylin强依赖于HBase的coprocessor，所以需要在创建HTable为该表部署coprocessor，这个文件会首先上传到HBase所在的HDFS上，然后在表的元信息中关联")]),t._v(" "),l("li",[t._v("构建 spark or mr ，由底层向顶层构建，直到一个不带group by的sql")]),t._v(" "),l("li",[t._v("将Cuboid数据转换成HFile 接口插入性能差，使用 将Cuboid数据转换成HFile， bulkLoad的方式将文件和HTable进行关联，这样可以大大降低Hbase的负载")]),t._v(" "),l("li",[t._v("导HFile入HBase表 将HFile文件load到HTable中，这一步完全依赖于HBase的工具\n"),l("ol",[l("li",[t._v("key的格式由cuboid编号+每一个成员在字典树的id组成，value可能保存在多个列组里，包含在原始数据中按照这几个成员进行GROUP BY计算出的度量的值")])])]),t._v(" "),l("li",[t._v("更新Cube信息")]),t._v(" "),l("li",[t._v("清理")])])])])])]),t._v(" "),l("h2",{attrs:{id:"kylin的查询流程"}},[l("a",{staticClass:"header-anchor",attrs:{href:"#kylin的查询流程"}},[t._v("#")]),t._v(" kylin的查询流程?")]),t._v(" "),l("ol",[l("li",[l("p",[t._v("Kylin执行查询流程分析")]),t._v(" "),l("ol",[l("li",[l("blockquote",[l("p",[l("a",{attrs:{href:"https://blog.csdn.net/yu616568/article/details/50838504",target:"_blank",rel:"noopener noreferrer"}},[t._v("Kylin执行查询流程分析 - CSDN博客"),l("OutboundLink")],1)])])])])])])])}),[],!1,null,null,null);e.default=i.exports}}]);