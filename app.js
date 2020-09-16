// 引入
const Koa = require("koa");
const Router = require("koa-router");
const path = require("path");
const Mongoose = require("mongoose");

// config
const db = require("./config/keys").mongoURI;
// 实例化
const app = new Koa();
const router = new Router();

// 引入users.js
const users = require("./routes/api/users");
// 路由
router.get("/", async (ctx) => {
  ctx.body = { msg: "Hello Koa App" };
});

// 连接数据库  sample_mflix comments
Mongoose.connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDb 连接成功");
  })
  .catch((err) => {
    console.log("连接失败", err);
  });
// 配置路由地址
router.use("/api/users", users);
// 配置路由
app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server started on ${port}`);
});
