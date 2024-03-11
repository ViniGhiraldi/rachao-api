import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteResultado(app: FastifyInstance) {
    app.delete('/resultados/:resultadoId', async (req, res) => {
        const paramsValidation = z.object({
            resultadoId: z.string().cuid()
        })

        const { resultadoId } = paramsValidation.parse(req.params);

        try {
            await prisma.resultados.delete({
                where: {
                    id: resultadoId
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