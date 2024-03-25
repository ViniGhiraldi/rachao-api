import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function putRachao(app: FastifyInstance) {
    app.put('/rachao/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const bodyValidation = z.object({
            nome: z.string().trim().min(1).optional(),
            modalidade: z.string().toLowerCase().trim().min(1).optional(),
            diahora: z.coerce.date().optional(),
            local: z.string().trim().min(1).optional(),
            regras: z.string().trim().optional(),
            status: z.boolean().optional()
        })

        const { rachaoId } = paramsValidation.parse(req.params);

        const data = bodyValidation.parse(req.body);

        try {
            const result = await prisma.rachao.update({
                where: {
                    id: rachaoId
                },
                data: data,
                select: {
                    nome: true,
                    modalidade: true,
                    local: true,
                    diahora: true,
                    status: true,
                    regras: true
                }
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}