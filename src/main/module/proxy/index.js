const express = require('express');
const axios = require('axios');
// const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'PUT, GET, POST, DELETE, OPTIONS'
    );
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.get('/*', async (req, res) => {
    try {
        const { headers, data } = await axios.get(
            `https://i1.hdslb.com${req.path}`,
            {
                responseType: 'arraybuffer',
            }
        );
        res.set(headers);
        res.end(data.toString('binary'), 'binary');
    } catch (err) {
        console.log('proxy fail');
        console.log(err);
    }
});

app.listen(3002);
