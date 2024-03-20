import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getAllRachao(app: FastifyInstance) {
    app.get('/rachao/all', async (req, res) => {
        let { sessionId } = req.cookies;

        if(!sessionId) return res.status(401).send({data: {message: "Não foi possível encontrar nenhum registro."}});

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