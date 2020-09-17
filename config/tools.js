const bcrypt = require("bcryptjs");
// 工具
const tools = {
  // 密码加密
  enbcrypt(password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
  },
};

module.exports = tools;
