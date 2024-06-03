import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createResultado(app: FastifyInstance) {
    app.post('/resultados/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })
        
        const bodyValidation = z.object({
            timeCasaId: z.string().cuid(),
            timeVisitanteId: z.string().cuid(),
            timeVisitantePontos: z.number().int().nonnegative().default(0),
            timeCasaPontos: z.number().int().nonnegative().default(0)
        })
        
        const { rachaoId } = paramsValidation.parse(req.params);
        const data = bodyValidation.parse(req.body);

        if(data.timeCasaId === data.timeVisitanteId) return res.status(400).send({data: {message: "A team cannot play against itself"}})

        const timeVencedorId = (data.timeCasaPontos > data.timeVisitantePontos) ? data.timeCasaId : (data.timeVisitantePontos > data.timeCasaPontos) ? data.timeVisitanteId : null;

        try {
            const result = await prisma.resultados.create({
                data: {
                    ...data,
                    timeVencedorId: timeVencedorId,
                    rachaoId: rachaoId
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

            return res.status(201).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}