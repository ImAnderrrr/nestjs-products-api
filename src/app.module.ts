import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5433,              // 👈 según docker ps
      username: 'postgres',
      password: 'postgres',    // 👈 string explícito
      database: 'products_db',
      entities: [Product],
      synchronize: true,       // ok para la tarea
      logging: false,
      ssl: false,
    }),
    ProductsModule,
  ],
})
export class AppModule {}
