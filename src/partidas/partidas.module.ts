import { Module } from '@nestjs/common';

import { PartidasService } from './partidas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { PartidaSchema } from './interfaces/partida.schema';
import { PartidasController } from './partidas.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Partida', schema: PartidaSchema }]),
    ProxyRMQModule,
  ],
  controllers: [PartidasController],
  providers: [PartidasService],
})
export class PartidasModule {}
