import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function putRachao(app: FastifyInstance) {
    app.put('/rachao/:rachaoId', async (req, res) => {
        console.log(req.body)

        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const bodyValidation = z.object({
            nome: z.string().trim().min(1).optional(),
            modalidade: z.string().toLowerCase().trim().min(1).optional(),
            diahora: z.coerce.date().optional().transform(val => {
                if(val){
                    const grossHours = val.getHours() - 3;
                    const grossMonth = val.getMonth() + 1;

                    const month = grossMonth.toString().length === 1 ? `0${grossMonth}` : grossMonth;
                    const date = val.getDate().toString().length === 1 ? `0${val.getDate()}` : val.getDate();
                    const hours = grossHours.toString().length === 1 ? `0${grossHours}` : grossHours;
                    const minutes = val.getMinutes().toString().length === 1 ? `0${val.getMinutes()}` : val.getMinutes();
                    console.log((val.getHours() - 3).toString());
                    return new Date(`${val?.getFullYear()}-${month}-${date}T${hours}:${minutes}`)
                }
            }),
            local: z.string().trim().min(1).optional(),
            regras: z.string().trim().optional(),
            status: z.boolean().optional()
        })

        const { rachaoId } = paramsValidation.parse(req.params);

        const data = bodyValidation.parse(req.body);

        try {
            await prisma.rachao.update({
                where: {
                    id: rachaoId
                },
                data: data
            })

            return res.status(200).send({data: {
                message: 'Record updated successfully'
            }});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}