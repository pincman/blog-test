# 构建一个简单的拥有用户登录，全文搜索，支持缓存的CMS系统

启用后

访问[http://127.0.0.1:3000/api-docs](http://127.0.0.1:3000/api-docs)查看端点文档

访问[http://127.0.0.1:3000/api](http://127.0.0.1:3000/api)调用端点

使用如下技术栈

-   nestjs
-   typeorm
-   sqlite
-   elasticsearch

安装与使用

```shell
pnpm i
pnpm start:dev
```

为了简便缓存使用内存缓存，如有需要自行在`src/config/cache.config.ts`中配置redis进行测试

同时没有编写tdd和e2e测试，注释比较简单，但是代码比较少并且清晰，可以一眼看掉

实现了这些功能

>   用户认证使用JWT实现，请使用token登录

-   用户登录与登出，以及个人信息查看
-   用户的`token`是无痛刷新的，可以通过`user.config.ts`进行配置令牌过期时间，过期后自动使用``refreshtoken`刷新一个新的返回给前端，同时`refreshtoken`的过期时间需要比`token`长
-   简单的用户管理CRUD(接口没有经过测试)
-   登录后可以创建，更新，删除文章，非登录者只能浏览文章
-   在文章列表中显示文章标题和评论以及作者信息，创建时间等
-   在文章详情中可以查看文章的内容
-   评论是匿名的
