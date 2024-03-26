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
            nome: z.string().trim().min(1),
            senha: z.string().min(5),
            modalidade: z.string().toLowerCase().trim().min(1),
            diahora: z.coerce.date(),
            local: z.string().trim().min(1),
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
                    sessionId: true
                }
            })

            return res.status(201).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}