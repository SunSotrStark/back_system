const mysql = require('mysql')

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'back_system2'
})

module.exports = db