# 前端

[toc]

## 参考面试题

1. [掘金-前端面试题2021](https://juejin.cn/post/6940945178899251230)
3. [fe-interview前端面试题](https://github.com/haizlin/fe-interview/)
3. [志青前端笔试题(无答案)](https://drive.google.com/file/d/1HSoOxHqwgj7x2Uv-G0RZAzHLbJ2T3GRB/view?usp=sharing)
4. [志青前端笔试题(带答案)](https://docs.google.com/document/d/1zu2TiQ7LR6Fgj-7pusu_TIiJQB_lwMHk/edit?usp=sharing&ouid=103444943281819345549&rtpof=true&sd=true)



## JavaScript

### setTimeout、Promise、Async/Await 的区别

#### 参考

- [使用 Promise - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)

#### Promise

1.  Promise 是一个对象，它代表了一个异步操作的最终完成或者失败

2.  Promise 是一个函数返回的对象，我们可以在它上面绑定回调函数

3.  异步函数调用,不同于以前传入回调，使用Promise有以下约定

   1. 在本轮 [事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop#执行至完成) 运行完成之前，回调函数是不会被调用的。
   2. 即使异步操作已经完成（成功或失败），在这之后通过 [`then()` ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)添加的回调函数也会被调用。
   3. 通过多次调用 `then()` 可以添加多个回调函数，它们会按照插入顺序进行执行。

4. 链式调用

   1. ```javascript
      doSomething().then(function(result) {
        return doSomethingElse(result);
      })
      .then(function(newResult) {
        return doThirdThing(newResult);
      })
      .then(function(finalResult) {
        console.log('Got the final result: ' + finalResult);
      })
      .catch(failureCallback);
      
      ```

### 你是如何做前端性能分析的？从哪些方面入手？有哪些指标？

#### 参考

- [谈一谈你知道的前端性能优化方案有哪些？](https://github.com/haizlin/fe-interview/issues/131)

#### 优化点

##### 客户端优化

- 减少http请求次数
- 使用CSS雪碧图（CSS Sprites）
- 减少DOM操作次数，优化javascript性能。
- 少用全局变量、减少DOM操作、缓存DOM节点查找的结果。减少IO读取操作。
- 图片预加载，将样式表放在顶部，将脚本放在底部 加上时间戳。
- 延迟加载 | 延迟渲染

##### 服务端优化

- 尽量减少响应的体积，比如用 gzip 压缩，优化图片字节数，压缩 css 和 js；或加快文件读取速度，优化服务端的缓存策略。
- 客户端优化 dom、css 和 js 的代码和加载顺序；或进行服务器端渲染，减轻客户端渲染的压力。
- 优化网络路由，比如增加 CDN 缓存；或增加并发处理能力，比如服务端设置多个域名，客户端使用多个域名同时请求资源，增加并发量。



### 普通函数和箭头函数的区别?

#### 参考

- [箭头函数 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [ES6 - 箭头函数、箭头函数与普通函数的区别](https://juejin.cn/post/6844903805960585224)

#### 区别

1. 语法更加简洁、清晰

2. 箭头函数不会创建自己的this 所以它没有自己的this，它只会从自己的作用域链的上一层继承this。它会捕获自己在定义时（注意，是定义时，不是调用时）所处的外层执行环境的this，并继承这个this值。所以，箭头函数中this的指向在它被定义的时候就已经确定了，之后永远不会改变

   1. ```javascript
      var id = 'Global';
      function fun1() {
          // setTimeout中使用普通函数
          setTimeout(function(){
              console.log(this.id);
          }, 2000);
      }
      function fun2() {
          // setTimeout中使用箭头函数
          setTimeout(() => {
              console.log(this.id);
          }, 2000)
      }
      fun1.call({id: 'Obj'});     // 'Global'
      fun2.call({id: 'Obj'});     // 'Obj'
      
      // 另外一个例子
      var id = 'GLOBAL';
      var obj = {
        id: 'OBJ',
        a: function(){
          console.log(this.id);
        },
        b: () => {
          console.log(this.id);
        }
      };
      
      obj.a();    // 'OBJ'
      obj.b();    // 'GLOBAL'
      // 定义对象的大括号{}是无法形成一个单独的执行环境的，它依旧是处于全局执行环境中！！
      ```

3. 箭头函数继承而来的this指向永远不变

4. .call()/.apply()/.bind()无法改变箭头函数中this的指向

5. 箭头函数不能作为构造函数使用

6. 箭头函数没有自己的arguments

7. 箭头函数没有原型prototype



### 什么是原型对象？

### .js .jsx .ts .tsx 的区别?

- `.js` is JavaScript, plain and simple

```js
const Foo = () => {
    return React.createElement("div", null, "Hello World!");
};
```

- `.ts` is [TypeScript](https://www.typescriptlang.org/), Microsoft's way of adding "concrete" types to JavaScript

```js
const Foo: FunctionalComponent = () => {
    return React.createElement("div", null, "Hello World!");
};
```

- `.jsx` is JavaScript but with [JSX](https://reactjs.org/docs/introducing-jsx.html) enabled which is React's language extension to allow you to write markup directly in code which is then compiled to plain JavaScript with the JSX replaced with direct API calls to `React.createElement` or whatever API is targeted

```js
const Foo = () => {
    return <div>Hello World!</div>;
};
```

- `.tsx` is similar to **jsx** except it's TypeScript with the JSX language extension.

```js
const Foo: FunctionalComponent = () => {
    return <div>Hello World!</div>;
};
```

All of these will compile down to JavaScript code. 



---



## React

### React 事件机制

![image](https://static.lovedata.net/21-09-22-6cf3de07a72f90a5a8f644ae315b6dee.png)

### 哪些方法会触发 React 重新渲染？重新渲染 render 会做些什么？

#### 参考

1. [哪些方法会触发 react 重新渲染](https://github.com/lgwebdream/FE-Interview/issues/913)

#### 什么时候?

1. setState() 方法被调用 ,但是不一定触发渲染，比如传入null，则不会
2. 父组件重新渲染
   1. 只要父组件渲染了，即使传入子的props没有发生变化，子组件也会重新渲染
3. forceUpdate()

#### 做些什么?

1. 会对新旧 VNode 进行对比，也就是我们所说的DoM diff。
2. 对新旧两棵树进行一个深度优先遍历，这样每一个节点都会一个标记，在到深度遍历的时候，每遍历到一和个节点，就把该节点和新的节点树进行对比，如果有差异就放到一个对象里面
3. 遍历差异对象，根据差异的类型，根据对应对规则更新VNode

### React声明组件有哪几种方法，有什么不同？

- 函数式定义的`无状态组件`
- ES5原生方式`React.createClass`定义的组件
- ES6形式的`extends React.Component`定义的组件

### 对有状态组件和无状态组件的理解及使用场景

### React setState 调用之后发生了什么？是同步还是异步？

###  React的生命周期有哪些？

![image](https://static.lovedata.net/21-09-22-05992fe5885b2a9caa70a03ed0edd752.png)



### 组件之间如何通信？

https://github.com/haizlin/fe-interview/issues/131)

### useState和useEffect的使用方法和原理

### react/vue中的key有什么作用？（key的内部原理是什么？）

```
1. 虚拟DOM中key的作用：
			1). 简单的说: key是虚拟DOM对象的标识, 在更新显示时key起着极其重要的作用。
			2). 详细的说: 当状态中的数据发生变化时，react会根据【新数据】生成【新的虚拟DOM】, 
												随后React进行【新虚拟DOM】与【旧虚拟DOM】的diff比较，比较规则如下：
						a. 旧虚拟DOM中找到了与新虚拟DOM相同的key：
										(1).若虚拟DOM中内容没变, 直接使用之前的真实DOM
										(2).若虚拟DOM中内容变了, 则生成新的真实DOM，随后替换掉页面中之前的真实DOM
						b. 旧虚拟DOM中未找到与新虚拟DOM相同的key
												根据数据创建新的真实DOM，随后渲染到到页面
```



### 为什么遍历列表时，key最好不要用index?

```
1. 若对数据进行：逆序添加、逆序删除等破坏顺序操作:
												会产生没有必要的真实DOM更新 ==> 界面效果没问题, 但效率低。
2. 如果结构中还包含输入类的DOM：
                        会产生错误DOM更新 ==> 界面有问题。

3. 注意！如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，
     仅用于渲染列表用于展示，使用index作为key是没有问题的。
```



### 开发中如何选择key?

```
1.最好使用每条数据的唯一标识作为key, 比如id、手机号、身份证号、学号等唯一值。
2.如果确定只是简单的展示数据，用index也是可以的。
```





## 算法相关

### 怎么计算一个数组的和?

![image](https://static.lovedata.net/21-10-06-ff68bd62caf3449a8847efccd4db7e31.png)



























