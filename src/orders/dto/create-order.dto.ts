import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'María González',
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    example: 'maria@example.com',
  })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    example: 'Enterprise Laptop',
  })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({
    example: 2,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;
}
