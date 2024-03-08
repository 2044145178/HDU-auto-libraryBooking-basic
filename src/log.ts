import {CONFIG} from "./config";
import axios from "axios";
import * as nodemailer from "nodemailer";

async function sendTextByPushdeer(msg: string): Promise<boolean> {
    let rep = await axios.post('https://api2.pushdeer.com/message/push', {
        pushkey: CONFIG.pushdeerToken,
        text: msg,
    });
    return rep.data.code === 0;
}

async function sendTextByEmail(msg: string): Promise<boolean> {
// 开启一个 SMTP 连接池
    const transporter = await nodemailer.createTransport({
        host: CONFIG.senderEmail.host,
        // port: CONFIG.senderEmail.port,
        secure: true,
        // secureConnection: true, // use SSL
        auth: {
            user: CONFIG.senderEmail.user,
            pass: CONFIG.senderEmail.pass
        }
    });

// 设置邮件内容（谁发送什么给谁）
    const mailOptions = {
        from: `${CONFIG.senderEmail.nickname}<${CONFIG.senderEmail.user}>`, // 发件人
        to: CONFIG.receiverEmail, // 收件人
        subject: 'HDU图书馆预约：'+msg.slice(0,Math.min(msg.length,10)), // 主题
        text: msg, // plain text body
        html: `<b>${msg}</b>`, // html body
        // 下面是发送附件，不需要就注释掉
        // attachments: [{
        //   filename: 'test.md',
        //   path: './test.md'
        // },
        //   {
        //     filename: 'content',
        //     content: '发送内容'
        //   }
        // ]
    };
// 使用先前创建的传输器的 sendMail 方法传递消息对象
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            return false;
        }
        // console.log(`Message: ${info.messageId}`);
        // console.log(`sent: ${info.response}`);
    });
    return true
}

export async function log(msg: string) {
    await console.log(new Date()+":")
    await console.log(msg);
    await console.log("######################################################################################################")
    await sendTextByPushdeer(msg);
    await sendTextByEmail(msg);
}
export async function consoleLog(msg: string) {
    await console.log(new Date()+":")
    await console.log(msg);
    await console.log("######################################################################################################")
}



