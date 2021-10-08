module.exports = [
  {
    text: '导航',
    link: '/guide/'
  },
  {
    text: 'Java',
    link: '/java/'
  },{
    text: '大数据',
    link: '/bigdata/'
  },
  {
    text: '算法 ',
    link: '/algorithm/'
  },
  {
    text: '架构 ',
    link: '/architecture/'
  },
  {
    text: '计算机 ',
    link: '/computer/'
  },
  {
    text: '数据库 ',
    link: '/database/'
  },
   {
    text: '前端',
    link: '/fe/'
  },
  {
    text: '运维 ',
    link: '/ops/',
    items:[
      {
        text:'基础',
        link:'/ops/'
      },
      {
        text: '分类',
        items: [
          {
            text:'Java',
            link:'/ops/java.html'
          },
          {
            text:'大数据',
            link:'/ops/bigdata.html'
          }
        ]
      }
    ]
  },
  {
    text: '编程',
    ariaLabel: '编程',
    items:[
      {
        text: '语言',
        items: [
          {
            text:'Python',
            link:'/programming/python.html'
          },
          {
            text:'Scala',
            link:'/programming/scala.html'
          }
        ]
      }
    ]
  },
  {
    text: '资源',
    ariaLabel: '资源',
    items:[
      {
        text: '我的书单',
        items: [
          {
            text:'技术类',
            link:'/book/tech.html'
          },
          {
            text:'成长类',
            link:'/book/growth.html'
          }
        ]
      },
      {
        text:'网课',
        items:[
          {
            text: '专栏',
            link:'/book/geek.html'
          },
          {
            text: '视频',
            link:'/book/video.html'
          }
        ]
      },
      {
        text:'面经',
        items:[
          {
            text: '大厂面经',
            link:'/interview/tech.html'
          },
         
          {
            text: '剑指Offer',
            link:'/interview/sword-to-offer.html'
          },
          {
            text: '我的面经',
            link:'/interview/my-interview.html'
          },
          {
            text: '前端面经',
            link:'/interview/fe.html'
          },
          {
            text: '面试导航',
            link:'/interview/interview_guide.html'
          }
        ]
      },
      {
        text:'其他',
        items:[
          {
            text: '学习笔记',
            link:'/book/study.html'
          }
        ]
      }
    ]
  }
]
