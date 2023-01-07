const { getConfig } = require('./uid2config');

const danmuHandler = (uid, name, danmu) => {
    const config = getConfig(uid);
    const handler = config?.danmuHandler;
    const processedName = config?.name ?? name;
    return {
        processedName,
        force: !!config?.name,
        word: handler ? handler(danmu) : `${processedName}说:${danmu}`
    };
};

const enterHandler = (uid, name) => {
    const config = getConfig(uid);
    const handler = config?.enterHandler;
    const processedName = config?.name ?? name;
    return {
        processedName,
        force: !!config?.name,
        word: handler ? handler() : `欢迎${processedName}`
    };
};

const captainEnterHandler = uid => {
    const config = getConfig(uid);
    const handler = config?.enterHandler;
    const processedName = config?.name;
    // if (!processedName) {
    //     return `欢迎${uid}, 提款机你怎么还没给舰长大人一个亲切的称呼啊`;
    // }
    return handler ? handler() : `欢迎${processedName}`;
};

const followHandler = (uid, name) => {
    // const config = getConfig(uid);
    // const handler = config?.enterHandler;
    return ``;
};

const giftHandler = (uid, name, giftName, giftNum) => {
    const config = getConfig(uid);
    const handler = config?.giftHandler;
    const processedName = config?.name ?? name;
    return handler ? handler(giftName, giftNum) : `感谢${processedName}赠送的${giftNum}个${giftName}`;
};

const scHandler = (uid, name, message) => {
    const config = getConfig(uid);
    const handler = config?.scHandler;
    const processedName = config?.name ?? name;
    return handler ? handler(message) : `感谢${processedName}的sc:${message}`;
};

const guardBuyHandler = (uid, name, gift_name) => {
    const config = getConfig(uid);
    const handler = config?.guardBuyHandler;
    const processedName = config?.name ?? name;
    return handler ? handler() : `感谢${processedName}的${gift_name}, 感谢对小岩喵的支持, 提款机快磕一个`;
};

const userToastHandler = (uid, name, gift_name, day) => {
    const config = getConfig(uid);
    const handler = config?.guardBuyHandler;
    const processedName = config?.name ?? name;
    const dayWord = day ? `感谢${processedName}${day}天的陪伴, ` : '';
    return handler ? handler() : `感谢${processedName}的${gift_name}, ${dayWord}希望小岩喵以后也能继续给你带来欢乐`;
};

module.exports = {
    danmuHandler,
    enterHandler,
    captainEnterHandler,
    followHandler,
    giftHandler,
    scHandler,
    guardBuyHandler,
    userToastHandler
};
