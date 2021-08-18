const extra = require("../utils/extra")

class Request {
  constructor(raw) {
    this.raw = raw
  }

  get path() {
    return this.raw.url
  }

  get method() {
    return this.raw.method
  }

  get headers() {
    return this.raw.headers
  }

  get protocol() {
    return this.raw.socket.encrypted ? "https" : "http"
  }

  get host() {
    if (this.raw.headers["x-forwarded-host"]) {
      return extra.getLastEntryInMultiHeaderValue(this.raw.headers["x-forwarded-host"])
    }
    return this.raw.headers.host || this.raw.headers[":authority"]
  }

  get protocol() {
    if (this.raw.headers["x-forwarded-proto"]) {
      return extra.getLastEntryInMultiHeaderValue(this.raw.headers["x-forwarded-proto"])
    }

    return this.raw.socket.encrypted ? "https" : "http"
  }

  get url() {
    const base = `${this.protocol}://${this.host}`
    return new URL(extra.normalizeUrlPath(this.raw.url), base)
  }

  get query() {
    const q = {}
    this.url.searchParams.forEach((val, key) => {
      q[key] = val
    })
    return q
  }
}

module.exports = Request
