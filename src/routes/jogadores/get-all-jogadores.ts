import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getAllJogadores(app: FastifyInstance) {
    app.get('/jogadores/all/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const queryValidation = z.object({
            orderBy: z.enum(["presenca", "time"]).optional()
        })

        const { rachaoId } = paramsValidation.parse(req.params);
        const { orderBy } = queryValidation.parse(req.query);

        try {
            let result;
            if(!orderBy || orderBy === 'presenca'){
                result = await prisma.jogadores.findMany({
                    where: {
                        rachaoId: rachaoId
                    },
                    select: {
                        id: true,
                        nome: true,
                        createdAt: true,
                        nota: true,
                        presenca: true,
                        time: {
                            select: {
                                nome: true
                            }
                        },
                        imagem: {
                            select: {
                                id: true,
                                name: true,
                                path: true,
                                size: true,
                                url: true
                            }
                        },
                    },
                    orderBy: [
                        {
                            presenca: 'desc'
                        },
                        {
                            nome: 'asc'
                        }
                    ]
                })
            }else{
                result = await prisma.jogadores.findMany({
                    where: {
                        rachaoId: rachaoId
                    },
                    select: {
                        id: true,
                        nome: true,
                        createdAt: true,
                        nota: true,
                        presenca: true,
                        time: {
                            select: {
                                nome: true
                            }
                        },
                        imagem: {
                            select: {
                                id: true,
                                name: true,
                                path: true,
                                size: true,
                                url: true
                            }
                        },
                    },
                    orderBy: [
                        {
                            time: {
                                nome: 'asc'
                            }
                        },
                        {
                            presenca: 'desc'
                        },
                        {
                            nome: 'asc'
                        }
                    ]
                })
            }

            const formatedResult = result.map(jogador => {
                return {...jogador, nota: Number(jogador.nota)}
            })
            
            return res.status(200).send({data: formatedResult});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}