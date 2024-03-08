export const CONFIG={
    username:"",//学号
    password:"",//图书馆密码
    cancelLeftTime:300,//截止签到前取消时间（单位为s）
    senderEmail: {//发送通知信息的邮箱
        // 发信人信息
        host: 'smtp.qq.com', // 发送邮箱服务器域名
        port: 465, // 端口
        // service: '163',
        user: '', // 发件人邮箱账号
        pass: '', // 发件人邮箱的授权码 这里可以通过邮箱获取 并且不唯一
        nickname: '', // 发信人昵称
    },
    receiverEmail:'',//接受通知信息的邮箱
    pushdeerToken:'',//pushdeer APPtoken，不用留空即可
}








