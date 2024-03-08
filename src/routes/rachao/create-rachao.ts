import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "../../lib/prisma";

export async function createRachao(app: FastifyInstance) {
    app.post('/rachao', async (req, res) => {
        const bodyValidation = z.object({
            nome: z.string().trim(),
            senha: z.string(),
            modalidade: z.string().toLowerCase().trim(),
            diahora: z.coerce.date(),
            local: z.string().trim(),
            regras: z.string().trim().optional(),
            status: z.boolean().default(true)
        })

        const data = bodyValidation.parse(req.body);

        try {
            const result = await prisma.rachao.create({
                data: data,
                select: {
                    id: true,
                    nome: true,
                    modalidade: true,
                    local: true,
                    diahora: true,
                    status: true
                }
            })

            return res.status(201).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}