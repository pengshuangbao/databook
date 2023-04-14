(window.webpackJsonp=window.webpackJsonp||[]).push([[158],{616:function(a,t,s){"use strict";s.r(t);var e=s(14),n=Object(e.a)({},(function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("h1",{attrs:{id:"第十一章、直接内存"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#第十一章、直接内存"}},[a._v("#")]),a._v(" 第十一章、直接内存")]),a._v(" "),s("h3",{attrs:{id:"_8-4-1-直接内存概述"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_8-4-1-直接内存概述"}},[a._v("#")]),a._v(" 8.4.1. 直接内存概述")]),a._v(" "),s("p",[a._v("不是虚拟机运行时数据区的一部分，也不是《Java虚拟机规范》中定义的内存区域。"),s("mark",[a._v("直接内存是在Java堆外的、直接向系统申请的内存区间")]),a._v("。来源于NIO，通过存在堆中的DirectByteBuffer操作Native内存。通常，访问直接内存的速度会优于Java堆，即"),s("mark",[a._v("读写性能高")]),a._v("。")]),a._v(" "),s("ul",[s("li",[a._v("因此出于性能考虑，读写频繁的场合可能会考虑使用直接内存。")]),a._v(" "),s("li",[a._v("Java的NIO库允许Java程序使用直接内存，用于数据缓冲区")])]),a._v(" "),s("p",[s("img",{attrs:{src:"https://static.lovedata.net/20-11-30-1bcbfe3a87028a569efa8b9992c8d09a.png",alt:"image"}})]),a._v(" "),s("p",[s("img",{attrs:{src:"https://static.lovedata.net/20-11-30-d86859f7a6cfa5b3be21ab6741e58ba6.png",alt:"image"}})]),a._v(" "),s("h3",{attrs:{id:"_8-4-2-非直接缓存区"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_8-4-2-非直接缓存区"}},[a._v("#")]),a._v(" 8.4.2. 非直接缓存区")]),a._v(" "),s("p",[a._v("使用IO读写文件，需要与磁盘交互，需要由用户态切换到内核态。在内核态时，需要两份内存存储重复数据，效率低。")]),a._v(" "),s("p",[s("img",{attrs:{src:"https://static.lovedata.net/20-11-30-c4bc39811f5e15fe2057c97274f17d7e.png",alt:"image"}})]),a._v(" "),s("h3",{attrs:{id:"_8-4-3-直接缓存区"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_8-4-3-直接缓存区"}},[a._v("#")]),a._v(" 8.4.3. 直接缓存区")]),a._v(" "),s("p",[a._v("使用NIO时，操作系统划出的直接缓存区可以被java代码直接访问，只有一份。NIO适合对大文件的读写操作。")]),a._v(" "),s("p",[s("img",{attrs:{src:"https://static.lovedata.net/20-11-30-8c8e8f80e839a9b9beaf88588b1e5287.png",alt:"image"}})]),a._v(" "),s("p",[a._v("也可能导致OutOfMemoryError异常")]),a._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Exception")]),a._v(" in thread "),s("span",{pre:!0,attrs:{class:"token string"}},[a._v('"main"')]),a._v(" java"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("lang"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("OutOfMemoryError")]),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Direct")]),a._v(" buffer memory \n    at java"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("nio"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Bits")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("reserveMemory")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("Bits")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("java"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("693")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n    at java"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("nio"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("DirectByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token generics"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("<")]),a._v("init"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(">")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("DirectByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("java"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("123")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n    at java"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("nio"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("allocateDirect")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("ByteBuffer")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("java"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("311")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n    at com"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("atguigu"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("java"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("BufferTest2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("main")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[a._v("BufferTest2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("java"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("20")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n")])])]),s("p",[a._v("由于直接内存在Java堆外，因此它的大小不会直接受限于-Xmx指定的最大堆大小，但是系统内存是有限的，Java堆和直接内存的总和依然受限于操作系统能给出的最大内存。")]),a._v(" "),s("ul",[s("li",[a._v("分配回收成本较高")]),a._v(" "),s("li",[a._v("不受JVM内存回收管理")])]),a._v(" "),s("p",[a._v("直接内存大小可以通过"),s("code",[a._v("MaxDirectMemorySize")]),a._v("设置。如果不指定，默认与堆的最大值-Xmx参数值一致")]),a._v(" "),s("p",[s("img",{attrs:{src:"https://static.lovedata.net/21-06-03-d0eee039ec401e362838558dc1bf571d.png",alt:"image"}})]),a._v(" "),s("p",[s("img",{attrs:{src:"https://static.lovedata.net/20-11-30-8f85ea6a8e4a0dccb7c746420972e5fc.png",alt:"image"}})]),a._v(" "),s("p",[s("img",{attrs:{src:"https://static.lovedata.net/20-11-30-a6ab04e349b12bdc48751e6669861903.png",alt:"image"}})])])}),[],!1,null,null,null);t.default=n.exports}}]);