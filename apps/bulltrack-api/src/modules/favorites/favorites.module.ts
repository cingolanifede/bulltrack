import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './application/favorites.service';
import { FavoriteRepository } from './infrastructure/persistence/favorite.repository';
import { FAVORITE_REPOSITORY } from './domain/ports/favorite.repository.port';
import { BullsModule } from '../bulls/bulls.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), BullsModule],
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    { provide: FAVORITE_REPOSITORY, useClass: FavoriteRepository },
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
