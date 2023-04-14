(window.webpackJsonp=window.webpackJsonp||[]).push([[110],{570:function(a,t,u){"use strict";u.r(t);var v=u(14),l=Object(v.a)({},(function(){var a=this,t=a.$createElement,u=a._self._c||t;return u("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[u("h1",{attrs:{id:"kudu"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu"}},[a._v("#")]),a._v(" Kudu")]),a._v(" "),u("p"),u("div",{staticClass:"table-of-contents"},[u("ul",[u("li",[u("a",{attrs:{href:"#kudu的特点"}},[a._v("Kudu的特点")])]),u("li",[u("a",{attrs:{href:"#kudu和impla-的不足之处"}},[a._v("kudu和impla 的不足之处")]),u("ul",[u("li",[u("a",{attrs:{href:"#kudu主键的限制"}},[a._v("Kudu主键的限制")])]),u("li",[u("a",{attrs:{href:"#kudu列的限制"}},[a._v("Kudu列的限制")])]),u("li",[u("a",{attrs:{href:"#kudu表的限制"}},[a._v("Kudu表的限制")])]),u("li",[u("a",{attrs:{href:"#kudu单元-cells-的限制"}},[a._v("Kudu单元（Cells）的限制")])]),u("li",[u("a",{attrs:{href:"#kudu分片的限制"}},[a._v("Kudu分片的限制")])]),u("li",[u("a",{attrs:{href:"#kudu容量限制"}},[a._v("Kudu容量限制")])]),u("li",[u("a",{attrs:{href:"#kudu其他使用限制"}},[a._v("Kudu其他使用限制")])]),u("li",[u("a",{attrs:{href:"#impala的稳定性"}},[a._v("Impala的稳定性")])])])])])]),u("p"),a._v(" "),u("h2",{attrs:{id:"kudu的特点"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu的特点"}},[a._v("#")]),a._v(" Kudu的特点")]),a._v(" "),u("ol",[u("li",[u("a",{attrs:{href:"https://juejin.im/entry/5a72d3d1f265da3e4d730b37",target:"_blank",rel:"noopener noreferrer"}},[a._v("Kudu+Impala介绍 | 微店数据科学团队博客"),u("OutboundLink")],1)]),a._v(" "),u("li",[a._v("Kudu作为底层存储，在支持高并发低延迟kv查询的同时，还保持良好的Scan性能，该特性使得其理论上能够同时兼顾OLTP类和OLAP类查询")]),a._v(" "),u("li",[a._v("原意为非洲不同品种羚羊，速度快")])]),a._v(" "),u("h2",{attrs:{id:"kudu和impla-的不足之处"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu和impla-的不足之处"}},[a._v("#")]),a._v(" kudu和impla 的不足之处")]),a._v(" "),u("h3",{attrs:{id:"kudu主键的限制"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu主键的限制"}},[a._v("#")]),a._v(" Kudu主键的限制")]),a._v(" "),u("ul",[u("li",[a._v("表创建后主键不可更改；")]),a._v(" "),u("li",[a._v("一行对应的主键内容不可以被Update操作修改。要修改一行的主键值，需要删除并新增一行新数据，并且该操作无法保持原子性；")]),a._v(" "),u("li",[a._v("主键的类型不支持DOUBLE、FLOAT、BOOL，并且主键必须是非空的(NOT NULL)；")]),a._v(" "),u("li",[a._v("自动生成的主键是不支持的；")]),a._v(" "),u("li",[a._v("每行对应的主键存储单元(CELL)最大为16KB。")])]),a._v(" "),u("h3",{attrs:{id:"kudu列的限制"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu列的限制"}},[a._v("#")]),a._v(" Kudu列的限制")]),a._v(" "),u("ul",[u("li",[a._v("MySQL中的部分数据类型，如DECIMAL, CHAR, VARCHAR, DATE, ARRAY等不支持；")]),a._v(" "),u("li",[a._v("数据类型以及是否可为空等列属性不支持修改；")]),a._v(" "),u("li",[a._v("一张表最多有300列。")])]),a._v(" "),u("h3",{attrs:{id:"kudu表的限制"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu表的限制"}},[a._v("#")]),a._v(" Kudu表的限制")]),a._v(" "),u("ul",[u("li",[a._v("表的备份数必须为奇数，最大为7；")]),a._v(" "),u("li",[a._v("备份数在设置后不可修改。")])]),a._v(" "),u("h3",{attrs:{id:"kudu单元-cells-的限制"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu单元-cells-的限制"}},[a._v("#")]),a._v(" Kudu单元（Cells）的限制")]),a._v(" "),u("ul",[u("li",[a._v("单元对应的数据最大为64KB，并且是在压缩前。")])]),a._v(" "),u("h3",{attrs:{id:"kudu分片的限制"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu分片的限制"}},[a._v("#")]),a._v(" Kudu分片的限制")]),a._v(" "),u("ul",[u("li",[a._v("分片只支持手动指定，自动分片不支持；")]),a._v(" "),u("li",[a._v("分片设定不支持修改，修改分片设定需要”建新表-导数据-删老表”操作；")]),a._v(" "),u("li",[a._v("丢掉多数备份的Tablets需要手动修复。")])]),a._v(" "),u("h3",{attrs:{id:"kudu容量限制"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu容量限制"}},[a._v("#")]),a._v(" Kudu容量限制")]),a._v(" "),u("ul",[u("li",[a._v("建议tablet servers的最大数量为100；")]),a._v(" "),u("li",[a._v("建议masters的最大数量为3；")]),a._v(" "),u("li",[a._v("建议每个tablet server存储的数据最大为4T（此处存疑，为何会有4T这么小的限制？）；")]),a._v(" "),u("li",[a._v("每个tablet server存储的tablets数量建议在1000以内；")]),a._v(" "),u("li",[a._v("每个表分片后的tablets存储在单个tablet server的最大数量为60。")])]),a._v(" "),u("h3",{attrs:{id:"kudu其他使用限制"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#kudu其他使用限制"}},[a._v("#")]),a._v(" Kudu其他使用限制")]),a._v(" "),u("ul",[u("li",[a._v("Kudu被设计为分析的用途，每行对应的数据太大可能会碰到一些问题；")]),a._v(" "),u("li",[a._v("主键有索引，不支持二级索引(Secondary indexes)；")]),a._v(" "),u("li",[a._v("多行的事务操作不支持；")]),a._v(" "),u("li",[a._v("关系型数据的一些功能，如外键，不支持；")]),a._v(" "),u("li",[a._v("列和表的名字强制为UTF-8编码，并且最大256字节；")]),a._v(" "),u("li",[a._v("删除一列并不会马上释放空间，需要执行Compaction操作，但是Compaction操作不支持手动执行；")]),a._v(" "),u("li",[a._v("删除表的操作会立刻释放空间。")])]),a._v(" "),u("h3",{attrs:{id:"impala的稳定性"}},[u("a",{staticClass:"header-anchor",attrs:{href:"#impala的稳定性"}},[a._v("#")]),a._v(" Impala的稳定性")]),a._v(" "),u("ul",[u("li",[a._v("Impala不适合超长时间的SQL请求；")]),a._v(" "),u("li",[a._v("Impala不支持高并发读写操作，即使Kudu是支持的；")]),a._v(" "),u("li",[a._v("Impala和Hive有部分语法不兼容。")])])])}),[],!1,null,null,null);t.default=l.exports}}]);