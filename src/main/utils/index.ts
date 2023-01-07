import { BrowserWindow } from 'electron';
import { RES_AVATAR_TYPE } from '../constants';
import { getAvatar, setAvatar } from '../module/avatar';
import { nanoid } from 'nanoid';
import { LOCAL_PROXY } from '../constants';
// const { nanoid } = require('nanoid');

/**
 *
 * @returns 当前时间戳
 */
export const getNow = () => Date.now();

let mainWindow: BrowserWindow | null = null;
export const setMainWindow = (browserWindow: BrowserWindow | null) => {
    mainWindow = browserWindow;
};
export const sendMessage = (channel: string, ...args: any[]) => {
    mainWindow?.webContents.send(channel, ...args);
};
export const sendDanmuMessage = async (item: Partial<IDanmu>) => {
    const { type, url, promise } = getAvatar(item.uid!);
    const danmuItem = {
        ...item,
        url,
        type,
        id: nanoid(),
        timestamp: Date.now(),
    };
    if (type === RES_AVATAR_TYPE.EXIST) {
        mainWindow?.webContents.send('danmu', danmuItem);
    } else {
        danmuItem.type = RES_AVATAR_TYPE.TO_BE_REPLACED;
        mainWindow?.webContents.send('danmu', danmuItem);
        const face = await promise;
        // let avatarUrl = `${LOCAL_PROXY}/bfs/face/member/noface.jpg`
        if (face) {
            const [_, path] = face.split('.com');
            const avatarUrl = `${LOCAL_PROXY}${path}`;
            danmuItem.type = RES_AVATAR_TYPE.REPLACE;
            danmuItem.url = avatarUrl;
            mainWindow?.webContents.send('danmu', danmuItem);

            setAvatar(danmuItem.uid!, avatarUrl);
        }
    }
};
