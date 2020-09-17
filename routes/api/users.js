const Router = require("koa-router");
const router = new Router();
const tools = require("../../config/tools");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("koa-passport");
// 引入User
const User = require("../../models/User");

// 引入input验证
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

/**
 * @route POST api/users/register
 * @desc 注册接口
 * @access 接口:公开
 */
router.post("/register", async (ctx) => {
  // console.log(ctx.request.body);
  const { errors, isValid } = validateRegisterInput(ctx.request.body);
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }

  // 存储到数据库
  const findResult = await User.find({ email: ctx.request.body.email });
  if (findResult.length > 0) {
    ctx.status = 500;
    ctx.body = { msg: "邮箱已被占用" };
  } else {
    const avatar = gravatar.url(ctx.request.body.email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      password: tools.enbcrypt(ctx.request.body.password),
      avatar,
    });
    // console.log(newUser);
    // 存储到数据库
    await newUser
      .save()
      .then((user) => {
        ctx.body = user;
      })
      .catch((err) => {
        console.log(err);
      });
    // 返回json数据
    ctx.body = newUser;
  }
});

/**
 * @route POST api/users/login
 * @desc 登陆接口地址 返回token
 * @access 接口:公开
 */
router.post("/login", async (ctx) => {
  const { errors, isValid } = validateLoginInput(ctx.request.body);
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  // 查询
  const findResult = await User.find({ email: ctx.request.body.email });
  const password = ctx.request.body.password;
  // 判断查没查到
  if (findResult.length == 0) {
    ctx.status = 404;
    ctx.body = { msg: "用户不存在！" };
  } else {
    // 存在 验证密码
    const user = findResult[0];
    var result = bcrypt.compareSync(password, user.password);

    // 验证通过
    if (result) {
      // 返回 token
      const payload = { id: user.id, name: user.name, avatar: user.avatar };
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });

      ctx.status = 200;
      ctx.body = { msg: "登录成功！", token: "Bearer " + token };
    } else {
      ctx.status = 400;
      ctx.body = { msg: "密码错误！" };
    }
  }
});

/**
 * @route GET api/users/current
 * @desc 用户信息接口地址 返回用户信息
 * @access 接口:私密
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (ctx) => {
    ctx.body = {
      id: ctx.state.user.id,
      name: ctx.state.user.name,
      email: ctx.state.user.email,
      avatar: ctx.state.user.avatar,
    };
  }
);

module.exports = router.routes();
