import 'dotenv/config';
import fastify from "fastify";
import { fastifyCors } from '@fastify/cors';
import multer from "fastify-multer";
import { createTime, deleteTime, getAllTimes, getTime, putTime } from "./routes/times";
import { createRachao, deleteRachao, getAllRachao, getRachao, putRachao } from "./routes/rachao";
import { createJogador, deleteJogador, getAllJogadores, getAllJogadoresTime, getJogador, putJogador } from "./routes/jogadores";
import { createDespesa, deleteDespesa, getAllDespesas, getDespesa, putDespesa } from "./routes/despesas";
import { createResultado, deleteResultado, getAllResultados, getAllResultadosTime, getResultado, putResultado } from './routes/resultados';
import { sorteio } from './routes/others';

const server = fastify();

server.register(fastifyCors, {
    origin: '*'
});

server.register(multer.contentParser);

// Rachão
server.register(createRachao);
server.register(putRachao);
server.register(deleteRachao);
server.register(getRachao);
server.register(getAllRachao);

// Times
server.register(createTime);
server.register(getAllTimes);
server.register(getTime);
server.register(putTime);
server.register(deleteTime);

// Jogadores
server.register(createJogador);
server.register(getAllJogadores);
server.register(getAllJogadoresTime);
server.register(getJogador);
server.register(putJogador);
server.register(deleteJogador);

// Despesas
server.register(createDespesa);
server.register(getAllDespesas);
server.register(getDespesa);
server.register(putDespesa);
server.register(deleteDespesa);

// Resultados
server.register(createResultado);
server.register(getAllResultados);
server.register(getResultado);
server.register(getAllResultadosTime);
server.register(putResultado);
server.register(deleteResultado);

// Outros
server.register(sorteio)

server.listen({ port: Number(process.env.PORT) || 3333 }, () => console.log(new Date()))