
const URLS={
    login:'https://hdu.huitu.zhishulib.com/api/1/login',
    searchSeats:'https://hdu.huitu.zhishulib.com/Seat/Index/searchSeats?LAB_JSON=1',
    bookSeats:'https://hdu.huitu.zhishulib.com/Seat/Index/bookSeats?LAB_JSON=1',
    cancelBooking:'https://hdu.huitu.zhishulib.com/Seat/Index/cancelBooking?bookingId=12050310&LAB_JSON=1',
    searchRooms:'https://hdu.huitu.zhishulib.com/Seat/Index/searchSeats?space_category%5Bcategory_id%5D=591&space_category%5Bcontent_id%5D=76&LAB_JSON=1',
    serachRooms_new:'beginTime=1695801600&duration=3600&num=1&space_category%5Bcategory_id%5D=591&space_category%5Bcontent_id%5D=3',
    bookedList:'https://hdu.huitu.zhishulib.com/Seat/Index/myBookingList?LAB_JSON=1&is_part=1&page_number=',//需提交分页参数
    testBookingTime:'https://hdu.huitu.zhishulib.com/Seat/Index/searchSeats?space_category%5Bcategory_id%5D=591&space_category%5Bcontent_id%5D=76&LAB_JSON=1',
}
function SBHeaders(cookies:string){//search book seats
    return {'Host':'hdu.huitu.zhishulib.com',
        'Connection':'keep-alive',
        'sec-ch-ua':'"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'accept':'application/json, text/plain, */*',
        'content-type':'application/x-www-form-urlencoded;charset=UTF-8',
        'sec-ch-ua-mobile':'?0',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        'sec-ch-ua-platform':'"Windows"',
        'Origin':'https://hdu.huitu.zhishulib.com',
        'Sec-Fetch-Site':'same-origin',
        'Sec-Fetch-Mode':'cors',
        'Sec-Fetch-Dest':'empty',
        'Referer':'https://hdu.huitu.zhishulib.com/',
        'Accept-Encoding':'gzip, deflate, br',
        'Accept-Language':'zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6',
        'Cookie':`web_language=zh-CN; org_id=104${cookies!==""?';'+cookies:""}`}
}
function bookSeatHeaders(cookies:string,api_token:string) {
    return {'Host':'hdu.huitu.zhishulib.com',
        'Connection':'keep-alive',
        'sec-ch-ua':'"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'accept':'application/json, text/plain, */*',
        'content-type':'application/x-www-form-urlencoded;charset=UTF-8',
        'sec-ch-ua-mobile':'?0',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        'sec-ch-ua-platform':'"Windows"',
        'Origin':'https://hdu.huitu.zhishulib.com',
        'Sec-Fetch-Site':'same-origin',
        'Sec-Fetch-Mode':'cors',
        'Sec-Fetch-Dest':'empty',
        'api-token': api_token,
        'Referer':'https://hdu.huitu.zhishulib.com/',
        'Accept-Encoding':'gzip, deflate, br',
        'Accept-Language':'zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6',
        'Cookie':`web_language=zh-CN; org_id=104${cookies!==""?';'+cookies:""}`}
}
function LCHeaders(cookies:string) {//login cancel
    return {'Host':'hdu.huitu.zhishulib.com',
        'Connection':'keep-alive',
        'sec-ch-ua':'"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'accept':'application/json, text/plain, */*',
        'content-type':'text/plain',
        'sec-ch-ua-mobile':'?0',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        'sec-ch-ua-platform':'"Windows"',
        'Origin':'https://hdu.huitu.zhishulib.com',
        'Sec-Fetch-Site':'same-origin',
        'Sec-Fetch-Mode':'cors',
        'Sec-Fetch-Dest':'empty',
        'Referer':'https://hdu.huitu.zhishulib.com/',
        'Accept-Encoding':'gzip, deflate, br',
        'Accept-Language':'zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6',
        'Cookie':`web_language=zh-CN; org_id=104${cookies!==""?';'+cookies:""}`};
    //替换cookie
}
function loginBody(username:string,password:string):string {
    return `{"login_name":"${username}","password":"${password}","ui_type":"com.Raw","code":"ad86f587f9c8c9ae5f258ed51fdc0ac3","str":"lJlDGZmFcAD6MrmR","org_id":"104","_ApplicationId":"lab4","_JavaScriptKey":"lab4","_ClientVersion":"js_xxx","_InstallationId":"6f328f67-b73e-0913-3593-98c0c498e8a4"}`
}
function searchBody(beginTime:number,duration:number) {
    // return `beginTime=${beginTime}&duration=${duration}&num=1&space_category[category_id]=591&space_category[content_id]=76`
    return {"beginTime":beginTime,"duration":duration,"num":1,"space_category[category_id]":'591',"space_category[content_id]":'76'};
}
function searchBody_new(beginTime:number,duration:number) {
    // return `beginTime=${beginTime}&duration=${duration}&num=1&space_category[category_id]=591&space_category[content_id]=76`
    return {"beginTime":beginTime,"duration":duration,"num":1,"space_category[category_id]":'591',"space_category[content_id]":'3'};
}
const roomMap=["综合第一书库（十一楼）"
    ,"综合第二书库（十楼）"
    ,"文学艺术书库（九楼）"
    ,"社会科学第二数据（八楼）"
    ,"自然科学第二书库（七楼）"
    ,"研修中心（六楼）"
    ,"社会科学书库（三楼北）"
    ,"社会科学书库（三楼西）"
    ,"自然科学书库（三楼东）"
    ,"三楼大厅"
    ,"二楼电子阅览室"
    ,"四楼自习室"
    ,"二楼自习室"
]
export {SBHeaders,LCHeaders,URLS,loginBody,searchBody,roomMap,bookSeatHeaders,searchBody_new};
