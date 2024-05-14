import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getTime(app: FastifyInstance) {
    app.get('/times/:rachaoId/:timeId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid(),
            timeId: z.string().cuid()
        })

        const { rachaoId, timeId } = paramsValidation.parse(req.params);

        try {
            const timeResult = await prisma.times.findUnique({
                where: {
                    id: timeId
                },
                select: {
                    id: true,
                    createdAt: true,
                    nome: true,
                    imagem: {
                        select: {
                            id: true,
                            name: true,
                            path: true,
                            size: true,
                            url: true
                        }
                    },
                    jogadores: {
                        select: {
                            id: true,
                            nome: true,
                            imagem: {
                                select: {
                                    id: true,
                                    name: true,
                                    path: true,
                                    size: true,
                                    url: true
                                }
                            },
                            presenca: true
                        },
                        orderBy: [
                            {
                                presenca: 'desc'
                            },
                            {
                                nome: 'asc'
                            }
                        ]
                    },
                    _count: {
                        select: {
                            jogadores: true
                        }
                    }
                }
            })

            const allJogadoresInRachaoResult = await prisma.jogadores.findMany({
                where: {
                    rachaoId: rachaoId,
                    NOT: {
                        time: {
                            id: timeId
                        }
                    }
                },
                select: {
                    id: true,
                    nome: true,
                    imagem: {
                        select: {
                            id: true,
                            name: true,
                            path: true,
                            size: true,
                            url: true
                        }
                    },
                    presenca: true,
                    time: {
                        select: {
                            nome: true
                        }
                    }
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

            return res.status(200).send({data: {time: timeResult, jogadores: allJogadoresInRachaoResult}});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}