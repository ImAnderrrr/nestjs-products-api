import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly repo: Repository<Product>) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const exists = await this.repo.findOne({ where: { sku: dto.sku } });
    if (exists) throw new ConflictException('El SKU ya existe');

    const toCreate = this.repo.create({
      ...dto,
      // La entidad espera string (numeric en Postgres)
      precio: Number(dto.precio).toFixed(2),
    });
    return this.repo.save(toCreate);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.stock !== undefined && dto.stock < 0) {
      throw new BadRequestException('El stock no puede ser negativo');
    }

    if (dto.sku && dto.sku !== product.sku) {
      const skuExists = await this.repo.findOne({ where: { sku: dto.sku } });
      if (skuExists) throw new ConflictException('El SKU ya existe');
    }

    // Normalizamos tipos ANTES del merge para que coincidan con la entidad
    const dtoFixed: Partial<Product> = {};

    if (dto.nombre !== undefined) dtoFixed.nombre = dto.nombre;
    if (dto.descripcion !== undefined) dtoFixed.descripcion = dto.descripcion;
    if (dto.precio !== undefined) dtoFixed.precio = Number(dto.precio).toFixed(2); // string
    if (dto.stock !== undefined) dtoFixed.stock = dto.stock;
    if (dto.sku !== undefined) dtoFixed.sku = dto.sku;

    const updated = this.repo.merge(product, dtoFixed);
    return this.repo.save(updated);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    if (product.stock > 0) {
      throw new BadRequestException('No se puede eliminar un producto con stock mayor a cero');
    }
    await this.repo.delete({ id });
  }

  async search(dto: SearchProductsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const orderField = dto.sortBy ?? 'nombre';
    const orderDir = dto.order ?? 'ASC';

    const where: any = {};
    if (dto.filters) {
      const { id, nombre, descripcion, sku } = dto.filters;
      if (id) where.id = id;
      if (sku) where.sku = sku;
      if (nombre) where.nombre = ILike(`%${nombre}%`);
      if (descripcion) where.descripcion = ILike(`%${descripcion}%`);
    }

    const [data, totalItems] = await this.repo.findAndCount({
      where,
      order: { [orderField]: orderDir },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit) || 1;
    return { data, currentPage: page, totalPages, totalItems };
  }
}
