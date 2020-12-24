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
        includeLevel: [2,3],
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
      description: '编程-手册'
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
        }
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
  return ['','算法基础','数据结构','算法']
}

function getArchitectureSidebar(){
  return ['architecture']
}

function getComputerSidebar(){
  return ['network']
}

function getDatabaseSidebar(){
  return []
}

function getOpsSidebar(){
  return ['ops']
}

function getJavaSidebar(){
  return [
    'jvm',
    'coding'
  ]
}

function getJavaSidebar(){
  return [
    'jvm',
    'coding'
  ]
}

function getJavaSidebar(){
  return [
    'jvm',
    'coding',
    '多线程',
    'java',
    '学习资源',
    {
      title: 'jvm进阶',
      collapsable: true,
      children: [
        'jvm进阶/01JVM与Java体系结构',
        'jvm进阶/02类加载子系统',
        'jvm进阶/03运行时数据区概念及线程',
        'jvm进阶/04程序计数器',
        'jvm进阶/05虚拟机栈',
        'jvm进阶/06本地方法接口',
        'jvm进阶/07本地方法栈',
        'jvm进阶/08堆',
        'jvm进阶/09方法区',
        'jvm进阶/10对象实例化内存布局及访问定位',
        'jvm进阶/11直接内存',
        'jvm进阶/12执行引擎',
        'jvm进阶/13StringTable',
        'jvm进阶/14垃圾回收概述'
      ]
    }
  ]
}


function getBigdataSidebar () {
  return [
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
        'flink/开源动态'
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
        'kafka/学习资源'
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
        'redis/Redis核心技术与实战'
      ]
    },
    'hive',
    'zookeeper',
    'data-mining',
    'solution',
    'design',
    'other'
  ]
}
