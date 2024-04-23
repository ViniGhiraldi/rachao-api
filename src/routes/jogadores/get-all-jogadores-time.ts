import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getAllJogadoresTime(app: FastifyInstance) {
    app.get('/jogadores/time/:timeId', async (req, res) => {
        const paramsValidation = z.object({
            timeId: z.string().cuid()
        })

        const { timeId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.jogadores.findMany({
                where: {
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
                },
                orderBy: {
                    presenca: "desc",
                }
            })

            const formatedResult = result.map(jogador => {
                return {...jogador, nota: Number(jogador.nota)}
            })

            return res.status(200).send({data: formatedResult});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}