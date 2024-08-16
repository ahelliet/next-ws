import { createClient } from "redis";

const redisClient = createClient({ url: String(process.env.REDIS_URL) });
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
if(!redisClient.isOpen) {
    redisClient.connect();
}
redisClient.on("disconnect", () => {
    console.log("Redis Client Disconnected");
});

export const getRedisClient = () => {
    return redisClient;
}

export const get = async (key: any): Promise<any> => {
    await redisClient.get(key);
}

export const set = async (key: any, value: any): Promise<any> => {
    await redisClient.set(key, value);
}