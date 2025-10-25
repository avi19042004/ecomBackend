import { createClient } from 'redis';
import { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } from './envConfig';

const redisClient = createClient({
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port:  Number(REDIS_PORT)
    }
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();


export default redisClient