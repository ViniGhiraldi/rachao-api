import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function putDespesa(app: FastifyInstance) {
    app.put('/despesas/:despesaId', async (req, res) => {
        const paramsValidation = z.object({
            despesaId: z.string().cuid()
        })

        const bodyValidation = z.object({
            titulo: z.string().trim().min(1).optional(),
            quantidade: z.number().int().nonnegative(),
            custoUnitario: z.number().nonnegative().transform(val => Number(val.toFixed(2)))
        })

        const { despesaId } = paramsValidation.parse(req.params);
        const data = bodyValidation.parse(req.body);

        try {
            const result = await prisma.despesas.update({
                where: {
                    id: despesaId
                },
                data: {
                    ...data,
                    custoTotal: Number((data.custoUnitario * data.quantidade).toFixed(2)),
                },
                select: {
                    titulo: true,
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