const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
const session = require('koa-session');
const RedSessionStore = require('./server/server-store.js');
const auth = require('./server/auth.js');
const api = require('./server/api.js');
const Redis = require('ioredis');
const koaBody = require('koa-body');
const dev = process.env.NODE_ENV != 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

// TODO: 创建redis client
const redis = new Redis();
app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    server.keys = ['xiaobai github app'];

    server.use(koaBody());
    const SESSION_CONFIG = {
        key: 'jid',
        store: new RedSessionStore(redis)
    };
    server.use(session(SESSION_CONFIG, server));
    // TODO: 配置oauth github 登录
    auth(server);
    api(server);

    router.get('/a/:id', async (ctx) => {
        const id = ctx.params.id;
        await handle(ctx.req, ctx.res, {
            pathname: '/a',
            query: {
                id
            }
        });
        ctx.respond = false;
    });

    router.get('/b/:id', async (ctx) => {
        const id = ctx.params.id;
        await handle(ctx.req, ctx.res, {
            pathname: '/b',
            query: {
                id
            }
        });
        ctx.respond = false;
    });

    router.get('/api/user/info', async (ctx) => {
        const user = ctx.session.userInfo;
        if (!user) {
            ctx.status = 401;
            ctx.body = 'Need Login';
        } else {
            ctx.body = user;
            ctx.set('Content-Type', 'application/json');
        }
    });


   server.use(router.routes());

    // TODO: 设置默认返回 next.js 渲染
   server.use(async (ctx) => {
       ctx.req.session = ctx.session;
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    server.listen(9090, () => { console.log('启动成功');});
})