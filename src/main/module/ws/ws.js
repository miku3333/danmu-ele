const chalk = require('chalk');
const WebSocket = require('ws');
const makeBrotliDecode = require('./decode');

//生成认证数据
function getCertification(json) {
    let encoder = new TextEncoder(); //编码器
    let jsonView = encoder.encode(json); //utf-8编码
    let buff = new ArrayBuffer(jsonView.byteLength + 16); //数据包总长度：16位头部长度+bytes长度
    let view = new DataView(buff); //新建操作视窗
    view.setUint32(0, jsonView.byteLength + 16); //整个数据包长度
    view.setUint16(4, 16); //头部长度
    view.setUint16(6, 1); //协议版本
    view.setUint32(8, 7); //类型,7为加入房间认证
    view.setUint32(12, 1); //填1
    for (let r = 0; r < jsonView.byteLength; r++) {
        view.setUint8(16 + r, jsonView[r]); //填入数据
    }
    return buff;
}

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

function handleMessage(blob, call) {
    const arrayBuffer = toArrayBuffer(blob);
    let decoder = new TextDecoder(); //解码器
    let view = new DataView(arrayBuffer); //视图
    let offset = 0;
    let packet = {};
    let result = [];
    while (offset < arrayBuffer.byteLength) {
        //数据提取
        let packetLen = view.getUint32(offset + 0);
        let headLen = view.getUint16(offset + 4);
        let packetVer = view.getUint16(offset + 6);
        let packetType = view.getUint32(offset + 8);
        let num = view.getUint32(12);
        if (packetVer == 3) {
            //解压数据
            let brArray = new Uint8Array(
                arrayBuffer,
                offset + headLen,
                packetLen - headLen
            );
            let BrotliDecode = makeBrotliDecode(); //生成Brotli格式解压工具的实例
            let buffFromBr = BrotliDecode(brArray); //返回Int8Array视图
            let view = new DataView(buffFromBr.buffer);
            let offset_Ver3 = 0;
            while (offset_Ver3 < buffFromBr.byteLength) {
                //解压后数据提取
                let packetLen = view.getUint32(offset_Ver3 + 0);
                let headLen = view.getUint16(offset_Ver3 + 4);
                let packetVer = view.getUint16(offset_Ver3 + 6);
                let packetType = view.getUint32(offset_Ver3 + 8);
                let num = view.getUint32(12);
                packet.Len = packetLen;
                packet.HeadLen = headLen;
                packet.Ver = packetVer;
                packet.Type = packetType;
                packet.Num = num;
                let dataArray = new Uint8Array(
                    buffFromBr.buffer,
                    offset_Ver3 + headLen,
                    packetLen - headLen
                );
                packet.body = decoder.decode(dataArray); //utf-8格式数据解码，获得字符串
                result.push(JSON.stringify(packet)); //数据打包后传入数组
                offset_Ver3 += packetLen;
            }
        } else {
            packet.Len = packetLen;
            packet.HeadLen = headLen;
            packet.Ver = packetVer;
            packet.Type = packetType;
            packet.Num = num;
            let dataArray = new Uint8Array(
                arrayBuffer,
                offset + headLen,
                packetLen - headLen
            );
            if (packetType == 3) {
                //获取人气值
                packet.body = new DataView(
                    arrayBuffer,
                    offset + headLen,
                    packetLen - headLen
                ).getUint32(0); //若入参为dataArray.buffer，会返回整段buff的视图，而不是截取后的视图
            } else {
                packet.body = decoder.decode(dataArray); //utf-8格式数据解码，获得字符串
            }
            result.push(JSON.stringify(packet)); //数据打包后传入数组
        }
        offset += packetLen;
    }
    call(result); //数据后续处理
}

function webSocket(roomid, eventEmitter) {
    let timer;
    const ws = new WebSocket('wss://broadcastlv.chat.bilibili.com:443/sub');
    ws.onopen = function (e) {
        const certification = {
            uid: 0,
            roomid,
            protover: 3,
            platform: 'web',
            type: 2,
            key: '', //值为空字符串好像也没问题
        };
        ws.send(getCertification(JSON.stringify(certification)));
        //发送心跳包
        timer = setInterval(function () {
            let buff = new ArrayBuffer(16);
            let i = new DataView(buff);
            i.setUint32(0, 0); //整个封包
            i.setUint16(4, 16); //头部
            i.setUint16(6, 1); //协议版本
            i.setUint32(8, 2); //操作码,2为心跳包
            i.setUint32(12, 1); //填1
            ws.send(buff);
        }, 30000);
    };

    ws.onmessage = function (e) {
        //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
        //console.log(e.data);
        let blob = e.data;
        handleMessage(blob, function (result) {
            result.forEach((item) => {
                const { Type, body } = JSON.parse(item);
                switch (Type) {
                    case 5:
                        const {
                            cmd: originalCmd,
                            data,
                            info,
                        } = JSON.parse(body);
                        const cmd = originalCmd.startsWith('DANMU_MSG')
                            ? 'DANMU_MSG'
                            : originalCmd;
                        // if (['SUPER_CHAT_MESSAGE_JPN', 'SUPER_CHAT_MESSAGE', 'WELCOME', 'WELCOME_GUARD', 'GUARD_BUY', 'USER_TOAST_MSG', 'NOTICE_MSG'].includes(cmd)) {
                        //     console.log(chalk.blue(cmd));
                        //     console.log(JSON.parse(body));
                        // }
                        eventEmitter.emit(
                            cmd,
                            cmd !== 'DANMU_MSG' ? data : info
                        );
                        break;
                    case 3:
                        // console.log(`人气：${body}`);
                        break;
                    case 8:
                        console.log(`连接房间 ${roomid}`);
                        eventEmitter.emit('LINK', roomid);
                        break;
                    default:
                        break;
                }
            });
        });
    };

    ws.onclose = function (e) {
        if (timer != null) {
            clearInterval(timer); //停止发送心跳包
        }
        setTimeout(() => webSocket(roomid, eventEmitter), 4000); //4秒后重连
    };

    ws.onerror = function (e) {
        //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
        console.log(e);
    };
}

module.exports = webSocket;
