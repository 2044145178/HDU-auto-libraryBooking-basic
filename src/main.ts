import {User} from "./user";
import {CONFIG} from "./config";
import {DailyStrategy, WeeklyStrategy} from "./strategy";
import {RecurrenceRule, scheduleJob} from "node-schedule";
import {log,consoleLog} from "./log";
import {Rule, UsedRule} from "./rule";
import {STRATEGY} from "./config.strategy";

//加载策略
async function loadStrategy(): Promise<DailyStrategy | WeeklyStrategy | null> {
    let myStrategy: DailyStrategy | WeeklyStrategy;
    //获取Json里key为data的数据
    const rules = STRATEGY.rules;
    if (rules.length === 1) {
        myStrategy = new DailyStrategy(rules as Rule[][]);
    } else if (rules.length === 7) {
        myStrategy = new WeeklyStrategy(rules as Rule[][]);
    } else {
        await log("strategy配置错误，请检查后重试！")
        return null;
    }
    return myStrategy;
}

//接管尚未签到的座位预约
async function handleNotSignedBookings(user: User, myStrategy: DailyStrategy | WeeklyStrategy) {
    const bookedItems = await user.getNotSignedItems()
    for (let bookedItem of bookedItems) {
        //按整时计算：new Date(new Date(bookedItem.beginTime*1000).setMinutes(0,0,0)+(30*60-CONFIG.cancelLeftTime)*1000)
        //按开始时间计算
        await log(`接管已预约座位:${bookedItem.roomName}，${bookedItem.seatNum}，${"星期" + "日一二三四五六".charAt(new Date(bookedItem.beginTime * 1000).getDay())}\n开始时间：${new Date(bookedItem.beginTime * 1000).getHours()}，使用时长：${bookedItem.duration },\n${new Date(bookedItem.beginTime * 1000).toLocaleString()}`)
        const usedRule:UsedRule=new UsedRule(bookedItem.beginTime,bookedItem.duration,bookedItem.roomID,bookedItem.seatNum)
        await myStrategy?.autoCancelSeat(user, usedRule)
    }
}
//每日抢座实际主函数
async function run(user: User, myStrategy: DailyStrategy | WeeklyStrategy) {
    const rule = new RecurrenceRule();
    let todayIsBooked=false
    rule.hour=[20];
    rule.minute=[0,1,2,3];
    rule.second=[3,10,20,30,40,50];
    await log("ultimate plus G++版图书馆座位预约系统开始运行！！！！")
    scheduleJob(rule, async function () {
        if (!todayIsBooked){
            // if (await user.testBookingTime()){
                await consoleLog("预约开始"+new Date())
                if (await myStrategy?.autoBookSeat(user)){
                    todayIsBooked=true
                }
            // }
        }
    })
    const ruleClearFlag=new RecurrenceRule();
    ruleClearFlag.hour=10;
    ruleClearFlag.minute=0;
    ruleClearFlag.second=0;
    scheduleJob(ruleClearFlag, async function () {
        todayIsBooked=false//为第二天清空标志
    })
}
async function main() {
    const myStrategy = await loadStrategy();
    if (myStrategy === null) {
        return;
    }
    const user: User = await new User(CONFIG.username, CONFIG.password);
    await user.loginByPassword();
    await user.setSeatMap();
    await handleNotSignedBookings(user, myStrategy);
    await run(user, myStrategy);
}
main();

