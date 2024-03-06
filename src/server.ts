import fastify from "fastify";
import 'dotenv/config';
import { createRachao } from "./routes/rachao/create-rachao";
import { putRachao } from "./routes/rachao/put-rachao";
import { deleteRachao } from "./routes/rachao/delete-rachao";
import { getFullRachao } from "./routes/rachao/get-full-rachao";
import { getAllRachao } from "./routes/rachao/get-all-rachao";

const server = fastify();

server.register(createRachao);
server.register(putRachao);
server.register(deleteRachao);
server.register(getFullRachao);
server.register(getAllRachao);

server.listen({ port: Number(process.env.PORT) || 3333 }, () => console.log(new Date()))