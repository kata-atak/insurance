import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClaimModule } from './claim/claim.module';

@Module({
  imports: [ClaimModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
