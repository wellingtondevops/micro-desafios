import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partida } from './interfaces/partida.interface';
import { Desafio } from '../desafios/interfaces/desafio.interface';
import { RpcException } from '@nestjs/microservices';

import { TOPICS } from 'src/common/environments';
import { ClientProxySmartRanking } from 'src/proxyrmq/cliente-proxy';

@Injectable()
export class PartidasService {
  constructor(
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly logger = new Logger(PartidasService.name);

  private clientDesafios =
    this.clientProxySmartRanking.getClientProxyDesafiosInstance();

  private clientRankings =
    this.clientProxySmartRanking.getClientProxyDesafiosInstance();

  async criarPartida(partida: Partida): Promise<Partida> {
    try {
      
      const partidaCriada = new this.partidaModel(partida);
      this.logger.log(`partidaCriada: ${JSON.stringify(partidaCriada)}`);
     
      const result = await partidaCriada.save();
      this.logger.log(`result: ${JSON.stringify(result)}`);
      const idPartida = result._id;
      
      const desafio: Desafio = await this.clientDesafios
        .send(TOPICS.CONSULTAR_DESAFIOS, {
          idJogador: '',
          _id: partida.desafio,
        })
        .toPromise();
      
      await this.clientDesafios
        .emit(TOPICS.ATUALIZAR_DESAFIO_PARTIDA, {
          idPartida: idPartida,
          desafio: desafio,
        })
        .toPromise();

        return await this.clientRankings
        .emit(TOPICS.PROCESSAR_PARTIDA, { idPartida: idPartida, partida: partida })
        .toPromise();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
