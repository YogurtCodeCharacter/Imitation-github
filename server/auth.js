const axios = require('axios');
const config = require('../config.js');
const { client_id, client_secret, request_token_url } = config.github;

module.exports = (server) => {

    // TODO: 登入处理
    server.use(async (ctx, next) => {
        if (ctx.path === '/auth') {
            const code = ctx.query.code;
            if (!code) {
                ctx.body = 'code not exist';
                return
            };
            const result = await axios({
                method: 'POST',
                url: request_token_url,
                data: {
                    client_id,
                    client_secret,
                    code
                },
                headers: {
                    Accept: 'application/json'
                }
            });
            if (result.status === 200 && (result.data && !result.data.error)) {
                ctx.session.githubAuth = result.data;
                const { access_token, token_type } = result.data;
                const userInfoResp = await axios({
                    method: 'GET',
                    url: 'https://api.github.com/user',
                    headers: {
                        'Authorization': `${token_type} ${access_token}`
                    }
                });
                ctx.session.userInfo = userInfoResp.data;
                ctx.body = 'succes';
                ctx.redirect((ctx.session && ctx.session.urlBeforeOauth) || '/');
                ctx.session.urlBeforeOauth = '';
            } else {
                ctx.body = `request token failed: ${result.statusText}`
            }
        } else {
            await next();
        }
    });

    // TODO: 登出处理
    server.use(async (ctx, next) => {
        const method = ctx.method;
        const path = ctx.path;
        if (path === '/logout' && method === 'POST') {
            ctx.session = null;
            ctx.body = 'logout success';
        } else {
            await next();
        }
    });

    // TODO: cache
    server.use(async (ctx, next) => {
        const method = ctx.method;
        const path = ctx.path;
        if (path === '/prepare-auth' && method === 'GET') {
            const { url } = ctx.query;
            ctx.session.urlBeforeOauth = url;
            ctx.body = 'ready';
        } else {
            await next();
        }
    })
}