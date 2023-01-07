import { memo, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { useInterval, useUpdateEffect } from 'ahooks';
import { FieldTimeOutlined } from '@ant-design/icons';
import useDanmu from '../../hooks/useDanmu';
import Buttons from '../../components/Buttons';

const styles = require('./style.module.scss').default;

const DanmuItem = ({ data }: { data: IDanmuC }) => {
    const { url, name, danmu, fans, timestamp, timeStr, isShift } = data;
    return (
        <div
            key={timestamp + danmu + name}
            className={classnames({
                [styles.itemWrap]: true,
                [styles.itemPop]: true,
                [styles.itemShift]: isShift,
            })}
        >
            <div className={styles.tag}></div>
            <div
                className={styles.avatar}
                style={{ backgroundImage: `url(${url})` }}
            >
                <div className={styles.time}>
                    <FieldTimeOutlined />
                    {timeStr}
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.name}>
                    <span>
                        {name}
                        {fans && (
                            <div className={styles.fans}>@{fans.fansName}</div>
                        )}
                    </span>
                </div>
                <div className={styles.danmu}>{danmu}</div>
            </div>
            {/* <img className={styles.avatar} src={avatar} alt='' /> */}
        </div>
    );
};

const Minimalist = () => {
    const ENTER_ANI_TIME = 1000;
    // const { danmuState, enterState, Buttons } = useSocket({
    //     danmuConfig: {
    //         max: 4,
    //         format: 'HH:mm'
    //     },
    //     enterConfig: {
    //         interval: 2000
    //     }
    // });
    const { danmuQueue, danmuShift } = useDanmu();
    // const { enterQueue, enterShift, enterHead, isLast } = enterState as IEnterState;
    // const allQueue
    const allQueue = useMemo<IDanmuC[]>(() => {
        // 不解构直接unshift会影响原数组
        const newQueue = [...danmuQueue];
        if (danmuShift) {
            newQueue.unshift(danmuShift);
        }
        return newQueue;
    }, [danmuQueue, danmuShift]);

    // const [enterHeadAni, setEnterHeadAni] = useState(false);
    // useUpdateEffect(() => {
    //     setEnterHeadAni(true);
    // }, [enterHead]);
    // useInterval(
    //     () => {
    //         if (enterHeadAni) {
    //             setEnterHeadAni(false);
    //         }
    //     },
    //     enterHead ? ENTER_ANI_TIME : undefined
    // );
    return (
        <div className={styles.content}>
            <Buttons />
            <div className={styles.danmuList}>
                {/* {lastShift && <Item isShift {...lastShift} />} */}
                {allQueue.map((item) => (
                    <DanmuItem key={item.id} data={item} />
                ))}
            </div>
        </div>
    );
};

export default Minimalist;
