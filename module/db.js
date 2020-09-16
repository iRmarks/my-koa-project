//DB库
const MongoClient = require("mongodb").MongoClient;
const Config = require("./config.js");
class Db {
  static getInstance() {
    if (!Db.instance) {
      Db.instance = new Db();
    }
    return Db.instance;
  }

  constructor() {
    this.dbClient = "";
    this.connect();
  }
  connect() {
    /*连接数据库*/
    return new Promise((resolve, reject) => {
      if (!this.dbClient) {
        MongoClient.connect(Config.dbUrl, (err, client) => {
          if (err) {
            reject(err);
          } else {
            this.dbClient = client.db(Config.dbName);
            resolve(this.dbClient);
          }
        });
      } else {
        resolve(this.dbClient);
      }
    });
  }

  find(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        var result = db.collection(collectionName).find(json);
        result.toArray((err, docs) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(docs);
        });
      });
    });
  }
}

module.exports = Db.getInstance();
