import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getTime(app: FastifyInstance) {
    app.get('/times/:timeId', async (req, res) => {
        const paramsValidation = z.object({
            timeId: z.string().cuid()
        })

        const { timeId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.times.findUnique({
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
                        orderBy: {
                            nome: 'asc'
                        }
                    },
                    _count: {
                        select: {
                            jogadores: true
                        }
                    }
                }
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}