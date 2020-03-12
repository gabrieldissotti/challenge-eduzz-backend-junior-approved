import fs from 'fs';

export default process.env.NODE_ENV === 'production'
  ? {
    key: fs.readFileSync(`${process.env.SSL_DIR}privkey.pem`),
    cert: fs.readFileSync(`${process.env.SSL_DIR}cert.pem`),
    ca: fs.readFileSync(`${process.env.SSL_DIR}chain.pem`),
  }
  : {};
