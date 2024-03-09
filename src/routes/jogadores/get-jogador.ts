import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getJogador(app: FastifyInstance) {
    app.get('/jogadores/:jogadorId', async (req, res) => {
        const paramsValidation = z.object({
            jogadorId: z.string().cuid()
        })

        const { jogadorId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.jogadores.findUnique({
                where: {
                    id: jogadorId
                },
                select: {
                    nome: true,
                    createdAt: true,
                    nota: true,
                    presenca: true,
                    time: {
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
                            },
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