import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";

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

        let { sessionId } = req.cookies;

        if(!sessionId){
            sessionId = randomUUID();

            res.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 60, // 60 days
                signed: true,
                httpOnly: true
            })
        }

        try {
            const result = await prisma.rachao.create({
                data: {
                    ...data,
                    sessionId
                },
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