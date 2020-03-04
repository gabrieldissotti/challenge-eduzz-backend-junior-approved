import fs from 'fs'

export default process.env.BRANCH_ENV
  ? {
    key: fs.readFileSync(`${process.env.SSL_DIR}privkey.pem`),
    cert: fs.readFileSync(`${process.env.SSL_DIR}cert.pem`),
    ca: fs.readFileSync(`${process.env.SSL_DIR}chain.pem`)
  }
  : {}
