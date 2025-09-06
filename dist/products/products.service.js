"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductsService = class ProductsService {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        const exists = await this.repo.findOne({ where: { sku: dto.sku } });
        if (exists)
            throw new common_1.ConflictException('El SKU ya existe');
        const toCreate = this.repo.create(Object.assign(Object.assign({}, dto), { precio: Number(dto.precio).toFixed(2) }));
        return this.repo.save(toCreate);
    }
    async findOne(id) {
        const product = await this.repo.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Producto no encontrado');
        return product;
    }
    async update(id, dto) {
        const product = await this.findOne(id);
        if (dto.stock !== undefined && dto.stock < 0) {
            throw new common_1.BadRequestException('El stock no puede ser negativo');
        }
        if (dto.sku && dto.sku !== product.sku) {
            const skuExists = await this.repo.findOne({ where: { sku: dto.sku } });
            if (skuExists)
                throw new common_1.ConflictException('El SKU ya existe');
        }
        const dtoFixed = {};
        if (dto.nombre !== undefined)
            dtoFixed.nombre = dto.nombre;
        if (dto.descripcion !== undefined)
            dtoFixed.descripcion = dto.descripcion;
        if (dto.precio !== undefined)
            dtoFixed.precio = Number(dto.precio).toFixed(2);
        if (dto.stock !== undefined)
            dtoFixed.stock = dto.stock;
        if (dto.sku !== undefined)
            dtoFixed.sku = dto.sku;
        const updated = this.repo.merge(product, dtoFixed);
        return this.repo.save(updated);
    }
    async remove(id) {
        const product = await this.findOne(id);
        if (product.stock > 0) {
            throw new common_1.BadRequestException('No se puede eliminar un producto con stock mayor a cero');
        }
        await this.repo.delete({ id });
    }
    async search(dto) {
        var _a, _b, _c, _d;
        const page = (_a = dto.page) !== null && _a !== void 0 ? _a : 1;
        const limit = (_b = dto.limit) !== null && _b !== void 0 ? _b : 10;
        const skip = (page - 1) * limit;
        const orderField = (_c = dto.sortBy) !== null && _c !== void 0 ? _c : 'nombre';
        const orderDir = (_d = dto.order) !== null && _d !== void 0 ? _d : 'ASC';
        const where = {};
        if (dto.filters) {
            const { id, nombre, descripcion, sku } = dto.filters;
            if (id)
                where.id = id;
            if (sku)
                where.sku = sku;
            if (nombre)
                where.nombre = (0, typeorm_2.ILike)(`%${nombre}%`);
            if (descripcion)
                where.descripcion = (0, typeorm_2.ILike)(`%${descripcion}%`);
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map