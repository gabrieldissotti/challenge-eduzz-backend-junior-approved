import https from 'https'

import server from './app'
import certificate from './config/https'

if (process.env.NODE_ENV === 'production') {
  https.createServer(certificate, server).listen(process.env.API_PORT, function (err?: NodeJS.ErrnoException): void {
    if (err) console.log(err)

    console.log('🚀  Server is running with HTTPS')
  })
} else {
  server.listen(process.env.API_PORT || 3333, err => {
    if (err) console.log(err)
    const url = `http://localhost:${process.env.API_PORT || 3333}`

    console.log(`🚀  Server is running with HTTP at ${url}`)
  })
}
