import { FastifyInstance } from "fastify";
import upload from "../../lib/multer";
import z from "zod";
import { FileType } from "../../models/filetype";
import { prisma } from "../../lib/prisma";

export async function putJogador(app: FastifyInstance) {
    app.put('/jogadores/:jogadorId', { preHandler: upload.single('imagem') }, async (req, res) => {
        const paramsValidation = z.object({
            jogadorId: z.string().cuid()
        })

        const queryValidation = z.object({
            deleteImagem: z.enum(["true", "false"]).transform(val => val === "true").optional(),
            deleteTime: z.enum(["true", "false"]).transform(val => val === "true").optional(),
        })

        const bodyValidation = z.object({
            timeId: z.string().cuid().optional(),
            nome: z.string().trim(),
            presenca: z.boolean().optional(),
            nota: z.number().nonnegative().optional()
        })

        const { jogadorId } = paramsValidation.parse(req.params);
        const data = bodyValidation.parse(req.body);
        const { deleteImagem, deleteTime } = queryValidation.parse(req.query);
        const file = (req as any).file as FileType;

        try {
            let result;
            if(deleteImagem){
                result = await prisma.jogadores.update({
                    where: {
                        id: jogadorId
                    },
                    data: {
                        ...data,
                        timeId: (deleteTime ? null : data.timeId),
                        imagem: {
                            delete: {
                                jogadorId: jogadorId
                            }
                        }
                    },
                    select: {
                        nome: true,
                        presenca: true,
                        nota: true,
                        time: {
                            select: {
                                nome: true
                            }
                        }
                    }
                })
            }else{
                if(file){
                    result = await prisma.jogadores.update({
                        where: {
                            id: jogadorId
                        },
                        data: {
                            ...data,
                            timeId: (deleteTime ? null : data.timeId),
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
                            },
                            presenca: true,
                            nota: true,
                            time: {
                                select: {
                                    nome: true
                                }
                            }
                        }
                    })
                }else{
                    result = await prisma.jogadores.update({
                        where: {
                            id: jogadorId
                        },
                        data: {
                            ...data,
                            timeId: (deleteTime ? null : data.timeId),
                        },
                        select: {
                            nome: true,
                            presenca: true,
                            nota: true,
                            imagem: {
                                select: {
                                    id: true,
                                    name: true,
                                    path: true,
                                    size: true,
                                    url: true
                                }
                            },
                            time: {
                                select: {
                                    nome: true
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