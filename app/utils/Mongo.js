const { MongoClient } = require("mongodb")

class Mongo {
  constructor(url = process.env.DATABASE_URL) {
    this.client = new MongoClient(url)
  }

  async connect() {
    await this.client.connect()
    return this
  }

  db(name) {
    this.database = this.client.db(name)
    return this
  }

  collection(name) {
    return this.database.collection(name)
  }
}

module.exports = Mongo
