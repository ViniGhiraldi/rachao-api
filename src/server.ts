import fastify from "fastify";
import 'dotenv/config';
import { createRachao } from "./routes/rachao/create-rachao";
import { putRachao } from "./routes/rachao/put-rachao";
import { deleteRachao } from "./routes/rachao/delete-rachao";
import { getFullRachao } from "./routes/rachao/get-full-rachao";
import { getAllRachao } from "./routes/rachao/get-all-rachao";
import multer from "fastify-multer";
import { createTime } from "./routes/times/create-time";
import { getAllTimes } from "./routes/times/get-all-times";
import { getTime } from "./routes/times/get-time";
import { putTime } from "./routes/times/put-time";

const server = fastify();

server.register(multer.contentParser);

// Rachão
server.register(createRachao);
server.register(putRachao);
server.register(deleteRachao);
server.register(getFullRachao);
server.register(getAllRachao);

// Times
server.register(createTime);
server.register(getAllTimes);
server.register(getTime);
server.register(putTime);

server.listen({ port: Number(process.env.PORT) || 3333 }, () => console.log(new Date()))