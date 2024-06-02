import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function putResultado(app: FastifyInstance) {
    app.put('/resultados/:resultadoId', async (req, res) => {
        const paramsValidation = z.object({
            resultadoId: z.string().cuid()
        })

        const bodyValidation = z.object({
            timeCasaId: z.string().cuid(),
            timeVisitanteId: z.string().cuid(),
            timeVencedorId: z.string().cuid().optional(),
            timeVisitantePontos: z.number().int().nonnegative().optional(),
            timeCasaPontos: z.number().int().nonnegative().optional()
        })

        const { resultadoId } = paramsValidation.parse(req.params);
        const data = bodyValidation.parse(req.body);

        if(data.timeCasaId === data.timeVisitanteId) return res.status(400).send({data: {message: "A team cannot play against itself"}})

        if(data.timeVencedorId !== data.timeCasaId && data.timeVencedorId !== data.timeVisitanteId) return res.status(400).send({data: {message: "The winning team must be in the match"}})

        try {
            const result = await prisma.resultados.update({
                where: {
                    id: resultadoId
                },
                data: data,
                select: {
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
                }
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}