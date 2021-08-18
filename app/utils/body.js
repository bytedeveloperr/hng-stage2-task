const qs = require("querystring")

const body = {
  read(req) {
    return new Promise((resolve, reject) => {
      let body = ""

      req.raw.on("data", (chunk) => {
        body += "" + chunk
      })

      req.raw.on("end", () => {
        switch (req.headers["content-type"]) {
          case "application/x-www-form-urlencoded":
            resolve(qs.parse(body))
            break
          case "application/json":
            resolve(JSON.parse(body))
            break
        }
      })

      req.raw.on("error", (err) => {
        reject(err)
      })
    })
  },
}

module.exports = body
