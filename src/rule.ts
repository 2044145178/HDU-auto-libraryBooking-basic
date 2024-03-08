import {getDateInNdays} from "./utils";
import {roomMap} from "./hduAPI";

export class Rule {
    roomID:number;
    targetSeatIDs:number[];
    beginHour:number;
    durationHour:number;
    constructor(roomID:number,targetSeatIDs:number[],beginHour:number,durationHour:number) {
        this.roomID=roomID;
        this.targetSeatIDs=targetSeatIDs;
        this.beginHour=beginHour;
        this.durationHour=durationHour;
    }
    async toString(index:number):Promise<string>{
        const dateIn0days=await getDateInNdays(0);//当天的毫秒时间戳
        const res=`${roomMap[this.roomID]},${this.targetSeatIDs[index]},${"星期" + "日一二三四五六".charAt(dateIn0days.getDay())},开始时间：${this.beginHour},使用时长：${this.durationHour},${dateIn0days.toLocaleString()}`;
        await console.log(res)
        return res;
    }
}
export class UsedRule {
    beginTime:number;
    durationHour:number;
    roomID:number;
    targetSeatID:number;
    constructor(beginTime: number, duration: number, roomID: number, targetSeatID: number) {
        this.beginTime = beginTime;
        this.durationHour = duration;
        this.roomID = roomID;
        this.targetSeatID = targetSeatID;
    }
    async toString():Promise<string>{
        const dateIn0days=await getDateInNdays(0);//当天的毫秒时间戳
        return `${roomMap[this.roomID]},${this.targetSeatID},${"星期" + "日一二三四五六".charAt(dateIn0days.getDay())}`;
    }
}
