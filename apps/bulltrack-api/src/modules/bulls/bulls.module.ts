import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bull } from './entities/bull.entity';
import { BullsController } from './bulls.controller';
import { BullsService } from './application/bulls.service';
import { BullRepository } from './infrastructure/persistence/bull.repository';
import { BULL_REPOSITORY } from './domain/ports/bull.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([Bull])],
  controllers: [BullsController],
  providers: [
    BullsService,
    { provide: BULL_REPOSITORY, useClass: BullRepository },
  ],
  exports: [BullsService],
})
export class BullsModule {}
