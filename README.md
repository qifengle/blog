## Lipper - Api文档
使用 React + Redux + React Router + webpack 搭建个人博客
### 学习资料

[react小书](http://huziketang.com/books/react/)

[redux](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)

[React Router](http://www.ruanyifeng.com/blog/2016/05/react_router.html)

[webpack](http://www.jianshu.com/p/42e11515c10f)

### 技术栈
react + redux + react-router + ES6/7 + webpack + express
### 演示地址
[Lipper的个人博客](https://119.29.38.170)

域名还在备案中，暂时只能用ip地址访问

![blog url](imgs/img1.png)
## 开始使用
### 安装
```
git clone https://github.com/qifengle/blog.git
cd blog
npm install
```
#### 开发模式：
```
npm run dev
npm start
```
#### 产品模式：
```
npm run build
```
#### 端口更改
服务器启动默认端口为3000,若不想使用3000端口,可使用以下命令:
Mac/Linux
```
$ PORT=4000 node ./server/bin/www
```
windows 下使用 git-bash 或者 cmder 等终端执行以下命令:
```
$ set PORT=4000 && node app.js
```
### 代码目录
```js
+-- app/                      --- React博客前端页面
|   +--common                 --- 工具目录         
|   +--components             --- 组件目录                   
|   +--config                 --- 配置文件                
|   +--containers             --- 组件容器                    
|   +--enhancer                                 
|   ---inedx.html             --- 入口网页                    
|   ---Routes.js              --- 路由文件                   
|   ---store.js               --- redux store文件                  
+-- docs/                     --- 生成的文档地址
+-- node_modules/             --- npm下载的依赖文件目录
+-- files/                    --- 测试文件存储的文件目录
+-- logs/                     --- 生成的日志文件目录
+-- public/                   --- 存放压缩和打包后的资源文件              
|   --- index.html            --- 首页入口html文件
|   +-- apidoc                --- 接口文档
|   +-- image                 --- 压缩的图片地址
|   +-- plugins               --- 工具类
|   +-- scripts               --- 压缩的js文件
|   +-- static                --- 代码高亮js工具文件
|   +-- style                 --- css文件
+-- server                    --- node.js服务层
|   +-- bin                   --- 启动位置 node ./server/bin/www
|   +-- common                --- 工具目录  
|   +-- controller            --- 接口控制
|   +-- jobs                  --- 定时器
|   +-- public                --- 暂没用
|   +-- routes                --- 接口路由
|   +-- utils                 --- 插件（发送邮件，数据库数据转excel等）
|   +-- views                 --- 视图，暂没用，用react替换
|   --- app.js                --- 服务入口文件
|   --- db.js                 --- mysql数据库配置文件
|   --- redis.js              --- redis配置文件
--- .babelrc                  --- webpack 使用babel转换配置文件                  
--- .eslintrc                 --- 自定义eslint配置文件
--- dll.config.dev.js
--- dll.config.prod.js
--- webpack.config.dev.js
--- webpack.config.prod.js
--- package.json                                    
```
## 接口文档
### 主页
#### 1.获取侧边栏数据
**必选参数:**   
`无`

**请求方式:**   
`get,post`

**接口地址:**  
`/get-navside-info`  

**调用例子:**  
`http://localhost:3000/get-navside-info`  

**返回值:**  
```json
{
  "status": 1,
  "portrait": {                   //个人信息
    "intro": "我只想见见你",       //个人签名
    "viewCount": "96",            //访问量
    "articleCount": 30            //文章数
  },
  "articles": Array[10][
    {
      "id": 103,                  //文章id
      "title": "nodejs+mongodb"   //文章标题
    }
  ],
  "categories": Array[3][         //文章主题
    {
      "id": 3,                    //主题id
      "theme": "ES6"              //主题名称
    }
  ],
  "links": Array[0][              //亲情链接
    
  ],
  "tags": Array[13][              //文章标签
    "react.js",
    "node入门"
  ]
}
```
#### 2.获取首页文章列表
**必选参数:**   
`count` :  返回文章列表数目

`type`  :  返回文章类型 1==原创文章，2==转载文章

**请求方式:**   
`get,post`

**接口地址:**  
`/get-articles`  

**调用例子:**  
`http://localhost:3000/get-articles?count=1&type=2` 

**返回值**
```json
{
  "status": 1,
  "info": {
    "articles": Array[1][
      {
        "id": 104,
        "title": "let 和 const 命令",
        "tag": "阮一峰-ES6教程",
        "abstract": "let 和 const 命令let 命令块级作用域const 命令顶层对象的属性global 对象let 命令基本用法ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。{\n  let a = 10",
        "created_at": "2017-11-05",
        "views": 3,
        "theme": "ES6"
      }
    ]
  }
}
```