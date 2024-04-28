import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function getAllTimes(app: FastifyInstance) {
    app.get('/times/all/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const { rachaoId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.times.findMany({
                where: {
                    rachaoId: rachaoId
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
                    _count: {
                        select: {
                            jogadores: true,
                            resultadosTimeVencedor: true
                        }
                    }
                },
                orderBy: {
                    nome: 'asc'
                }
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}