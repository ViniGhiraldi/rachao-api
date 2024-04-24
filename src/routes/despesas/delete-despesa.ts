import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteDespesa(app: FastifyInstance) {
    app.delete('/despesas/:despesaId', async (req, res) => {
        const paramsValidation = z.object({
            despesaId: z.string().cuid()
        })

        const { despesaId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.despesas.delete({
                where: {
                    id: despesaId
                },
                select: {
                    rachaoId: true,
                    custoTotal: true
                }
            })

            await prisma.rachao.update({
                where: {
                    id: result.rachaoId
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