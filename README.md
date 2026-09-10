# PlayOrbit MVP

无需构建的静态 H5 游戏站第一版，可直接发布到 Netlify。

## 本地预览

直接打开 `index.html`，或在目录中使用任意静态 HTTP 服务。

## 发布到 Netlify

1. 将此目录推送到 GitHub、GitLab 或 Bitbucket。
2. 在 Netlify 选择 **Add new site > Import an existing project**。
3. 选择该仓库。Netlify 会读取 `netlify.toml`，发布目录为根目录。
4. 发布完成后绑定自定义域名。

## 上传 H5 游戏

1. 在 Netlify 的 **Site configuration > Environment variables** 设置一个随机的 `UPLOAD_TOKEN`。
2. 部署后访问 `https://你的域名/upload.html`。
3. 填写游戏名称、URL 标识，选择 ZIP 并输入上传令牌。
4. ZIP 根目录必须直接含有 `index.html`；完成后游戏地址为 `/games/你的标识/`。

上传文件保存在 Netlify Blobs，不进入 Git 仓库。上传端点要求令牌验证；不要把令牌放在前台源码或公开分享。

## MVP 说明

- 运营后台为浏览器本地内容管理演示，数据保存在 `localStorage`。
- `app.js` 中的 `starterGames` 是首批游戏内容数据入口。
- 上线真实运营后台时，将游戏、资源、上传文件和管理员认证接入 Supabase；H5 游戏建议置于对象存储并以 iframe 加载。
