import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';
import z from 'zod';

export async function deleteJogador(app: FastifyInstance) {
    app.delete('/jogadores/:jogadorId', async (req, res) => {
        const paramsValidation = z.object({
            jogadorId: z.string().cuid()
        })

        const { jogadorId } = paramsValidation.parse(req.params);

        try {
            await prisma.jogadores.delete({
                where: {
                    id: jogadorId
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