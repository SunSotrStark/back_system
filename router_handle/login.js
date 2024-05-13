const db = require('../db/index')
// bcrypt加密中间件
const bcrypt = require('bcryptjs')
// 导入jwt，用于生成token
const jwt = require('jsonwebtoken')
const { jwtSecretKey } = require('../jwt_config')

// 注册
exports.register = (req, res) => {
    const reginfo = req.body
    // 判断传过来的账号密码是否为空
    if (!reginfo.account || !reginfo.password) {
        return res.send({
            status: 1,
            message: '账号或者密码不能为空'
        })
    }
    // 判断账号是否已被注册
    const sql = 'select * from users where account = ?'
    db.query(sql, reginfo.account, (err, result) => {
        if (result.length > 0) {
            return res.send({
                status: 1,
                message: '账号已存在'
            })
        }
        // 对密码进行加密
        reginfo.password = bcrypt.hashSync(reginfo.password, 10)
        // 将账号密码插入到users表
        const sql1 = 'insert into users set ?'
        const identity = '用户'
        const create_time = new Date()
        db.query(sql1, {
            account: reginfo.account,
            password: reginfo.password,
            identity,
            create_time,
            status: 0
        }, (err, result) => {
            // affectedRows为影响的行数
            if (result.affectedRows !== 1) {
                return res.send({
                    status: 1,
                    message: '账号注册失败'
                })
            }
            return res.send({
                status: 0,
                message: '账号注册成功'
            })
        })
    })
}

// 登录
exports.login = (req, res) => {
    const loginfo = req.body
    const sql = 'select * from users where account = ?'
    db.query(sql, loginfo.account, (err, result) => {
        if (err) return res.cc(err)
        if (result.length !== 1) return res.cc('登录失败')
        // 对密码进行解密验证
        const compareResult = bcrypt.compareSync(loginfo.password, result[0].password)
        if (!compareResult) {
            return res.cc('登录失败')
        }
        if (result[0].status == 1) {
            return res.cc('账号被冻结')
        }
        // 剔除加密后的密码，头像，创建时间，更新时间
        const user = {
            ...result[0],
            password: '',
            image_url: '',
            create_time: '',
            update_time: ''
        }
        // 设置token的有效时长
        const tokenStr = jwt.sign(user, jwtSecretKey, {
            expiresIn: '7h'
        })
        res.send({
            result: result[0],
            status: 0,
            message:'登录成功',
            token: 'Bearer ' + tokenStr
        })
    })
}