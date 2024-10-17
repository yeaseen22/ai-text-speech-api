import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiGateModule } from './api-gate/api-gate.module';

@Module({
  imports: [ApiGateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
