import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    create(dto: CreateProductDto): Promise<import("./product.entity").Product>;
    findOne(id: string): Promise<import("./product.entity").Product>;
    update(id: string, dto: UpdateProductDto): Promise<import("./product.entity").Product>;
    remove(id: string): Promise<void>;
    search(dto: SearchProductsDto): Promise<{
        data: import("./product.entity").Product[];
        currentPage: number;
        totalPages: number;
        totalItems: number;
    }>;
}
