import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import upload from "../../lib/multer";
import { FileType } from "../../models/filetype";

export async function putTime(app: FastifyInstance) {
    app.put('/times/:timeId', { preHandler: upload.single('imagem') }, async (req, res) => {
        const paramsValidation = z.object({
            timeId: z.string().cuid()
        })

        const queryValidation = z.object({
            deleteImagem: z.enum(["true", "false"]).transform(val => val === "true").optional()
        })

        const bodyValidation = z.object({
            nome: z.string().trim()
        })

        const { timeId } = paramsValidation.parse(req.params);
        const { deleteImagem } = queryValidation.parse(req.query);
        const { nome } = bodyValidation.parse(req.body);
        const file = (req as any).file as FileType;

        try {
            let result;
            if(file){
                result = await prisma.times.update({
                    where: {
                        id: timeId
                    },
                    data: {
                        nome: nome,
                        imagem: {
                            upsert: {
                                update:{
                                    name: file.filename,
                                    path: file.path,
                                    size: file.size,
                                    url: `${process.env.IMAGES_URL}/${file.filename}`
                                },
                                create: {
                                    name: file.filename,
                                    path: file.path,
                                    size: file.size,
                                    url: `${process.env.IMAGES_URL}/${file.filename}`
                                }
                            }
                        }
                    },
                    select: {
                        nome: true,
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
                if(deleteImagem){
                    result = await prisma.times.update({
                        where: {
                            id: timeId
                        },
                        data: {
                            nome: nome,
                            imagem: {
                                delete:{
                                    timeId: timeId
                                }
                            }
                        },
                        select: {
                            nome: true
                        }
                    })
                }else{
                    result = await prisma.times.update({
                        where: {
                            id: timeId
                        },
                        data: {
                            nome: nome
                        },
                        select: {
                            nome: true,
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
                }
            }

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}