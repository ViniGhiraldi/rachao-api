import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getAllTimes(app: FastifyInstance) {
    app.get('/times/all', async (req, res) => {
        try {
            const result = await prisma.times.findMany({
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
                    resultadosTimeVencedor: true,
                    _count: {
                        select: {
                            jogadores: true
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