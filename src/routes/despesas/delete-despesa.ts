import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteDespesa(app: FastifyInstance) {
    app.delete('/despesas/:rachaoId/:despesaId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid(),
            despesaId: z.string().cuid()
        })

        const { despesaId, rachaoId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.despesas.delete({
                where: {
                    id: despesaId
                },
                select: {
                    custoTotal: true
                }
            })

            await prisma.rachao.update({
                where: {
                    id: rachaoId
                },
                data: {
                    custoTotal: {
                        increment: -result.custoTotal
                    }
                }
            })
            
            return res.status(200).send({data: {
                message: "Record deleted successfully"
            }});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}