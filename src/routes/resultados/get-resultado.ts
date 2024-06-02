import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getResultado(app: FastifyInstance) {
    app.get('/resultados/:resultadoId', async (req, res) => {
        const paramsValidation = z.object({
            resultadoId: z.string().cuid()
        })

        const { resultadoId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.resultados.findUnique({
                where: {
                    id: resultadoId
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
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}