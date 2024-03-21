import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function getAllRachao(app: FastifyInstance) {
    app.get('/rachao/all/:sessionId', async (req, res) => {
        const paramsValidation = z.object({
            sessionId: z.string().uuid()
        })

        const { sessionId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.rachao.findMany({
                where: {
                    sessionId: sessionId
                },
                select: {
                    id: true,
                    nome: true,
                    modalidade: true,
                    local: true,
                    diahora: true,
                    status: true,
                    createdAt: true,
                    _count: {
                        select: {
                            jogadores: true
                        }
                    }
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