import { RES_AVATAR_TYPE } from 'main/constants';

interface IObject {
    [key: string]: any;
}

declare global {
    type ValueOf<T> = T[keyof T];
    interface IDanmu {
        id: string;
        timestamp: number;
        type: ValueOf<typeof RES_AVATAR_TYPE>;
        uid: number;
        name: string;
        danmu: string;
        url: string;
        fans: {
            fansLevel: number;
            fansName: string;
            fansUid: any;
        } | null;
    }

    interface IDanmuC extends IDanmu {
        timeStr?: string;
        isShift?: boolean;
    }
}
