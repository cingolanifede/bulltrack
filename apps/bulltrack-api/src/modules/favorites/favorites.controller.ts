import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FavoritesService } from './application/favorites.service';
import { User } from '../users/entities/user.entity';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':bullId')
  async add(
    @Param('bullId', ParseIntPipe) bullId: number,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.add(user.id, bullId);
  }

  @Delete(':bullId')
  async remove(
    @Param('bullId', ParseIntPipe) bullId: number,
    @CurrentUser() user: User,
  ) {
    return this.favoritesService.remove(user.id, bullId);
  }

  @Get()
  async list(@CurrentUser() user: User) {
    const ids = await this.favoritesService.getFavoriteBullIds(user.id);
    return { bullIds: ids };
  }
}
