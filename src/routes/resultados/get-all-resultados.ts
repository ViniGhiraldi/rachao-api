import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getAllResultados(app: FastifyInstance) {
    app.get('/resultados/all/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const { rachaoId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.resultados.findMany({
                where: {
                    rachaoId: rachaoId
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
                    resultado: true,
                    duracao: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}