// 用户详情
const express = require('express')

const router = express.Router()

const expressJoi = require('@escook/express-joi')

const userinfoHasndler = require('../router_handle/userinfo')

// 导入验证规则
const {
    name_limit,
    email_limit,
    password_limit
} = require('../limit/user')

// 上传头像
router.post('/uploadAvatar',userinfoHasndler.uploadAvatar)

// 绑定账号
router.post('/bindAccount',userinfoHasndler.bindAccount)

// 修改用户密码
router.post('/changePassword',expressJoi(password_limit),userinfoHasndler.changePassword)

// 获取用户信息
router.post('/getUserInfo',userinfoHasndler.getUserInfo)

// 修改姓名
router.post('/changeName',expressJoi(name_limit),userinfoHasndler.changeName)

// 修改性别
router.post('/changeSex',userinfoHasndler.changeSex)

// 修改邮箱
router.post('/changeEmail',expressJoi(email_limit),userinfoHasndler.changeEmail)

module.exports = router