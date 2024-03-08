import * as COOKIETOOL from 'cookie'
import md5 from "md5";

const SpecialKey = ["expires",]

function parseCookie(cookie: string): string {
    cookie.split(";")
    const tempCookie = COOKIETOOL.parse(cookie);
    for (let tempCookieKey in tempCookie) {
        if (!SpecialKey.includes(tempCookieKey)) {
            return COOKIETOOL.serialize(tempCookieKey, tempCookie[tempCookieKey]);
        }
    }
    return "";
}

export function getCookie(cookies: string[] | undefined): string {
    let res = "";
    if (cookies === undefined) {
        return res;
    }
    for (let cookie of cookies) {
        res += parseCookie(cookie) + ";";
    }
    res = res.slice(0, -1);
    return res
}

export function generateToken(data: any) {
    return btoa(md5("post&/Seat/Index/bookSeats?LAB_JSON=1&api_time" + data['api_time'] + "&beginTime" + data['beginTime'] + "&duration" + data['duration'] + "&is_recommend" + data['is_recommend'] + "&seatBookers[0]" + data['seatBookers[0]'] + "&seats[0]" + data['seats[0]']))
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function getDateInNdays(n: number): Date {//获取n天后0点时的date
    const milliseconds = new Date().getTime() + 1000 * 60 * 60 * 24 * n;
    return new Date(new Date(milliseconds).setHours(0, 0, 0, 0));
}

export function getSeconds(n: number, hour: number): number {
    const milliseconds = new Date().getTime() + 1000 * 60 * 60 * 24 * n;
    return Math.floor(new Date(new Date(milliseconds).setHours(hour, 0, 0, 0)).getTime() / 1000);
}
