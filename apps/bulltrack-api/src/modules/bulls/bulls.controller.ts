import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { QueryBullsDto } from './dto/query-bulls.dto';
import { BullsService } from './application/bulls.service';
import { User } from '../users/entities/user.entity';

@Controller('bulls')
@UseGuards(JwtAuthGuard)
export class BullsController {
  constructor(private readonly bullsService: BullsService) {}

  @Get()
  async findAll(@Query() query: QueryBullsDto, @CurrentUser() user: User) {
    return this.bullsService.findAll(query, user.id);
  }
}
