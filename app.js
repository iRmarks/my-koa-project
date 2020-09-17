// 引入
const Koa = require("koa");
const Router = require("koa-router");
const Mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
const passport = require("koa-passport");

// config
const db = require("./config/keys").mongoURI;

// 实例化
const app = new Koa();
const router = new Router();

app.use(bodyParser());

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

app.use(passport.initialize());
app.use(passport.session());

// 回调到config文件中 passport.js
require("./config/passport")(passport);

// 配置路由地址
router.use("/api/users", users);
// 配置路由
app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server started on ${port}`);
});
