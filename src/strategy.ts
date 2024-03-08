import {User} from "./user";
import {Rule, UsedRule} from "./rule";
import {CONFIG} from "./config";
import {scheduleJob} from "node-schedule";
import {getDateInNdays} from "./utils";
import {consoleLog, log} from "./log";
import {BookStatus} from "./constant";

abstract class Strategy {
    abstract getTodayRules(): Rule[];

    async autoBookSeat(user: User): Promise<boolean> {
        const rules = this.getTodayRules();//获取当天rule
        const dateIn2daysSeconds = Math.floor(getDateInNdays(2).getTime() / 1000);//预约两天之后的秒时间戳

        let flag = false;

        for (const rule of rules) {
            const beginTime = rule.beginHour * 3600 + dateIn2daysSeconds;
            const durationHour = rule.durationHour;
            for (let i = 0; i < rule.targetSeatIDs.length; i++) {
                const usedRule: UsedRule = new UsedRule(beginTime, durationHour, rule.roomID, rule.targetSeatIDs[i]);
                const status = await user.bookSeat(usedRule);
                if (status == BookStatus.OK) {
                    await log(`预约成功:${await rule.toString(i)}`);
                    await this.autoCancelSeat(user, usedRule);//开启循环预约
                    flag = true;
                    break;
                } else if (status == BookStatus.FAIL) {
                    await log(`!!!预约失败!!!:${await rule.toString(i)}\n将继续按策略抢座`);
                } else if (status == BookStatus.ERROR) {
                    await user.loginByPassword();
                    await log(`!!!error请查看!!!:${await rule.toString(i)}\n将继续按策略抢座`);
                }
            }
        }
        return flag;
    }
    //采用递归实现自动续约
    async autoCancelSeat(user: User, usedRule: UsedRule): Promise<void> {
        const date = new Date((usedRule.beginTime + 30 * 60 - CONFIG.cancelLeftTime) * 1000);
        scheduleJob(date, async () => {
            await consoleLog("自动续约功能开始启动！！！！")
            const bookID = await user.getNotSignedID(usedRule.beginTime);
            if (!await user.cancelSeat(bookID)) {
                await consoleLog("该座位已被签到，或已取消！")
                return;
            }
            usedRule.beginTime += 60 * 60;
            usedRule.durationHour -= 1;
            if (usedRule.durationHour === 0) {
                return;
            } else {
                const status = await user.bookSeat(usedRule);
                if (status == BookStatus.OK) {
                    await consoleLog("自动续约成功！！！")
                    await this.autoCancelSeat(user, usedRule);
                } else if (status == BookStatus.FAIL) {
                    await log(`!!!自动续约失败!!!:${await usedRule.toString()}`);
                } else if (status == BookStatus.ERROR) {
                    await user.loginByPassword();
                    await log(`!!!error请查看!!!:${await usedRule.toString()}`);
                }
            }
        });
    }
}

export class DailyStrategy extends Strategy {
    rules: Rule[] = [];

    constructor(rules: Rule[][]) {
        super();
        for (let rule of rules[0]) {
            this.rules.push(new Rule(rule.roomID, rule.targetSeatIDs, rule.beginHour, rule.durationHour))
        }
    }

    getTodayRules(): Rule[] {
        return this.rules;
    }
}

export class WeeklyStrategy extends Strategy {
    weeklyRules: Rule[][] = [];

    constructor(weeklyRules: Rule[][]) {
        super();
        for (let i = 0; i < 7; i++) {
            let tempRules: Rule[] = [];
            for (const weeklyRule of weeklyRules[i]) {
                tempRules.push(new Rule(weeklyRule.roomID, weeklyRule.targetSeatIDs, weeklyRule.beginHour, weeklyRule.durationHour))
            }
            this.weeklyRules.push(tempRules);
        }
    }

    getTodayRules(): Rule[] {
        return this.weeklyRules[getDateInNdays(2).getDay()];
    }
}



