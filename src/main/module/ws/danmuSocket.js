const WebSocket = require('ws');
const { SUCCESS_CODE, ROOM_ID, LOCAL, MESSAGE_MAP } = require('./constants');
const { getConfig, setConfig, getConfigWithAvatar } = require('./uid2config');

let server = null;
const wss = new WebSocket.Server({ port: 2333 });
wss.on('connection', ws => {
    console.log('本地ws启动');
    server = ws;
    ws.on('message', data => {
        ws.send(data.toString());
    });
});
wss.on('close', () => {
    console.log('本地ws关闭');
    server = null;
});

const danmuSocketSend = data => {
    const message = typeof data === 'object' ? JSON.stringify(data) : data;
    if (server) {
        server.send(message);
    } else {
        console.log('ws未连接');
    }
};

const sendHandler = async (type, data) => {
    // const timestamp = Date.now();
    const { avatar } = await getConfigWithAvatar(data.uid);
    let processedData = {
        type,
        avatar,
        timestamp: Date.now(),
        ...data
    };
    switch (type) {
        case MESSAGE_MAP.danmu: {
            break;
        }
        case MESSAGE_MAP.enter: {
            break;
        }
    }
    danmuSocketSend({
        code: SUCCESS_CODE,
        data: processedData
    });
};

module.exports = { sendHandler, danmuSocketSend };
