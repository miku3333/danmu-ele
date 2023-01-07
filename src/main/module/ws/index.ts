import { getAvatar } from '../avatar/index';
import { RES_AVATAR_TYPE } from '../../constants';
const chalk = require('chalk');
const { EventEmitter } = require('events');
const speak = require('./speak');
const webSocket = require('./ws');
// const { danmuSocketSend, sendHandler } = require('./danmuSocket');
const { getConfig, setConfig } = require('./uid2config');
const { SUCCESS_CODE, ROOM_ID, LOCAL, MESSAGE_MAP } = require('./constants');
const {
    danmuHandler,
    enterHandler,
    captainEnterHandler,
    giftHandler,
    scHandler,
    guardBuyHandler,
    userToastHandler,
} = require('./handler');
import { sendDanmuMessage } from '../../utils';
// require('./proxy');
const eventEmitter = new EventEmitter();
//直播间号码
webSocket(ROOM_ID, eventEmitter);

//事件注册
function on(eventType: string, callback: any) {
    eventEmitter.on(eventType, function (data: any) {
        callback(data);
    });
}

on('LINK', function () {
    speak('连接成功!');
});

//进入直播间或关注直播间事件
on(
    'INTERACT_WORD',
    async ({
        msg_type,
        uid,
        uname,
    }: {
        msg_type: any;
        uid: number;
        uname: string;
    }) => {
        if (msg_type == 2) {
            const word = `感谢${uname}关注喵喵捏，关注小岩喵，喵，关注小岩喵，谢谢喵`;
            speak(word);
        } else {
            const { processedName, word, force } = enterHandler(uid, uname);
            speak(word, force);
            // sendHandler(MESSAGE_MAP.enter, {
            //     uid,
            //     name: processedName,
            //     enterMsg: word
            // });
        }
    }
);

// 舰长进入房间
on('ENTRY_EFFECT', function ({ uid }: { uid: number }) {
    const word = captainEnterHandler(uid);
    speak(word);
});

// 弹幕事件
on('DANMU_MSG', async (info: any) => {
    // 弹幕
    const danmu: string = info[1];
    // 发送者
    const [uid, name]: [number, string] = info[2];
    // 粉丝牌
    const fansData = info[3];
    const [fansLevel, fansName]: [number, string] = fansData;
    const fansUid = fansData[12];
    // prettier-ignore
    const fans =
        fansData.length === 0
            ? null
            : {
                fansLevel,
                fansName,
                fansUid
            };
    const { processedName, word, force } = danmuHandler(uid, name, danmu);
    speak(word, force);
    sendDanmuMessage({
        uid,
        name: processedName,
        danmu,
        fans,
    });
});

//礼物赠送事件
on(
    'SEND_GIFT',
    function ({
        giftName,
        num,
        uid,
        uname,
    }: {
        giftName: string;
        num: number;
        uid: number;
        uname: string;
    }) {
        const word = giftHandler(uid, uname, giftName, num);
        speak(word);
    }
);

// 礼物连击
on(
    'COMBO_SEND',
    function ({
        gift_name,
        combo_num,
        uid,
        uname,
    }: {
        gift_name: string;
        combo_num: number;
        uid: number;
        uname: string;
    }) {
        const word = giftHandler(uid, uname, gift_name, combo_num);
        speak(word);
    }
);

on('WELCOME', function (data: any) {
    speak('WELCOME出现');
    console.log(data);
});

on(
    'SUPER_CHAT_MESSAGE',
    function ({
        uid,
        message,
        user_info: { uname },
    }: {
        uid: number;
        message: string;
        user_info: { uname: string };
    }) {
        const word = scHandler(uid, uname, message);
        speak(word);
        console.log(chalk.red(word));
    }
);

on(
    'SUPER_CHAT_MESSAGE_JPN',
    function ({
        uid,
        message,
        user_info: { uname },
    }: {
        uid: number;
        message: string;
        user_info: { uname: string };
    }) {
        const word = scHandler(uid, uname, message);
        speak(word);
        console.log(chalk.red(word));
    }
);

on(
    'GUARD_BUY',
    function ({
        uid,
        username,
        gift_name,
    }: {
        uid: number;
        username: string;
        gift_name: string;
    }) {
        const word = guardBuyHandler(uid, username, gift_name);
        speak(word);
        console.log(chalk.red(word));
    }
);

on(
    'USER_TOAST_MSG',
    function ({
        uid,
        username,
        role_name,
        toast_msg,
    }: {
        uid: number;
        username: string;
        role_name: string;
        toast_msg: string;
    }) {
        const word = userToastHandler(
            uid,
            username,
            role_name,
            /[\d]+/.exec(toast_msg)![0]
        );
        speak(word);
        console.log(chalk.red(word));
    }
);

on('NOTICE_MSG', function (data: any) {});
