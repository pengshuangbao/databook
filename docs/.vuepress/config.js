const { fs, path } = require('@vuepress/shared-utils')

module.exports = ctx => ({
  dest: './dist',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: '狂想手册',
      description: '狂想-手册'
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
  return ['distribute']
}

function getComputerSidebar(){
  return ['network']
}

function getDatabaseSidebar(){
  return []
}

function getOpsSidebar(){
  return []
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
    '学习资源'
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
    },
    'hive',
    'impala',
    'kudu',
    'redis',
    'zookeeper',
    'data-mining',
    'solution',
    'design',
    'other'
  ]
}
