const extra = {
  getLastEntryInMultiHeaderValue(headerValue) {
    const lastIndex = headerValue.lastIndexOf(",")
    return lastIndex === -1 ? headerValue.trim() : headerValue.slice(lastIndex + 1).trim()
  },
  normalizeUrlPath(path) {
    return path.replace(/([^:]\/)\/+/g, "$1").replace(/\/$/, "")
  },
}

module.exports = extra
