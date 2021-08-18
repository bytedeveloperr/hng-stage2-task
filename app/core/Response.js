const fs = require("fs")

class Response {
  constructor(raw) {
    this.raw = raw
    this.statusCode = 200
    this.headers = {}
  }

  send(message) {
    switch (typeof message) {
      case "object":
        message = JSON.stringify(message)
        break
      case "number":
        message = String(message)
        break
    }

    this.raw.writeHead(this.statusCode, this.headers)
    this.raw.end(message)
  }

  status(code) {
    this.statusCode = code
    return this
  }

  redirect(url) {
    this.header("Location", url)
    return this.status(302).send()
  }

  renderFile(path) {
    if (!fs.statSync(path).isFile) {
      throw new Error(`Path ${path} must be a file`)
    }

    return fs.createReadStream(path).pipe(this.raw)
  }

  header(key, value) {
    if (Array.isArray(key) && !value) {
      this.headers = { ...this.headers, ...key }
    } else {
      this.headers[key] = value
    }

    return this
  }
}

module.exports = Response
