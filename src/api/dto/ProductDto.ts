import { BrandDto} from './BrandDto';
import { CategoryDto } from './CategoryDto';
import { ProductImageDto } from './ProductImageDto';

/**
 * Data Transfer Object for Product API responses
 */
export interface ProductDto {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  is_location_offer?: boolean;
  is_rental?: boolean;
  in_stock?: boolean;
  co2_rating?: string;
  is_eco_friendly?: boolean;
  brand?: BrandDto;
  category?: CategoryDto;
  product_image?: ProductImageDto;
  
  [key: string]: any; // Allow for additional properties
}

/**
 * Data Transfer Object for Product List API response
 * Handles different API response formats (array, data wrapper, etc.)
 */
export interface ProductListResponseDto {
  current_page?: number;
  data?: ProductDto[];
  from?: number;
  last_page?: number;
  per_page?: number;
  to?: number;
  total?: number;

  [key: string]: any; // Allow for additional properties
}

/**
 * Helper class to normalize API responses into DTOs
 */
export class ProductDtoMapper {
  /**
   * Extract products array from various response formats
   */
  static toProductList(response: any): ProductDto[] {
    if (Array.isArray(response)) {
      return response;
    }
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (response?.products && Array.isArray(response.products)) {
      return response.products;
    }
    return [];
  }

  /**
   * Extract single product from response
   */
  static toProduct(response: any): ProductDto {
    if (response?.data && typeof response.data === 'object') {
      return response.data;
    }
    if (response?.product && typeof response.product === 'object') {
      return response.product;
    }
    return response || {};
  }

  /**
   * Extract product ID from product object
   */
  static getProductId(data: ProductDto): string | undefined {
    return data.id ?? data._id;
  }
}
