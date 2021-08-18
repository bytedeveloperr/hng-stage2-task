const extra = require("../utils/extra")

const methods = ["GET", "POST"]

class Router {
  constructor() {
    this.routes = []
  }

  #add(method, path, handler) {
    if (!methods.includes(method)) throw new Error(`Method ${method} is not supported`)
    path = extra.normalizeUrlPath(path)

    this.routes.push({ method, path, handler })
  }

  findRoute(path, method) {
    return this.routes.find((route) => route.path == path && route.method == method)
  }

  get(path, handler) {
    this.#add("GET", path, handler)
    return this
  }

  post(path, handler) {
    this.#add("POST", path, handler)
    return this
  }
}

module.exports = Router
