import { INTERVAL, LOCAL_PROXY, RES_AVATAR_TYPE } from '../../constants';
import jsonfile from 'jsonfile';
import { requestAvatar } from '../../service';
import { getNow } from '../../utils';
import path from 'path';
// const fileName = path.join(__dirname, 'avatarMap.json');
const fileName = '/avatarMap.json';
const file = jsonfile.readFileSync(fileName);

export const getAvatar: (uid: number) => {
    type: ValueOf<typeof RES_AVATAR_TYPE>;
    url: string;
    promise?: Promise<string | null>;
} = (uid) => {
    const info = file[uid];
    if (info) {
        const now = getNow();
        if (now - info.now < INTERVAL) {
            return {
                type: RES_AVATAR_TYPE.EXIST,
                url: info.url,
            };
        } else {
            return {
                type: RES_AVATAR_TYPE.EXIST_EXPIRE,
                url: info.url,
                promise: requestAvatar(uid),
            };
        }
    }
    return {
        type: RES_AVATAR_TYPE.NOT_EXIST,
        url: `${LOCAL_PROXY}/bfs/face/member/noface.jpg`,
        promise: requestAvatar(uid),
    };
};

export const setAvatar = (uid: number, url: string) => {
    const now = getNow();
    file[uid] = {
        url,
        now,
    };
};

//
const interval = setInterval(() => {
    jsonfile.writeFile(fileName, file);
}, 1000);
