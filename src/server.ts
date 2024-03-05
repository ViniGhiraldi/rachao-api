import fastify from "fastify";
import 'dotenv/config';
import { createRachao } from "./routes/rachao/create-rachao";
import { putRachao } from "./routes/rachao/put-rachao";
import { deleteRachao } from "./routes/rachao/delete-rachao";

const server = fastify();

server.register(createRachao);
server.register(putRachao);
server.register(deleteRachao);

server.listen({ port: Number(process.env.PORT) || 3333 }, () => console.log('HTTP server is running!'))