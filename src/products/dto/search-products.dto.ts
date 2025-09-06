import { IsIn, IsInt, IsObject, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FiltersDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsString() sku?: string;
}

export class SearchProductsDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
  limit?: number = 10;

  @IsOptional() @IsString()
  sortBy?: 'nombre' | 'precio' | 'stock' | 'sku' | 'id' = 'nombre';

  @IsOptional() @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';

  @IsOptional() @IsObject() @ValidateNested() @Type(() => FiltersDto)
  filters?: FiltersDto;
}
