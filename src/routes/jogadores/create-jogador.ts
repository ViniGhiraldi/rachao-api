import { FastifyInstance } from "fastify";
import upload from "../../lib/multer";
import z from "zod";
import { FileType } from "../../models/filetype";
import { prisma } from "../../lib/prisma";

export async function createJogador(app: FastifyInstance) {
    app.post('/jogadores/:rachaoId', { preHandler: upload.single('imagem') }, async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const bodyValidation = z.object({
            nome: z.string().trim(),
            presenca: z.enum(["true", "false"]).default("true").transform(val => val === "true")
        })

        const { rachaoId } = paramsValidation.parse(req.params);
        const data = bodyValidation.parse(req.body);
        const file = (req as any).file as FileType;

        try {
            let result;
            if(file){
                result = await prisma.jogadores.create({
                    data: {
                        rachaoId: rachaoId,
                        ...data,
                        imagem: {
                            create: {
                                name: file.filename,
                                path: file.path,
                                size: file.size,
                                url: `${process.env.IMAGES_URL}/${file.filename}`
                            }
                        }
                    },
                    select: {
                        id: true,
                        nome: true,
                        presenca: true,
                        imagem: {
                            select: {
                                id: true,
                                name: true,
                                path: true,
                                size: true,
                                url: true
                            }
                        }
                    }
                })
            }else{
                result = await prisma.jogadores.create({
                    data: {
                        rachaoId: rachaoId,
                        ...data
                    },
                    select: {
                        id: true,
                        nome: true,
                        presenca: true
                    }
                })
            }

            return res.status(201).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}