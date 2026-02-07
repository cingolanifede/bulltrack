import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryBullsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['propio', 'catalogo', 'favoritos'])
  origen?: 'propio' | 'catalogo' | 'favoritos';

  @IsOptional()
  @Type(() => Boolean)
  paraVaquillona?: boolean;

  @IsOptional()
  @IsIn(['negro', 'colorado'])
  pelaje?: 'negro' | 'colorado';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortByScore?: 'asc' | 'desc' = 'desc';
}
