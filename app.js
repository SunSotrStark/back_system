const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// 解决跨域cors
const cors = require('cors')
app.use(cors())

// multer上传文件
const multer = require('multer')
const upload = multer({dest:'./public/upload'})
app.use(upload.any())
// 静态托管
app.use(express.static('./public'))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// 错误处理中间件
app.use((req,res,next)=>{
    // @ts-ignore
    res.cc = (err,status=1)=>{
        res.send({
            status,
            message:err instanceof Error ? err.message : err
        })
    }
    next()
})

const jwtconfig = require('./jwt_config/index')
const {expressjwt:jwt} = require('express-jwt')
// app.use(jwt({
//     secret:jwtconfig.jwtSecretKey,algorithms:['HS256']
// }).unless({
//     path:[/^\/api\//]
// }))

const Joi = require('joi')

const loginRouter = require('./router/login')
const userRouter = require('./router/userinfo')

app.use('/api',loginRouter)
app.use('/user',userRouter)

// 对不符合joi规则的情况进行报错
app.use((err,req,res,next)=>{
    if(err instanceof Joi.ValidationError) return res.cc(err)
})

app.listen(3007,()=>{
    console.log('http://127.0.0.1:3007');
})