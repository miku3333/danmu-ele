import http from 'http';
// 封装get请求
const get = (url: string) =>
    new Promise((resolve, reject) => {
        const options = {
            headers: {
                'user-agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:32.0) Gecko/20100101 Firefox/32.0',
                Referer: `https://space2.bilibili.com/`,
            },
        };
        const req = http.get(url, options, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => (data += chunk));
            res.on('error', (err) => reject(err));
            res.on('end', () => resolve(data));
        });
        req.on('error', (err) => {
            reject(err);
        });
    }).catch((err) => {
        console.error(
            'Request error: ' + url + ', Method:' + 'GET' + ',Error message:',
            err
        );
        throw new Error(err ? err : 'Request error');
    });

export const requestAvatar = async (mid: number) => {
    let num = 0;
    do {
        num += 1;
        try {
            const res = (await get(
                `http://api.bilibili.com/x/space/acc/info?mid=${mid}`
            )) as string;
            const result = JSON.parse(res);
            const avatar: string = result.data?.face;
            if (avatar) {
                return avatar;
            }
        } catch (err) {
            console.log(err);
        }
    } while (num < 5);
    console.log('request fail');
    return null;
};
