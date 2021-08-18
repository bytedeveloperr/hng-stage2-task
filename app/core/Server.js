const http = require("http")
const extra = require("../utils/extra")
const Request = require("./Request")
const Response = require("./Response")
const Router = require("./Router")

class Server {
  constructor() {
    this.server = http.createServer
    this.router = new Router()
  }

  respond() {
    try {
      return this.server(async (req, res) => {
        const request = new Request(req)
        const response = new Response(res)

        try {
          const route = this.router.findRoute(extra.normalizeUrlPath(request.url.pathname), request.method)
          if (!route) throw new Error("Route does not exist")

          route.handler(request, response)
        } catch (e) {
          response.send({ error: true, message: e.message || "An unknown error occured" })
        }
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  listen(port, host) {
    return new Promise((resolve, _reject) => {
      resolve(this.respond().listen(port, host))
    })
  }
}

module.exports = Server
