import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getAllJogadores(app: FastifyInstance) {
    app.get('/jogadores/all/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const queryValidation = z.object({
            list: z.enum(["presenca", "time"]).optional()
        })

        const { rachaoId } = paramsValidation.parse(req.params);
        const { list } = queryValidation.parse(req.query);

        try {
            const result = await prisma.jogadores.findMany({
                where: {
                    rachaoId: rachaoId
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
                    presenca: "desc"
                }
            })
            
            if(list === "presenca"){
                const confirmados = result.filter(jogador => jogador.presenca);
                const pendentes = result.filter(jogador => !jogador.presenca);
                return res.status(200).send({data: {confirmados, pendentes}});
            }else if(list === "time"){
                const comTime = result.filter(jogador => jogador.time);
                const semTime = result.filter(jogador => !jogador.time);
                return res.status(200).send({data: {comTime, semTime}});
            }

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}