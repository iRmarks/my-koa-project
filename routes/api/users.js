const Router = require("koa-router");
const router = new Router();

// test
router.get("/test", async (ctx) => {
  ctx.status = 200;
  ctx.body = { msg: "users works..." };
});

module.exports = router.routes();
