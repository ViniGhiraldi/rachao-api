import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getAllJogadores(app: FastifyInstance) {
    app.get('/jogadores/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const queryValidation = z.object({
            timeId: z.string().cuid().optional()
        })

        const { rachaoId } = paramsValidation.parse(req.params);
        const { timeId } = queryValidation.parse(req.query);

        try {
            const result = await prisma.jogadores.findMany({
                where: {
                    rachaoId: rachaoId,
                    timeId: timeId
                },
                select: {
                    id: true,
                    nome: true,
                    createdAt: true,
                    nota: true,
                    presenca: true,
                    time: {
                        select: {
                            nome: true
                        }
                    },
                    imagem: {
                        select: {
                            id: true,
                            name: true,
                            path: true,
                            size: true,
                            url: true
                        }
                    },
                }
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}