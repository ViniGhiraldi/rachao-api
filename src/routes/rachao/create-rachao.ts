import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";

export async function createRachao(app: FastifyInstance) {
    app.post('/rachao', async (req, res) => {
        console.log(req)
        const queryValidation = z.object({
            sessionId: z.string().uuid().optional()
        })

        const bodyValidation = z.object({
            nome: z.string().trim(),
            senha: z.string(),
            modalidade: z.string().toLowerCase().trim(),
            diahora: z.coerce.date(),
            local: z.string().trim(),
            regras: z.string().trim().optional(),
            status: z.boolean().default(true)
        })

        let { sessionId } = queryValidation.parse(req.query);
        const data = bodyValidation.parse(req.body);

        if(!sessionId){
            sessionId = randomUUID();
        }

        try {
            const result = await prisma.rachao.create({
                data: {
                    ...data,
                    sessionId: sessionId
                },
                select: {
                    id: true,
                    nome: true,
                    modalidade: true,
                    local: true,
                    diahora: true,
                    status: true,
                    sessionId: true
                }
            })

            return res.status(201).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}