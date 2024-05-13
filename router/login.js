// 登录注册路由模块
const express = require('express')

const router = express.Router()

const loginHasndler = require('../router_handle/login')

const expressJoi = require('@escook/express-joi')

// 导入验证规则
const {
    login_limit
} = require('../limit/login')

// 注册
router.post('/register',expressJoi(login_limit),loginHasndler.register)
// 登录
router.post('/login',expressJoi(login_limit),loginHasndler.login)

module.exports = router