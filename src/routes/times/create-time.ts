import { FastifyInstance } from "fastify";
import z from "zod";
import upload from "../../lib/multer";
import { prisma } from "../../lib/prisma";
import { FileType } from "../../models/filetype";

export async function createTime(app: FastifyInstance) {
    app.post('/times/:rachaoId', { preHandler: upload.single('imagem') }, async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })
        
        const bodyValidation = z.object({
            nome: z.string().trim()
        })
        
        const { rachaoId } = paramsValidation.parse(req.params);
        const { nome } = bodyValidation.parse(req.body);
        const file = (req as any).file as FileType;

        try {
            let result;
            if(file){
                result = await prisma.times.create({
                    data: {
                        nome: nome,
                        rachaoId: rachaoId,
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
                result = await prisma.times.create({
                    data: {
                        nome: nome,
                        rachaoId: rachaoId
                    },
                    select: {
                        id: true,
                        nome: true
                    }
                })
            }

            return res.status(201).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}