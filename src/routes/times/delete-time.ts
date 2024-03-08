import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteTime(app: FastifyInstance) {
    app.delete('/times/:timeId', async (req, res) => {
        const paramsValidation = z.object({
            timeId: z.string().cuid()
        })

        const { timeId } = paramsValidation.parse(req.params);

        try {
            await prisma.times.delete({
                where: {
                    id: timeId
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