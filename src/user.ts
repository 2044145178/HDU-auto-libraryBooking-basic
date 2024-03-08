import axios from "axios";
import {bookSeatHeaders, LCHeaders, loginBody, roomMap, SBHeaders, searchBody, searchBody_new, URLS} from "./hduAPI";
import {generateToken, getCookie, getDateInNdays, sleep} from "./utils";
import {BookedItem} from "./interface";
import {consoleLog, log} from "./log";
import {BookStatus} from "./constant";
import {UsedRule} from "./rule";

export class User {
    private readonly username: string;
    private readonly password: string;
    cookies: string = "";
    tempSeatsMap: any = [];

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        
    }

    async testBookingTime(): Promise<boolean> {
        try {
            let rep = await axios.get(URLS.testBookingTime, {
                headers: SBHeaders(this.cookies),
            })
            // console.log(rep.data)
            const MAXDate = new Date(parseInt(rep.data.data.range.max_date) * 1000);
            console.log("当前最大预约时间" + MAXDate)
            console.log()
            this.cookies = getCookie(rep.headers["set-cookie"]);
            return MAXDate.getTime() == getDateInNdays(3).getTime();
        } catch (e) {
            console.log(e);
            await log("获取可预约时间失败！！！");
            return false;
        }
    }

    async loginByPassword(): Promise<boolean> {
        console.log("登录中。。。。。。。。。")
        try {
            let rep = await axios.post(URLS.login, loginBody(this.username, this.password), {
                headers: LCHeaders(""),
            })
            this.cookies = getCookie(rep.headers["set-cookie"]);
        } catch (e) {
            console.log(e);
            await log("登录失败！！！");
            return false;
        }
        return true;
    }

    async setSeatMap(): Promise<boolean> {
        const dateIn1daysSeconds = Math.floor(getDateInNdays(1).getTime() / 1000);//第二天0点的秒时间戳
        const beginTime = dateIn1daysSeconds + 8 * 60 * 60;
        const durationHour = 1;//单位为h
        for (let i = 0; i < roomMap.length; i++) {
            this.tempSeatsMap.push(0)
        }
        return (await this.searchSeats(beginTime, durationHour)) && (await this.searchSeats_new(beginTime,durationHour)) ;
    }

    async searchSeats_new(beginTime: number, durationHour: number): Promise<boolean> {//搜索自习室座位信息
        try {
            let rep = await axios.post(URLS.searchSeats, searchBody_new(beginTime, durationHour * 60 * 60), {
                headers: SBHeaders(this.cookies),
            })
            if (rep.data.ui_type === "ht.Seat.SysRecommendPage") {
                this.cookies = getCookie(rep.headers["set-cookie"]);
                const tempRooms = rep.data.allContent.children[2].children.children;
                for (let i = 0; i < roomMap.length; i++) {
                    for (let tempRoom of tempRooms) {
                        if (roomMap[i] === tempRoom.roomName) {
                            this.tempSeatsMap[i]=tempRoom;
                        }
                    }
                }
                return true
            } else {
                return false
            }
        } catch (e) {
            console.log(e);
            console.log("查询空闲座位错误！！！");
            return false;
        }
    }

    async searchSeats(beginTime: number, durationHour: number): Promise<boolean> {//搜索阅览室座位信息
        try {
            let rep = await axios.post(URLS.searchSeats, searchBody(beginTime, durationHour * 60 * 60), {
                headers: SBHeaders(this.cookies),
            })
            if (rep.data.ui_type === "ht.Seat.SysRecommendPage") {
                this.cookies = getCookie(rep.headers["set-cookie"]);
                const tempRooms = rep.data.allContent.children[2].children.children;
                for (let i = 0; i < roomMap.length; i++) {
                    for (let tempRoom of tempRooms) {
                        if (roomMap[i] === tempRoom.roomName) {
                            this.tempSeatsMap[i]=tempRoom;
                        }
                    }
                }
                return true
            } else {
                return false
            }
        } catch (e) {
            console.log(e);
            console.log("查询空闲座位错误！！！");
            return false;
        }
    }

    async bookSeat(rule: UsedRule): Promise<BookStatus> {
        let seats = this.tempSeatsMap[rule.roomID].seatMap.POIs;

        const uid = this.tempSeatsMap[rule.roomID].userInfo.id;
        if (seats.length < rule.targetSeatID || rule.targetSeatID <= 0) {
            await log("目标座位号不合法！！！请检查")
            return BookStatus.FAIL;
        }
        const seatID = seats[seats.length - rule.targetSeatID].id;
        try {
            const data={
                "beginTime": rule.beginTime,
                "duration": rule.durationHour * 60 * 60,
                "seats[0]": seatID,
                "seatBookers[0]": uid,
                "api_time": 0|new Date().getTime()/1000,
                "is_recommend":1,
            }
            let rep = await axios.post(URLS.bookSeats,data , {
                headers: bookSeatHeaders(this.cookies,generateToken(data)),
            })
            await sleep(3000);
            // console.log(SBHeaders(this.cookies))
            console.log(rep.data)
            this.cookies = getCookie(rep.headers["set-cookie"]);
            return rep.data.CODE === "ok" ? BookStatus.OK : BookStatus.FAIL;
        } catch (e) {
            console.log(e);
            return BookStatus.ERROR;
        }
    }

    async cancelSeat(bookID: number): Promise<boolean> {
        if (bookID === -1) {
            return false;
        }
        try {
            await axios.post(URLS.cancelBooking, null, {
                headers: LCHeaders(this.cookies),
                params: {
                    bookingId: bookID,
                }
            })
        } catch (e) {
            console.log(e);
            await log("自动取消失败！！！");
            return false;
        }
        return true;
    }

    async getNotSignedItems(): Promise<BookedItem[]> {
        try {
            let res: BookedItem[] = [];
            for (let i = 1; i < 6; i++) {
                let rep = await axios.get(URLS.bookedList+i, {
                    headers: LCHeaders(this.cookies),
                });
                let bookList: any = rep.data.items;
                for (let i = 0; i < bookList.length; i++) {
                    if (bookList[i].status === "0") {
                        for (let j = 0; j < roomMap.length; j++) {
                            if (roomMap[j] === bookList[i].roomName) {
                                res.push({
                                    roomName: bookList[i].roomName,
                                    seatNum: parseInt(bookList[i].seatNum),
                                    beginTime: parseInt(bookList[i].time),
                                    duration: parseInt(bookList[i].duration) / (60 * 60),
                                    roomID: j,
                                })
                            }
                        }
                    }
                }
            }
            return res;
        } catch (e) {
            console.log(e);
            await log("获得已预约列表出错！！！");
            return [];
        }
    }

    async getNotSignedID(beginTime: number): Promise<number> {
        try {
            for (let i = 1; i < 100; i++) {
                const rep = await axios.get(URLS.bookedList + i, {
                    headers: LCHeaders(this.cookies),
                });
                const bookList: any = rep.data.items;
                for (let i = 0; i < bookList.length; i++) {
                    if (parseInt(bookList[i].time) === beginTime) {
                        await consoleLog("当前座位状态：" + bookList[i].status);
                        if (bookList[i].status === "0") {
                            return bookList[i].id;
                        } else {
                            return -1;
                        }
                    }
                }
            }
            return -1;
        } catch (e) {
            console.log(e);
            await log("获得已预约列表出错！！！");
            return -1;
        }
    }
}



