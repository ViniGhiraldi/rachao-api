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
            await prisma.despesas.delete({
                where: {
                    id: despesaId
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