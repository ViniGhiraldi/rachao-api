import { FastifyInstance } from "fastify";
import z from "zod";

export async function createTime(app: FastifyInstance) {
    app.post('/time/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const bodyValidation = z.object({
            nome: z.string().trim()
        })

        const { rachaoId } = paramsValidation.parse(req.params);
        const { nome } = bodyValidation.parse(req.body);
    })
}