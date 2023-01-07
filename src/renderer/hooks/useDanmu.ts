import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

interface IDanmuConfig {
    max?: number;
    format?: string;
}

export default (config?: IDanmuConfig) => {
    const { max = 5, format = 'HH:mm' } = config || {};
    const [danmuQueue, setDanmuQueue] = useState<IDanmuC[]>([]);
    const danmuQueueRef = useRef(danmuQueue);
    useEffect(() => {
        danmuQueueRef.current = danmuQueue;
    }, [danmuQueue]);
    const [danmuShift, setDanmuShift] = useState<IDanmuC | null>(null);
    useEffect(() => {
        window.electron.ipcRenderer.on('danmu', (arg) => {
            // setDanmuQueue([]);
            const newDanmu: IDanmuC = arg as IDanmu;
            if (format) {
                newDanmu.timeStr = dayjs(newDanmu.timestamp).format(format);
            }
            const newQueue: IDanmuC[] = danmuQueueRef.current.concat(newDanmu);
            // console.log(max);
            if (newQueue.length > max) {
                setDanmuShift({
                    ...(newQueue.shift() as IDanmuC),
                    isShift: true,
                });
            }
            setDanmuQueue(newQueue);
        });
    }, []);
    return {
        danmuQueue,
        danmuShift,
    };
};
