import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createDespesa(app: FastifyInstance) {
    app.post('/despesas/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const bodyValidation = z.object({
            titulo: z.string().trim().min(1),
            quantidade: z.number().int().nonnegative(),
            custoUnitario: z.number().nonnegative().transform(val => Number(val.toFixed(2)))
        })

        const { rachaoId } = paramsValidation.parse(req.params);
        const data = bodyValidation.parse(req.body);

        try {
            const result = await prisma.despesas.create({
                data: {
                    ...data,
                    rachaoId: rachaoId,
                    custoTotal: Number((data.custoUnitario * data.quantidade).toFixed(2)),
                },
                select: {
                    id: true,
                    titulo: true,
                    custoUnitario: true,
                    quantidade: true,
                    custoTotal: true
                }
            })

            return res.status(201).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}