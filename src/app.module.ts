import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafiosModule } from './desafios/desafios.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PartidasModule } from './partidas/partidas.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get('MONGO_DB')}`,
        autoCreate: true,
      }),
      inject: [ConfigService],
    }),
    DesafiosModule,
    PartidasModule,
    ProxyRMQModule
    
    ,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
