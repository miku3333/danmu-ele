// const { requestAvatar } = require('./service/bilibili');
// const { requestAvatar } = require('./service/test');
const { LOCAL } = require('./constants');

const uid2config = {
    4208788: {
        name: '提款机',
        enterHandler: () => '欢迎提款机进入房间捏',
        // danmuHandler: danmu => `提款机说:${danmu}喵`
    },
    4852473: {
        name: '空宝',
    },
    2196231: {
        name: '阿寐',
    },
    29200995: {
        name: '妈咪',
    },
    37109256: {
        name: '莫迦',
    },
    1249012996: {
        name: '清清',
    },
    30368525: {
        name: '清清',
    },
    272430765: {
        name: '唐姨姨',
    },
    1084446596: {
        name: '狼宝',
    },
    511009997: {
        name: 'taboo',
    },
    24965470: {
        name: '霁百',
    },
    20266846: {
        name: '霁百',
    },
    701456: {
        name: '豹豹',
    },
    28202994: {
        name: '小绿',
    },
    12375052: {
        name: '雀雀',
    },
    1274576677: {
        name: '雀雀',
    },
    21761809: {
        name: '小林老师',
    },
    373388510: {
        name: '竹喵',
    },
    392327705: {
        name: '熊熊',
    },
    157298643: {
        name: '安喵',
    },
    20625246: {
        name: '断断',
    },
    385136367: {
        name: '顺顺',
    },
    340384482: {
        name: '叶神',
        enterHandler: () => '欢迎叶神驾到, 叶神看看实力, 威武士买瑞克',
    },
    6700649: {
        name: '兔子',
    },
    365738570: {
        name: '栗宝',
    },
    5716384: {
        name: '鸠老师',
    },
    22214483: {
        name: '南老师',
    },
    449724737: {
        name: '菇菇',
    },
};

const getConfig = (uid) => {
    let prevConfig = uid2config[uid];
    if (!prevConfig) {
        prevConfig = uid2config[uid] = {};
    }
    return prevConfig;
};

// const getConfigWithAvatar = async uid => {
//     let prevConfig = uid2config[uid];
//     let resultConfig = { ...prevConfig };
//     if (!prevConfig) {
//         prevConfig = uid2config[uid] = {};
//     }
//     // 获取头像
//     if (!prevConfig.avatar || prevConfig.avatar.includes('noface')) {
//         try {
//             const face = await requestAvatar(uid);
//             if (face) {
//                 const [_, path] = face.split('.com');
//                 prevConfig.avatar = `${LOCAL}${path}`;
//                 resultConfig.avatar = `${LOCAL}${path}`;
//                 // console.log(face);
//             } else {
//                 resultConfig.avatar = `${LOCAL}/bfs/face/member/noface.jpg`;
//             }
//         } catch (e) {
//             resultConfig.avatar = `${LOCAL}/bfs/face/member/noface.jpg`;
//             console.log(e);
//         }
//     }
//     console.log(resultConfig);
//     return resultConfig;
// };

const setConfig = (uid, config) => {
    let prevConfig = uid2config[uid];
    if (!prevConfig) {
        prevConfig = uid2config[uid] = {};
    }
    Object.entries(config).forEach(([key, value]) => {
        prevConfig[key] = value;
    });
};

module.exports = {
    getConfig,
    // getConfigWithAvatar,
    setConfig,
};
