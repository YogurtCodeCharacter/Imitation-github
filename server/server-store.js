function getRedisSessionId(sid) {
    return `ssid:${sid}`;
}


class RedisSessionStore {
    constructor(client) {
        this.client = client;
    }
    // TOOD: 获取redis 中存储的数据
    async get (sid) {
        console.log('get session', sid);
        const id = getRedisSessionId(sid);
        const data = await this.client.get(id);
        if (!data) {
            return null;
        }
        try {
            const result = JSON.parse(data);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    // TODO: 存储session 数据到redis
    async set(sid, sess, ttl) {
        console.log('set session', sid);
        const id = getRedisSessionId(sid);
        if (typeof ttl === 'number') {
            ttl = Math.ceil(ttl/1000);
        }; 
        try {
            const sessStr = JSON.stringify(sess);
            if (ttl) {
                await this.client.setex(id, ttl, sessStr);
            } else {
                await this.client.setex(id, sessStr);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // TODO: 从redis 当中删除某个session
    async destroy (sid) {
        console.log('destroy session', sid);
        const id = getRedisSessionId(sid);
        await this.client.del(id);
    }
}

module.exports = RedisSessionStore;