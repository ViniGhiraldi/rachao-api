import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

interface ITime{
    id: string;
}

interface IJogador{
    id: string;
    time: ITime | null;
}

export async function sorteio(app: FastifyInstance) {
    app.put('/sorteio/:rachaoId', async (req, res) => {
        const paramsValidation = z.object({
            rachaoId: z.string().cuid()
        })

        const bodyValidation = z.object({
            apenasJogadoresSemTime: z.boolean().default(false),
            apenasJogadoresConfirmados: z.boolean().default(false)
        })

        const { rachaoId } = paramsValidation.parse(req.params);
        const { apenasJogadoresConfirmados, apenasJogadoresSemTime } = bodyValidation.parse(req.body);

        try {
            let jogadores: IJogador[];

            if(apenasJogadoresConfirmados && apenasJogadoresSemTime){
                jogadores = await prisma.jogadores.findMany({
                    where: {
                        rachaoId: rachaoId,
                        presenca: true,
                        timeId: null
                    },
                    select: {
                        id:true,
                        time: {
                            select: {
                                id: true
                            }
                        }
                    }
                });
            }else if(apenasJogadoresConfirmados){
                jogadores = await prisma.jogadores.findMany({
                    where: {
                        rachaoId: rachaoId,
                        presenca: true
                    },
                    select: {
                        id:true,
                        time: {
                            select: {
                                id: true
                            }
                        }
                    }
                });
            }else if(apenasJogadoresSemTime){
                jogadores = await prisma.jogadores.findMany({
                    where: {
                        rachaoId: rachaoId,
                        timeId: null
                    },
                    select: {
                        id:true,
                        time: {
                            select: {
                                id: true
                            }
                        }
                    }
                });
            }else{
                jogadores = await prisma.jogadores.findMany({
                    where: {
                        rachaoId: rachaoId
                    },
                    select: {
                        id:true,
                        time: {
                            select: {
                                id: true
                            }
                        }
                    }
                });
            }

            const times = await prisma.times.findMany({
                where: {
                    rachaoId: rachaoId
                },
                select: {
                    id: true,
                    _count: {
                        select: {
                            jogadores: true
                        }
                    }
                }
            });

            const jogadoresCount = await prisma.jogadores.count();

            const jogadoresPorTime = Math.floor(jogadoresCount / times.length);

            jogadores.sort(() => Math.random() - 0.5);

            const timesFiltered = times.map(time => {
                const jogadoresInTime = jogadores.filter(jogador => jogador.time?.id === time.id);
                return {...time, _count: {jogadores: time._count.jogadores - jogadoresInTime.length}}
            });

            timesFiltered.forEach(async (time, i) => {
                let amountJogadoresInTime = time._count.jogadores;
                if(jogadores.length >= times.length){
                    for (let indexJogador = i; indexJogador < jogadores.length; indexJogador = indexJogador+timesFiltered.length) {
                        if(amountJogadoresInTime < jogadoresPorTime){
                            await prisma.jogadores.update({
                                where: {
                                    id: jogadores[indexJogador].id
                                },
                                data: {
                                    timeId: time.id
                                }
                            })
                            amountJogadoresInTime++;
                        }
                    }
                }else{
                    jogadores.forEach(async (jogador) => {
                        if(amountJogadoresInTime < jogadoresPorTime){
                            await prisma.jogadores.update({
                                where: {
                                    id: jogador.id
                                },
                                data: {
                                    timeId: time.id
                                }
                            })
                            amountJogadoresInTime++;
                        }
                    })
                }
            })

            return res.status(200).send({data: {message: 'Draw carried out successfully'}});
        } catch (error) {
            return res.status(500).send({error});
        }
    })
}