(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{491:function(a,r,t){"use strict";t.r(r);var e=t(14),s=Object(e.a)({},(function(){var a=this,r=a.$createElement,t=a._self._c||r;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"编程设计"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#编程设计"}},[a._v("#")]),a._v(" 编程设计")]),a._v(" "),t("p"),t("div",{staticClass:"table-of-contents"},[t("ul",[t("li",[t("a",{attrs:{href:"#wordcount的实现过程-mapreduce实现"}},[a._v("WordCount的实现过程(Mapreduce实现)")])]),t("li",[t("a",{attrs:{href:"#海量url去重"}},[a._v("海量URL去重")])]),t("li",[t("a",{attrs:{href:"#海量数据排序"}},[a._v("海量数据排序")])]),t("li",[t("a",{attrs:{href:"#个数中找出最大的10000个数-top-k问题"}},[a._v("个数中找出最大的10000个数（top K问题）")])]),t("li",[t("a",{attrs:{href:"#已知某个文件内包含一些电话号码-每个号码为8位数字-统计不同号码的个数"}},[a._v("已知某个文件内包含一些电话号码,每个号码为8位数字,统计不同号码的个数")])]),t("li",[t("a",{attrs:{href:"#两个文件合并的问题-给定a、b两个文件-各存放50亿个url-每个url各占用64字节-内存限制是4g-如何找出a、b文件共同的url"}},[a._v("两个文件合并的问题：给定a、b两个文件,各存放50亿个url,每个url各占用64字节,内存限制是4G,如何找出a、b文件共同的url?")])]),t("li",[t("a",{attrs:{href:"#有-10-个文件-每个文件-1g-每个文件的每一行存放的都是用户的-query-每个文件的query-都可能重复要求你按照-query-的频度排序-还是典型的-top-k-算法"}},[a._v("有 10 个文件,每个文件 1G,每个文件的每一行存放的都是用户的 query,每个文件的query 都可能重复要求你按照 query 的频度排序 还是典型的 TOP K 算法,")])]),t("li",[t("a",{attrs:{href:"#给-40-亿个不重复的-unsigned-int-的整数-没排过序的-然后再给一个数-如何快速判断这个数是否在那-40-亿个数当中"}},[a._v("给 40 亿个不重复的 unsigned int 的整数,没排过序的,然后再给一个数,如何快速判断这个数是否在那 40 亿个数当中")])]),t("li",[t("a",{attrs:{href:"#有一个1g大小的一个文件-里面每一行是一个词-词的大小不超过16字节-内存限制大小是1m返回频数最高的100个词"}},[a._v("有一个1G大小的一个文件,里面每一行是一个词,词的大小不超过16字节,内存限制大小是1M返回频数最高的100个词")])]),t("li",[t("a",{attrs:{href:"#用mapreduce实现一个存储kv数据的文件-对里面的v进行全量排序"}},[a._v("用MapReduce实现一个存储kv数据的文件,对里面的v进行全量排序")])]),t("li",[t("a",{attrs:{href:"#spark-streaming-计算-pv、uv、跳出率"}},[a._v("Spark Streaming 计算 pv、uv、跳出率")])])])]),t("p"),a._v(" "),t("h2",{attrs:{id:"wordcount的实现过程-mapreduce实现"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#wordcount的实现过程-mapreduce实现"}},[a._v("#")]),a._v(" WordCount的实现过程(Mapreduce实现)")]),a._v(" "),t("h2",{attrs:{id:"海量url去重"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#海量url去重"}},[a._v("#")]),a._v(" 海量URL去重")]),a._v(" "),t("ol",[t("li",[a._v("通过BloomFilter去重，有一定的错误率")]),a._v(" "),t("li",[a._v("通过HDFS+MapReduce去重\n"),t("ul",[t("li",[a._v("使用一个reduce，map输入后将value输出，reduce得到相同的key后，value不管，则就可以去重了")]),a._v(" "),t("li",[t("a",{attrs:{href:"https://blog.csdn.net/lzq123_1/article/details/40895705",target:"_blank",rel:"noopener noreferrer"}},[a._v("Hadoop数据去重详解"),t("OutboundLink")],1)])])])]),a._v(" "),t("h2",{attrs:{id:"海量数据排序"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#海量数据排序"}},[a._v("#")]),a._v(" 海量数据排序")]),a._v(" "),t("ol",[t("li",[a._v("原理同上，使用一个reducer，map输入后将value输出，利用mr的自动排序，然后reducer中用一个全局的linenumer变量 进行排号，这个号自增的，根据value list ，有多少个value，就输出多少次,用于处理相同值")])]),a._v(" "),t("h2",{attrs:{id:"个数中找出最大的10000个数-top-k问题"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#个数中找出最大的10000个数-top-k问题"}},[a._v("#")]),a._v(" 个数中找出最大的10000个数（top K问题）")]),a._v(" "),t("ol",[t("li",[a._v("top K问题很适合采用MapReduce框架解决，用户只需编写一个Map函数和两个Reduce 函数，然后提交到Hadoop（采用Mapchain和Reducechain）上即可解决该问题。具体而言，")]),a._v(" "),t("li",[a._v("就是首先根据数据值或者把数据hash(MD5)后的值按照范围划分到不同的机器上，最好可以让数据划分后一次读入内存，这样不同的机器负责处理不同的数值范围，实际上就是Map。")]),a._v(" "),t("li",[a._v("得到结果后，各个机器只需拿出各自出现次数最多的前N个数据，然后汇总，选出所有的数据中出现次数最多的前N个数据，这实际上就是Reduce过程。")]),a._v(" "),t("li",[a._v("对于Map函数，采用Hash算法，将Hash值相同的数据交给同一个Reduce task；")]),a._v(" "),t("li",[a._v("对于第一个Reduce函数，采用HashMap统计出每个词出现的频率，对于第二个Reduce 函数，统计所有Reduce task，输出数据中的top K即可。")]),a._v(" "),t("li",[t("a",{attrs:{href:"https://blog.csdn.net/zyq522376829/article/details/47686867",target:"_blank",rel:"noopener noreferrer"}},[a._v("海量数据处理 - 10亿个数中找出最大的10000个数（top K问题）"),t("OutboundLink")],1)])]),a._v(" "),t("h2",{attrs:{id:"已知某个文件内包含一些电话号码-每个号码为8位数字-统计不同号码的个数"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#已知某个文件内包含一些电话号码-每个号码为8位数字-统计不同号码的个数"}},[a._v("#")]),a._v(" 已知某个文件内包含一些电话号码,每个号码为8位数字,统计不同号码的个数")]),a._v(" "),t("ol",[t("li",[a._v("本题最好的解决方法是通过使用"),t("strong",[a._v("位图")]),a._v("法来实现。8位整数可以表示的最大十进制数值为99999999。如果每个数字对应于位图中一个bit位，那么存储8位整数大约需要99MB。因为1B=8bit，所以99Mbit折合成内存为99/8=12.375MB的内存，即可以只用12.375MB的内存表示所有的8位数电话号码的内容。")]),a._v(" "),t("li",[t("a",{attrs:{href:"http://www.xuebuyuan.com/1304407.html",target:"_blank",rel:"noopener noreferrer"}},[a._v("用bitmap解决海量电话号码统计问题"),t("OutboundLink")],1)])]),a._v(" "),t("h2",{attrs:{id:"两个文件合并的问题-给定a、b两个文件-各存放50亿个url-每个url各占用64字节-内存限制是4g-如何找出a、b文件共同的url"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#两个文件合并的问题-给定a、b两个文件-各存放50亿个url-每个url各占用64字节-内存限制是4g-如何找出a、b文件共同的url"}},[a._v("#")]),a._v(" 两个文件合并的问题：给定a、b两个文件,各存放50亿个url,每个url各占用64字节,内存限制是4G,如何找出a、b文件共同的url?")]),a._v(" "),t("h2",{attrs:{id:"有-10-个文件-每个文件-1g-每个文件的每一行存放的都是用户的-query-每个文件的query-都可能重复要求你按照-query-的频度排序-还是典型的-top-k-算法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#有-10-个文件-每个文件-1g-每个文件的每一行存放的都是用户的-query-每个文件的query-都可能重复要求你按照-query-的频度排序-还是典型的-top-k-算法"}},[a._v("#")]),a._v(" 有 10 个文件,每个文件 1G,每个文件的每一行存放的都是用户的 query,每个文件的query 都可能重复要求你按照 query 的频度排序 还是典型的 TOP K 算法,")]),a._v(" "),t("h2",{attrs:{id:"给-40-亿个不重复的-unsigned-int-的整数-没排过序的-然后再给一个数-如何快速判断这个数是否在那-40-亿个数当中"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#给-40-亿个不重复的-unsigned-int-的整数-没排过序的-然后再给一个数-如何快速判断这个数是否在那-40-亿个数当中"}},[a._v("#")]),a._v(" 给 40 亿个不重复的 unsigned int 的整数,没排过序的,然后再给一个数,如何快速判断这个数是否在那 40 亿个数当中")]),a._v(" "),t("h2",{attrs:{id:"有一个1g大小的一个文件-里面每一行是一个词-词的大小不超过16字节-内存限制大小是1m返回频数最高的100个词"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#有一个1g大小的一个文件-里面每一行是一个词-词的大小不超过16字节-内存限制大小是1m返回频数最高的100个词"}},[a._v("#")]),a._v(" 有一个1G大小的一个文件,里面每一行是一个词,词的大小不超过16字节,内存限制大小是1M返回频数最高的100个词")]),a._v(" "),t("p",[a._v("顺序读文件中，对于每个词x，取hash(x)%5000，然后按照该值存到5000个小文件(记为x0,x1,...x4999)中。这样每个文件大概是200k左右。\n如果其中的有的文件超过了1M大小，还可以按照类似的方法继续往下分，直到分解得到的小文件的大小都不超过1M。 对每个小文件，统计每个文件中出现的词以及相应的频率(可以采用trie树/hash_map等)，并取出出现频率最大的100个词(可以用含100个结点的最小堆)，并把100个词及相应的频率存入文件，这样又得到了5000个文件。下一步就是把这5000个文件进行归并(类似与归并排序)的过程了。")]),a._v(" "),t("p",[t("a",{attrs:{href:"https://blog.csdn.net/wj1314250/article/details/80186642",target:"_blank",rel:"noopener noreferrer"}},[a._v("https://blog.csdn.net/wj1314250/article/details/80186642"),t("OutboundLink")],1)]),a._v(" "),t("h2",{attrs:{id:"用mapreduce实现一个存储kv数据的文件-对里面的v进行全量排序"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#用mapreduce实现一个存储kv数据的文件-对里面的v进行全量排序"}},[a._v("#")]),a._v(" 用MapReduce实现一个存储kv数据的文件,对里面的v进行全量排序")]),a._v(" "),t("h2",{attrs:{id:"spark-streaming-计算-pv、uv、跳出率"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#spark-streaming-计算-pv、uv、跳出率"}},[a._v("#")]),a._v(" Spark Streaming 计算 pv、uv、跳出率")])])}),[],!1,null,null,null);r.default=s.exports}}]);