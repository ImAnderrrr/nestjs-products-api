import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  nombre: string;

  @IsString() @IsOptional()
  descripcion?: string;

  @IsNumber() @Min(0)
  precio: number;

  @IsNumber() @Min(0)
  stock: number;

  @IsString() @IsNotEmpty()
  sku: string;
}
