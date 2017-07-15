# cnode
基于webpack + react + react-router + redux + less + flex.css + ES6 的React版cnode社区

### demo
 [![demo](https://github.com/loudou140806/cnode/raw/master/clip/QR.png)](http://loumingjie.cn/cnode/)

### 下载
```
  git clone https://github.com/loudou140806/cnode.git
  cd cnode
  npm install (安装依赖模块)
  npm install webpack -g (没有安装webpack的需要安装)
```

### 运行（nodejs 6.0+）
```
  npm run dev (开发版本访问：http://localhost:8080/)
  npm run dist （发布生产版本）

```
### 功能
```
  1.登录退出
  2.列表分页，查看帖子
  3.发帖，回复帖子
  4.我的消息
  5.个人中心
  6.查看别人的资料
```

### 总结
```
  1.UI是参考![lzxb](https://github.com/lzxb)大神的。
  2.使用了flex.css模块布局，最大的感觉就是在写css不需要考虑在css中如何写布局，大大的提高了我的效率。
  3.在移动端中，列表数据达到上百条之后，性能仍然是不容乐乎，有待于进一步的优化。
  4.状态管理采用Redux,结合React-redux的Provider和connect API能够很方便的从state中取到数据传到子组件以及方便的在组件中触发相应的action，十分方便，使得开发更注重到UI层面，降低对状态层的关注。
  5.ES6中的箭头函数和变量解构赋值，最大的感受在开发效率上。提高很多。
  6.开发移动到应用，还是使用字体图标爽。
  7.借助webpack可以生成离线缓存清单，px转rem，ES6编译成ES5，模块化开发，代码压缩混淆......
  8.前端自动化，工程化，给前端的发展起到了很大的推动作用
```
### 截图

![截图](https://github.com/loudou140806/cnode/raw/master/clip/1.png)

![截图](https://github.com/loudou140806/cnode/raw/master/clip/2.png)

![截图](https://github.com/loudou140806/cnode/raw/master/clip/3.png)

![截图](https://github.com/loudou140806/cnode/raw/master/clip/4.png)

![截图](https://github.com/loudou140806/cnode/raw/master/clip/5.png)

![截图](https://github.com/loudou140806/cnode/raw/master/clip/6.png)

![截图](https://github.com/loudou140806/cnode/raw/master/clip/7.png)

