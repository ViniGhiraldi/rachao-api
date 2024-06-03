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
            timeVisitantePontos: z.number().int().nonnegative(),
            timeCasaPontos: z.number().int().nonnegative()
        })

        const { resultadoId } = paramsValidation.parse(req.params);
        const data = bodyValidation.parse(req.body);

        if(data.timeCasaId === data.timeVisitanteId) return res.status(400).send({data: {message: "A team cannot play against itself"}})

        const timeVencedorId = (data.timeCasaPontos > data.timeVisitantePontos) ? data.timeCasaId : (data.timeVisitantePontos > data.timeCasaPontos) ? data.timeVisitanteId : null;

        try {
            const result = await prisma.resultados.update({
                where: {
                    id: resultadoId
                },
                data: {
                    ...data,
                    timeVencedorId: timeVencedorId
                },
                select: {
                    id: true,
                    timeCasa: {
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
                            }
                        }
                    },
                    timeVisitante: {
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
                            }
                        }
                    },
                    timeVencedor: {
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