declare class FiltersDto {
    id?: string;
    nombre?: string;
    descripcion?: string;
    sku?: string;
}
export declare class SearchProductsDto {
    page?: number;
    limit?: number;
    sortBy?: 'nombre' | 'precio' | 'stock' | 'sku' | 'id';
    order?: 'ASC' | 'DESC';
    filters?: FiltersDto;
}
export {};
