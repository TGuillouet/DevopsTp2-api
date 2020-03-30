import express from "express";
import redis from "redis";
import cors from "cors";

const app = express();
const corsOptions: cors.CorsOptions = {
    origin: [
      "http://localhost:3001"
    ],
    methods: [
        "GET",
        "OPTIONS"
    ]
}
app.use(cors(corsOptions));

const redisPort = (process.env.REDIS_PORT)? parseInt(process.env.REDIS_PORT): 6379;

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: redisPort
});

// define a route handler for the default home page
app.get("/", (req: express.Request, res: express.Response) => {
    client.get("count", (e, reply) => {
        const count = (reply)? parseInt(reply): 0;
        const newCount = count + 1;
        res.status(200).json({ count: newCount });
        client.set("count", newCount.toString());
    });
});

// start the Express server
app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`);
});