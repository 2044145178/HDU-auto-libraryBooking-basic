export const STRATEGY={//TODO:将room和API返回数据解绑
// 编号:0综合第一书库（十一楼）
// 编号:1,综合第二书库（十楼）
// 编号:2,文学艺术书库（九楼）
// 编号:3,社会科学第二数据（八楼）
// 编号:4,自然科学第二书库（七楼）
// 编号:5,研修中心（六楼）
// 编号:6,社会科学书库（三楼北）
// 编号:7,社会科学书库（三楼西）
// 编号:8,自然科学书库（三楼东）
// 编号:9,"三楼大厅"
// 编号:10,"二楼电子阅览室"
// 编号:11,"四楼自习室"
// 编号:12,"二楼自习室"


    rules: [//如果是每日策略，则该二维数组为1行n列即可。如果为每周策略，需要填写7行，第一行为星期日策略。
        [//将按顺序依次执行目标策略，即可实现分时间段预约不同位置（原有的不同位置的冗余预约策略移除）
            {
                roomID: 11,//阅览室编号
                targetSeatIDs: [111],//目标座位号
                beginHour: 8,//预约开始时间，如9表示，9点开始
                durationHour: 14,//使用时长
            }
        ]
    ]
}