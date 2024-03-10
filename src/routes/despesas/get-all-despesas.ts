import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getAllDespesas(app: FastifyInstance) {
    app.get('/despesas/all/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const { rachaoId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.despesas.findMany({
                where:{
                    rachaoId: rachaoId
                },
                select: {
                    id: true,
                    titulo: true,
                    custoUnitario: true,
                    quantidade: true,
                    custoTotal: true
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