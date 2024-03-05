import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function deleteRachao(app: FastifyInstance) {
    app.delete('/rachao/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const { rachaoId } = paramsValidation.parse(req.params);

        try {
            await prisma.rachao.delete({
                where: {
                    id: rachaoId
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