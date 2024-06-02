import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getAllResultadosTime(app: FastifyInstance) {
    app.get('/resultados/time/:timeId', async (req, res) => {
        const paramsValidation = z.object({
            timeId: z.string().cuid()
        })

        const { timeId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.resultados.findMany({
                where: {
                    OR: [
                        {
                            timeCasaId: timeId
                        },
                        {
                            timeVisitanteId: timeId
                        }
                    ]
                },
                select: {
                    id: true,
                    createdAt: true,
                    timeCasa: {
                        select: {
                            nome: true,
                            imagem: {
                                select: {
                                    id: true,
                                    name: true,
                                    path: true,
                                    size: true,
                                    url: true
                                }
                            }
                        }
                    },
                    timeVisitante: {
                        select: {
                            nome: true,
                            imagem: {
                                select: {
                                    id: true,
                                    name: true,
                                    path: true,
                                    size: true,
                                    url: true
                                }
                            }
                        }
                    },
                    timeVencedor: {
                        select: {
                            nome: true,
                            imagem: {
                                select: {
                                    id: true,
                                    name: true,
                                    path: true,
                                    size: true,
                                    url: true
                                }
                            }
                        }
                    },
                    timeCasaPontos: true,
                    timeVisitantePontos: true
                },
                orderBy: {
                    createdAt: "desc",
                }
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}