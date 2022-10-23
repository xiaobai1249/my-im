const express = require('express')
const Base64 = require('js-base64').Base64
const fs = require('fs')
const app = express()


const cors = require('cors');
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// 完整数据格式
// let data = {
//     "username": "lightwing",
//     "avator": url地址
//     "age": 18,
//     "phone": 13333333333,
//     "address": "江苏省南京市",
//     "gender": "male",
//     "selfSignature": '我的个性签名',
//     "id": "SOADFJKO3FJO12" // 随机生成
// }

//定义生成随机id的函数
function genID() {
    return Number(Math.random().toString().substring(3, 8) + Date.now()).toString(36);
}

// 注册
app.post('/reg', function(req, res) {
    let flag = true

    //验证用户名不能重复
    let arr = JSON.parse(fs.readFileSync("./data.json", 'utf8'))

    arr.forEach(function(item) {
        if (item.username == req.body.username) {
            flag = false;
            res.send({
                status: 1,
                message: '用户名重复，注册失败'
            });
        }
    })

    if (flag) {
        req.body.id = genID()
        arr.push(req.body);
        res.send({
            message: "注册成功",
            status: 0
        })
        fs.writeFile('./data.json', JSON.stringify(arr), function(err) {
            if (err) {
                return console.log('注册数据写入失败');
            }
        })
    }
})



// 登录
app.post('/login', function(req, res) {
    let flag = true
        // 接收客户端传递的用户名和密码  如果用户名对应的密码和用户传递的密码一致 表示登陆成功
    let { username, password } = req.body;
    let arr = JSON.parse(fs.readFileSync("./data.json", 'utf8'))
    arr.forEach(function(item) {
        if (item.username == username) {
            flag = false
                // 判断密码是否一致
            if (item.password == password) {
                res.send({
                    token: item.id,
                    message: "登录成功",
                    status: 0
                })
            } else {
                res.send({
                    message: "用户名或密码错误",
                    status: 1
                })
            }
        }
    })
    if (flag) {
        res.send({
            message: "用户名或密码错误",
            status: 1
        })
    }
});





// 获取个人资料
app.get('/getdata', function(req, res) {
    let flag = true
    let arr = JSON.parse(fs.readFileSync("./data.json", 'utf8'))
    let id = req.query.id
    for (let i = 0; i < arr.length; i++) {
        if (id == arr[i].id) {
            flag = false
            res.send({
                status: 0,
                message: '获取个人资料成功',
                data: arr[i]
            })
            break;
        }
    }

    if (flag) {
        res.send({
            status: 1,
            message: '获取个人资料失败',
        })
    }
})



/**
 *  获取个人资料
 *  http://loaclhost:3000
 *  params:{id:1}
 *  get
 * 
 */

// 修改个人资料
/**
 * url: http://loaclhost:3000
 * post
 * data：{id, username, age, phone, gender, address}
 * 
 */




app.post('/editdata', function(req, res) {
    let flag = true
    let arr = JSON.parse(fs.readFileSync("./data.json", 'utf8'))
    let data = null
    let num = 0

    let { id, username, age, phone, gender, address } = req.body


    if (!id) {
        flag = false
    } else {

        for (let i = 0; i < arr.length; i++) {
            if (username == arr[i].username) {
                num++
            }
        }

        if (num >= 1) {

            for (let i = 0; i < arr.length; i++) {
                if (id == arr[i].id) {
                    flag = false
                    arr[i] = {
                        id: id,
                        username: arr[i].username,
                        age: age ? age : "",
                        phone: phone ? phone : "",
                        gender: gender ? gender : "",
                        address: address ? address : "",
                        password: arr[i].password ? arr[i].password : '123456'
                    }
                    data = arr[i]
                }
            }

        } else {

            for (let i = 0; i < arr.length; i++) {
                if (id == arr[i].id) {
                    flag = false
                    arr[i] = {
                        id: id,
                        username: username ? username : "",
                        age: age ? age : "",
                        phone: phone ? phone : "",
                        gender: gender ? gender : "",
                        address: address ? address : "",
                        password: arr[i].password ? arr[i].password : '123456'
                    }
                    data = arr[i]
                }
            }
        }


    }

    if (flag) {
        res.send({
            status: 1,
            message: '修改个人资料失败',
        })
    } else {
        if (num >= 1) {

            res.send({
                status: 2,
                message: '用户名已存在，修改失败',
                data: data
            })

        } else {

            res.send({
                status: 0,
                message: '修改个人资料成功',
                data: data
            })
        }
        fs.writeFile('./data.json', JSON.stringify(arr), function(err) {
            if (err) {
                return console.log('注册数据写入失败');
            }
        })
    }
})

// 获取好友用户名(可修改的) 
app.post('/getnick', function(req, res) {
    let arr = JSON.parse(fs.readFileSync("./data.json", 'utf8'))
    let dataarr = req.body['data[]']
    if (typeof dataarr === 'string') {
        dataarr = [dataarr]
    }
    if (dataarr == undefined) {
        res.send({
            status: 0,
            message: "获取本地服务器好友用户名成功,没有好友",
        })
    } else {
        let resdata = []
        for (let i = 0; i < dataarr.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (dataarr[i] == arr[j].id) {
                    resdata.push({
                        username: arr[j].username,
                        userID: arr[j].id
                    })
                }
            }
        }

        res.send({
            status: 0,
            message: "获取本地服务器好友用户名成功",
            data: resdata
        })
    }
})

// 根据用户名获取id
app.get('/getid', function(req, res) {
    let flag = true
    let arr = JSON.parse(fs.readFileSync("./data.json", 'utf8'))
    let username = req.query.username

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].username == username) {
            flag = false
            res.send({
                status: 0,
                message: "获取id成功",
                data: arr[i].id
            })
            break;
        }
    }

    if (flag) {
        res.send({
            status: 1,
            message: "获取id失败，没有此用户"
        })
    }
})

app.listen(3000)