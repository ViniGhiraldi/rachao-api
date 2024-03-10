import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getDespesa(app: FastifyInstance) {
    app.get('/despesas/:despesaId', async (req, res) => {
        const paramsValidation = z.object({
            despesaId: z.string().cuid()
        })

        const { despesaId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.despesas.findUnique({
                where: {
                    id: despesaId
                },
                select: {
                    titulo: true,
                    createdAt: true,
                    custoUnitario: true,
                    quantidade: true,
                    custoTotal: true
                }
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}