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
  return []
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
    'coding'
  ]
}


function getBigdataSidebar () {
  return [
    {
      title: 'Hadoop',
      collapsable: false,
      children: [
        '',
        'hadoop/hadoop',
        'hadoop/hdfs',
        'hadoop/yarn'
      ]
    },
    {
      title: 'Spark',
      collapsable: false,
      children: [
        'spark/spark-streaming',
        'spark/spark-sql',
        'spark/spark'
      ]
    },
    'flink',
    'hbase',
    'hive',
    'kafka',
    'kylin',
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
