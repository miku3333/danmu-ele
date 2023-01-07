import { Button, message, Space } from 'antd';
import { nanoid } from 'nanoid';
import { memo, useState } from 'react';
import { RES_AVATAR_TYPE } from '../../constants';

const styles = require('./style.module.scss').default;

const MESSAGES: {
    [key: string]: () => IDanmuC;
} = {
    short: () => ({
        type: RES_AVATAR_TYPE.EXIST,
        fans: null,
        uid: 4208788,
        id: nanoid(),
        timestamp: new Date().valueOf(),
        name: '提款机',
        danmu: '1111',
        url: 'http://127.0.0.1:3001/bfs/face/4ce650966a238d977131ee35e177effb960c9cee.jpg',
    }),
    long: () => ({
        type: RES_AVATAR_TYPE.EXIST,
        fans: null,
        uid: 4208788,
        id: nanoid(),
        timestamp: new Date().valueOf(),
        name: '提款机',
        danmu: '一眼丁真一眼丁真一眼丁真一眼丁真一眼丁真一眼丁真一眼丁真一眼',
        url: 'http://127.0.0.1:3001/bfs/face/4ce650966a238d977131ee35e177effb960c9cee.jpg',
    }),
    fans: () => ({
        type: RES_AVATAR_TYPE.EXIST,
        fans: {
            fansLevel: 3,
            fansName: 'MB喵',
            fansUid: 413164365,
        },
        uid: 4208788,
        id: nanoid(),
        timestamp: new Date().valueOf(),
        name: '提款机',
        danmu: '1111',
        url: 'http://127.0.0.1:3001/bfs/face/4ce650966a238d977131ee35e177effb960c9cee.jpg',
    }),
    // enter: () =>
    //     JSON.stringify({
    //         code: 0,
    //         data: {
    //             type: MESSAGE_MAP.enter,
    //             timestamp: new Date().valueOf(),
    //             name: '这是卢',
    //             enterMsg: '卢来!',
    //             avatar: 'http://127.0.0.1:3001/bfs/face/86fd529450665e87563bbd8d906487ac03d3b87b.jpg',
    //         },
    //     }),
};

const Buttons = () => {
    const sendClick = (key: keyof typeof MESSAGES) => () => {
        window.electron.ipcRenderer.sendMessage('mock', [MESSAGES[key]()]);
    };
    const reload = () => {
        location.reload();
    };
    return (
        <div className={styles.buttons}>
            <div>
                <Space>
                    <Button onClick={sendClick('short')}>短弹幕</Button>
                    <Button onClick={sendClick('long')}>长弹幕</Button>
                    <Button onClick={sendClick('fans')}>
                        进入房间(粉丝牌)
                    </Button>
                </Space>
            </div>
            <div>
                <Space>
                    <Button onClick={sendClick('enter')}>进入房间</Button>
                    <Button type="primary" onClick={reload}>
                        重载
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default memo(Buttons);
