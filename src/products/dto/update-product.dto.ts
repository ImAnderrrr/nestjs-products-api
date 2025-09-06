import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, Min, ValidateIf } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ValidateIf(o => o.stock !== undefined)
  @IsNumber()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;
}
