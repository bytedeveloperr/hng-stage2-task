const Server = require("./app/core/Server")
const path = require("path")
const body = require("./app/utils/body")
const Mongo = require("./app/utils/Mongo")
const Mail = require("./app/utils/Mail")
const { ObjectId } = require("mongodb")

const server = new Server()
const mongo = new Mongo()

;(async () => {
  ;(await mongo.connect()).db("main")

  server.router.get("/", (_req, res) => {
    res.renderFile(path.join(__dirname, "app/static/index.html"))
  })

  server.router.get("/message", async (req, res) => {
    try {
      const message = await mongo.collection("messages").findOne({ _id: ObjectId(req.query.id) })
      res.send(message)
    } catch (e) {
      res.status(500).send({ error: true, message: e.message || "An unkown error occured" })
    }
  })

  server.router.get("/message/view", (_req, res) => {
    res.renderFile(path.join(__dirname, "app/static/message.html"))
  })

  server.router.post("/process", async (req, res) => {
    try {
      const data = await body.read(req)

      if (data) {
        const { insertedId } = await mongo.collection("messages").insertOne({
          name: data.name,
          email: data.email,
          message: data.message,
        })

        if (insertedId) {
          const mail = new Mail()
          mail.setBody({
            subject: `Thank you for contacting me`,
            to: data.email,
            html: `
              <p>Hello ${
                data.name || data.email
              }, Thank you for contacting me. I'll get back to you as soon as possible.</p>
              <p>You can view the message you sent me here: <a href="${req.url.origin}/message/view?id=${insertedId}">${
              req.url.origin
            }/message/view?id=${insertedId}</a></p>
              <p><b>NB: This HNG Internship stage 2 task</b></p>
            `,
          })

          await mail.send()
        }

        res.redirect("/?message=Thank you for contacting me, please check you email.")
      }
    } catch (e) {
      res.status(500).send({ error: true, message: e.message || "An unkown error occured" })
    }
  })

  const PORT = process.env.PORT || 3000
  const HOST = process.env.HOST || "0.0.0.0"

  server.listen(PORT, HOST)
})()
