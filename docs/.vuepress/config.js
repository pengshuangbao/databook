const { fs, path } = require('@vuepress/shared-utils')
const slugify = require('@vuepress/shared-utils/lib/slugify')

module.exports = ctx => ({
  markdown: {
    // markdown-it-anchor 的选项
   // anchor: { permalink: false },
    // markdown-it-toc 的选项
    toc: { 
      //includeLevel: [2, 3]
    },
    extendMarkdown: md => {
      // 使用更多的 markdown-it 插件! 配置: https://github.com/Oktavilla/markdown-it-table-of-contents
      md.use(require("markdown-it-table-of-contents"), {
        includeLevel: [2,3,4],
        slugify:function(s){
          return slugify(s)
        }, 
        markerPattern: /^\[toc\]/im
      });
    }
  },
  dest: './dist',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: '编程手册',
      description: '苍穹浩渺,取之须臾'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  theme: '@vuepress/vue',
  themeConfig: {
    repo: 'pengshuangbao/databook',
    editLinks: true,
    docsDir: 'docs',
    smoothScroll: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Select language',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: require('./nav/en'),
        sidebar: {
          '/java/': getJavaSidebar(),
          '/bigdata/': getBigdataSidebar(),
          '/algorithm/': getAlgorithmSidebar(),
          '/architecture/': getArchitectureSidebar(),
          '/computer/': getComputerSidebar(),
          '/database/': getDatabaseSidebar(),
          '/ops/': getOpsSidebar(),
          '/programming/': getProgrammingSidebar(),
          '/book/':getBookSideBar(),
          '/interview/':getInterviewSideBar(),
          '/guide/':['','nav']
        },
        sidebarDepth: 3,
      }
    }
  },
  plugins: [
    ['@vuepress/back-to-top', true],
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: true
    }],
    ['@vuepress/medium-zoom', true],
    ['@vuepress/google-analytics', {
      ga: 'UA-128189152-1'
    }],
    ['container', {
      type: 'vue',
      before: '<pre class="vue-container"><code>',
      after: '</code></pre>'
    }],
    ['container', {
      type: 'upgrade',
      before: info => `<UpgradePath title="${info}">`,
      after: '</UpgradePath>'
    }],
    ['flowchart']
  ],
  extraWatchFiles: [
    '.vuepress/nav/en.js',
    '.vuepress/nav/zh.js'
  ]
})

function getAlgorithmSidebar(){
  return ['','数据结构','算法']
}
function getProgrammingSidebar(){
  return ['python','scala']
}
function getBookSideBar(){
  return ['tech','growth','geek','video']
}

function getInterviewSideBar(){
  return ['tech','hr','sword-to-offer']
}

function getArchitectureSidebar(){
  return [
    '',
    'architecture',
  {
    title: '测试',
    collapsable: true,
    children: [
      '测试/benchmark'
    ]
  },{
    title: '数据中台',
    collapsable: true,
    children: [
      '数据中台/DT时代转型中的数据中台建设'
    ]
  }]
}

function getComputerSidebar(){
  return ['','network','cpu','disk','memory']
}

function getDatabaseSidebar(){
  return ['']
}

function getOpsSidebar(){
  return ['','java']
}


function getJavaSidebar(){
  return [
    '',
    'jvm',
    'coding',
    '多线程',
    'java',
    '学习资源',
    'java核心技术',
    {
      title: 'jvm内存与垃圾回收',
      collapsable: true,
      children: [
        'jvm内存与垃圾回收/01JVM与Java体系结构',
        'jvm内存与垃圾回收/02类加载子系统',
        'jvm内存与垃圾回收/03运行时数据区概念及线程',
        'jvm内存与垃圾回收/04程序计数器',
        'jvm内存与垃圾回收/05虚拟机栈',
        'jvm内存与垃圾回收/06本地方法接口',
        'jvm内存与垃圾回收/07本地方法栈',
        'jvm内存与垃圾回收/08堆',
        'jvm内存与垃圾回收/09方法区',
        'jvm内存与垃圾回收/10对象实例化内存布局及访问定位',
        'jvm内存与垃圾回收/11直接内存',
        'jvm内存与垃圾回收/12执行引擎',
        'jvm内存与垃圾回收/13StringTable',
        'jvm内存与垃圾回收/15垃圾回收相关算法',
        'jvm内存与垃圾回收/16垃圾回收相关概念',
        'jvm内存与垃圾回收/16垃圾回收相关概念',
        'jvm内存与垃圾回收/17垃圾回收器'
      ]
    },
    {
      title: 'jvm字节码与类',
      collapsable: true,
      children: [
        'jvm字节码与类/01Class文件结构',
        'jvm字节码与类/02字节码指令集与解析举例',
        'jvm字节码与类/03类的加载过程详解',
        'jvm字节码与类/04再谈类的加载器'
      ]
    },
    {
      title: 'jvm性能监控与调优',
      collapsable: true,
      children: [
        'jvm性能监控与调优/01概述篇',
        'jvm性能监控与调优/02JVM监控及诊断工具-命令行篇',
        'jvm性能监控与调优/03JVM监控及诊断工具-GUI篇',
        'jvm性能监控与调优/04JVM运行时参数',
        'jvm性能监控与调优/05分析GC日志',
        'jvm性能监控与调优/补充-使用OQL语言查询对象信息',
        'jvm性能监控与调优/补充-浅堆深堆与内存泄露'
      ]
    }
  ]
}


function getBigdataSidebar () {
  return [
    '',
    {
      title: 'Hadoop',
      collapsable: true,
      children: [
        'hadoop/hadoop',
        'hadoop/hdfs',
        'hadoop/HDFS源码剖析',
        'hadoop/yarn',
        'hadoop/学习资源'
      ]
    },
    {
      title: 'Spark',
      collapsable: true,
      children: [
        'spark/spark-streaming',
        'spark/spark-sql',
        'spark/spark'
      ]
    },{
      title: 'Flink',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'flink/',
        'flink/通关手册',
        'flink/学习资源',
        'flink/开源动态',
        {
          title: '学习笔记',
          collapsable: true,
          children: [
            'flink/学习笔记/Flink State最佳实践'
          ]
        },
        {
          title: 'Flink实战与性能优化',
          collapsable: true,
          children: [
            'flink/Flink实战与性能优化/公司到底需不需要引入实时计算引擎？',
            'flink/Flink实战与性能优化/彻底了解大数据实时计算框架Flink',
            'flink/Flink实战与性能优化/大数据框架Flink、Blink、SparkStreaming、StructuredStreaming和Storm之间的区别',
            'flink/Flink实战与性能优化/Flink环境准备',
            'flink/Flink实战与性能优化/Flink环境搭建',
            'flink/Flink实战与性能优化/FlinkWordCount应用程序',
            'flink/Flink实战与性能优化/Flink实时处理Socket数据',
            'flink/Flink实战与性能优化/Flink多种时间语义对比',
            'flink/Flink实战与性能优化/FlinkWindow基础概念与实现原理',
            'flink/Flink实战与性能优化/数据转换必须熟悉的算子（Operator）',
            'flink/Flink实战与性能优化/如何使用DataStreamAPI来处理数据？',
            'flink/Flink实战与性能优化/FlinkWaterMark详解及结合WaterMark处理延迟数据',
            'flink/Flink实战与性能优化/Flink常用的Source和SinkConnectors介绍',
            'flink/Flink实战与性能优化/FlinkConnectorKafka使用和剖析',
            'flink/Flink实战与性能优化/如何自定义FlinkConnectors（Source和Sink）？',
            'flink/Flink实战与性能优化/如何使用FlinkConnectors——ElasticSearch？',
            'flink/Flink实战与性能优化/如何使用FlinkConnectors——HBase？',
            'flink/Flink实战与性能优化/如何使用FlinkConnectors——Redis？',
            'flink/Flink实战与性能优化/如何使用SideOutput来分流',
            'flink/Flink实战与性能优化/FlinkState深度讲解',
            'flink/Flink实战与性能优化/如何选择Flink状态后端存储',
            'flink/Flink实战与性能优化/FlinkCheckpoint和Savepoint区别及其如何配置使用？',
            'flink/Flink实战与性能优化/FlinkTable&SQL概念与通用API',
            'flink/Flink实战与性能优化/FlinkTableAPI&SQL功能',
            'flink/Flink实战与性能优化/FlinkCEP介绍及其使用场景',
            'flink/Flink实战与性能优化/FlinkCEP如何处理复杂事件？',
            'flink/Flink实战与性能优化/Flink扩展库——StateProcessorAPI',
            'flink/Flink实战与性能优化/Flink扩展库——MachineLearning',
            'flink/Flink实战与性能优化/Flink扩展库——Gelly',
            'flink/Flink实战与性能优化/Flink配置详解及如何配置高可用？',
            'flink/Flink实战与性能优化/FlinkJob如何在Standalone、YARN、Mesos、K8S上部署运行？',
            'flink/Flink实战与性能优化/如何实时监控Flink和你的Job？',
            'flink/Flink实战与性能优化/如何搭建一套完整的Flink监控系统',
            'flink/Flink实战与性能优化/如何处理FlinkJobBackPressure（反压）问题？',
            'flink/Flink实战与性能优化/如何查看FlinkJob执行计划？',
            'flink/Flink实战与性能优化/FlinkParallelism和Slot深度理解',
            'flink/Flink实战与性能优化/如何合理的设置FlinkJob并行度？',
            'flink/Flink实战与性能优化/Flink中如何保证ExactlyOnce？（上）',
            'flink/Flink实战与性能优化/Flink中如何保证ExactlyOnce？（下）',
            'flink/Flink实战与性能优化/如何处理Flink中数据倾斜问题？',
            'flink/Flink实战与性能优化/如何设置FlinkJobRestartStrategy（重启策略）？',
            'flink/Flink实战与性能优化/如何使用FlinkParameterTool读取配置？',
            'flink/Flink实战与性能优化/如何统计网站各页面一天内的PV和UV？',
            'flink/Flink实战与性能优化/如何使用FlinkProcessFunction处理宕机告警',
            'flink/Flink实战与性能优化/如何利用AsyncIO读取告警规则？',
            'flink/Flink实战与性能优化/如何利用广播变量动态更新告警规则？',
            'flink/Flink实战与性能优化/如何实时将应用Error日志告警？',
            'flink/Flink实战与性能优化/基于Flink的海量日志实时处理系统的实践',
            'flink/Flink实战与性能优化/基于Flink的百亿数据去重实践'
          ]
        }
      ],
    },{
      title: 'Kylin',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'kylin/',
        'kylin/学习资源',
        'kylin/开源动态'
      ]
    },{
      title: 'Kafka',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'kafka/',
        'kafka/学习资源',
        'kafka/Kafka核心技术与实战',
        'kafka/大数据集群资源评估'
      ]
    },{
      title: 'Hbase',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'hbase/',
        'hbase/学习资源',
        'hbase/开源动态',
        'hbase/性能优化'
      ]
    },{
      title: 'ClickHouse',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'clickhouse/',
        'clickhouse/学习资源'
      ]
    },{
      title: 'Impala',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'impala/',
        'impala/学习资源'
      ]
    },{
      title: 'Kudu',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'kudu/',
        'kudu/学习资源'
      ]
    },{
      title: 'CDH',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'CDH/',
        'CDH/学习资源'
      ]
    },{
      title: 'Redis',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'redis/',
        'redis/Redis核心技术与实战',
        'redis/Redis核心技术与实战实践篇'
      ]
    },
    {
      title: 'hive',
      collapsable: true,
      //sidebarDepth: 2,  
      children: [
        'hive/',
        'hive/面试题',
        'hive/全宇宙最强的25条Hive性能调优实战'
      ]
    },
    'zookeeper',
    'data-mining',
    'solution',
    'design',
    'other',
    'calcite',
    'antlr'
  ]
}
