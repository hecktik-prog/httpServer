import http from 'http'
import fs from 'fs'
import path, { dirname } from 'path'

const port = 8080
const host = '127.0.0.1'

const __filename = 'index.html'
const __dirname = dirname(__filename)

let img500 = ''
fs.readFile('500.jpg', (error, data) => {
    img500 = data
})

let img404 = ''
fs.readFile('404.jpg', (error, data) => {
    img404 = data
})

const server = http.createServer((req, res) => {
    console.log(req.url, req.method)
    let pth = '', cssFlag = 0, flag404 = 0

    switch(req.url) {
        case '/':
            pth = path.join(__dirname,'index.html')
            res.statusCode = 200
            break

        // редирект
        case '/unavailable':
            pth = path.join(__dirname, 'unavailable.html')
            res.statusCode = 301
            res.setHeader('Location', '/')
            res.end()
            break

        // подгрузка стилей
        case '/index.css':
            pth = path.join(__dirname,'index.css')
            res.statusCode = 200
            cssFlag = 1
            break
        
        case '/list':
            pth = path.join(__dirname,'list.html')
            res.statusCode = 200
            break
        
        case '/choice':
            pth = path.join(__dirname, 'choice.html')
            res.statusCode = 200
            break
        default:
            res.statusCode = 404
            flag404 = 1
            break
        }

    fs.readFile(pth, (error, data) => {
        if (error) {
            res.setHeader('Content-Type', 'image/png')
            if (flag404 === 1) {
                res.end(img404)
                flag404 = 0
            } else {
                res.statusCode = 500
                res.end(img500)
            }
        } else  if (cssFlag === 0) {
            res.setHeader('Content-Type', 'text/html')
            res.write(data)
            res.end()
        } else if (cssFlag === 1){
            res.setHeader('Content-Type', 'text/css')
            res.write(data)
            res.end()
            cssFlag = 0
        }
    })
})
server.listen(port, host, () => {
    console.log(`Server is running on port ${port}`)
})