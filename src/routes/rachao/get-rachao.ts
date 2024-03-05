import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function getRachao(app: FastifyInstance) {
    app.get('/rachao/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const { rachaoId } = paramsValidation.parse(req.params);

        try {
            const result = await prisma.rachao.findUnique({
                where: {
                    id: rachaoId
                },
                select: {
                    id: true,
                    nome: true,
                    modalidade: true,
                    local: true,
                    diahora: true,
                    regras: true,
                    status: true,
                    custoTotal: true,
                    custoPessoa: true,
                    jogadores: {
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
                            },
                            nota: true,
                            presenca: true,
                            time: {
                                select: {
                                    nome: true
                                }
                            }
                        },
                    },
                    times: {
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
                            },
                            jogadores: {
                                select: {
                                    id: true,
                                    nome: true,
                                    imagem: true,
                                    presenca: true,
                                }
                            },
                            _count: {
                                select: {
                                    jogadores: true
                                }
                            }
                        }
                    },
                    despesas: {
                        select: {
                            id: true,
                            titulo: true,
                            custoUnitario: true,
                            quantidade: true,
                            custoTotal: true
                        }
                    },
                    resultados: {
                        select: {
                            id: true,
                            timeCasa: {
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
                            },
                            timeVisitante: {
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
                                }
                            },
                            timeVencedor: {
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
                                }
                            },
                            resultado: true,
                            duracao: true
                        }
                    },
                    _count: {
                        select: {
                            jogadores: true,
                            times: true,
                            despesas: true,
                            resultados: true
                        }
                    }
                }
            })

            return res.status(200).send({data: result});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}