import { randomUUID } from 'crypto';
import type { CreateProductRequest } from '../request/GetProductsRequest';
import type { ProductResponse, PaginatedProductResponse } from '../response/ProductResponse';

/**
 * Simple random data generator (no external dependencies)
 */
class FakeDataGenerator {
  static productNames = [
    'Professional Hammer',
    'Cordless Drill',
    'Power Saw',
    'Level Tool',
    'Measuring Tape',
    'Screwdriver Set',
    'Wrench Set',
    'Pliers Kit',
    'Tool Belt',
    'Safety Glasses',
    'Work Gloves',
    'Paint Brush Set',
    'Nail Assortment',
    'Bolt Collection',
    'Electrical Cable',
  ];

  static descriptions = [
    'High-quality professional grade tool',
    'Durable and reliable for everyday use',
    'Perfect for home improvement projects',
    'Industrial strength construction',
    'Precision engineered for accuracy',
    'Designed for maximum durability',
    'Ideal for professionals and DIY enthusiasts',
    'Lightweight and portable design',
    'Weather-resistant construction',
    'Backed by comprehensive warranty',
  ];

  static brands = ['DeWalt', 'Stanley', 'Black+Decker', 'Makita', 'Bosch', 'Craftsman'];

  static randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static randomPrice(min: number = 5, max: number = 500): number {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }

  static randomRating(): 'A' | 'B' | 'C' | 'D' | 'E' {
    return this.randomElement(['A', 'B', 'C', 'D', 'E'] as const);
  }

  static randomBoolean(): boolean {
    return Math.random() > 0.5;
  }

  static randomId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  static productName(): string {
    return this.randomElement(this.productNames);
  }

  static description(): string {
    return this.randomElement(this.descriptions);
  }

  static uuid(): string {
    return `${this.randomId()}-${this.randomId()}-${this.randomId()}`;
  }
}

/**
 * ProductBuilder for fluent construction of test product data with fake data
 */
export class ProductBuilder {
  private data: CreateProductRequest;

  constructor(categoryId: string = randomUUID().toUpperCase(), brandId: string = randomUUID().toUpperCase()) {
    this.data = {
      name: FakeDataGenerator.productName(),
      description: FakeDataGenerator.description(),
      price: FakeDataGenerator.randomPrice(),
      category_id: (categoryId),
      brand_id: (brandId),
      product_image_id: FakeDataGenerator.uuid(),
      is_location_offer: FakeDataGenerator.randomBoolean(),
      is_rental: FakeDataGenerator.randomBoolean(),
      co2_rating: FakeDataGenerator.randomRating(),
    };
  }

  withName(name: string): this {
    this.data.name = name;
    return this;
  }

  withDescription(description: string): this {
    this.data.description = description;
    return this;
  }

  withPrice(price: number): this {
    this.data.price = price;
    return this;
  }

  withCategoryId(categoryId: string): this {
    this.data.category_id = categoryId;
    return this;
  }

  withBrandId(brandId: string): this {
    this.data.brand_id = brandId;
    return this;
  }

  withProductImageId(imageId: string): this {
    this.data.product_image_id = imageId;
    return this;
  }

  withIsLocationOffer(value: boolean): this {
    this.data.is_location_offer = value;
    return this;
  }

  withIsRental(value: boolean): this {
    this.data.is_rental = value;
    return this;
  }

  withCo2Rating(rating: 'A' | 'B' | 'C' | 'D' | 'E'): this {
    this.data.co2_rating = rating;
    return this;
  }

  build(): CreateProductRequest {
    return { ...this.data };
  }
}

/**
 * ProductFactory creates realistic test data with builder pattern
 * Uses real category and brand IDs passed as parameters
 */
export class ProductFactory {
  /**
   * Create a valid product with sensible defaults
   * @param categoryId Real category ID from API (defaults to 1)
   * @param brandId Real brand ID from API (defaults to 1)
   */
  static createValidProduct(categoryId: string  = randomUUID().toUpperCase(), brandId: string = randomUUID().toUpperCase()): ProductBuilder {
    return new ProductBuilder(categoryId, brandId);
  }

  /**
   * Create a hammer product with specific characteristics
   */
  static createHammer(categoryId: string = randomUUID().toUpperCase(), brandId: string = randomUUID().toUpperCase()): ProductBuilder {
    return new ProductBuilder(categoryId, brandId)
      .withName('Hammer')
      .withDescription('Professional grade hammer for construction')
      .withPrice(FakeDataGenerator.randomPrice(10, 50));
  }

  /**
   * Create an eco-friendly (A rated) product
   */
  static createEcoFriendlyProduct(
    categoryId: string = randomUUID().toUpperCase(),
    brandId: string = randomUUID().toUpperCase()
  ): ProductBuilder {
    return new ProductBuilder(categoryId, brandId)
      .withCo2Rating('A')
      .withDescription('Sustainable and eco-friendly product');
  }

  /**
   * Create a rental product
   */
  static createRentalProduct(categoryId: string = randomUUID().toUpperCase(), brandId: string = randomUUID().toUpperCase()): ProductBuilder {
    return new ProductBuilder(categoryId, brandId)
      .withIsRental(true)
      .withPrice(FakeDataGenerator.randomPrice(5, 20));
  }

  /**
   * Create an expensive product (for price range tests)
   */
  static createExpensiveProduct(
    categoryId: string = randomUUID().toUpperCase(),
    brandId: string = randomUUID().toUpperCase()
  ): ProductBuilder {
    return new ProductBuilder(categoryId, brandId)
      .withPrice(FakeDataGenerator.randomPrice(300, 1000))
      .withName('Premium Professional Grade ' + FakeDataGenerator.productName());
  }

  /**
   * Create a budget product
   */
  static createBudgetProduct(categoryId: string = randomUUID().toUpperCase(), brandId: string = randomUUID().toUpperCase()): ProductBuilder {
    return new ProductBuilder(categoryId, brandId)
      .withPrice(FakeDataGenerator.randomPrice(1, 10))
      .withName('Economy ' + FakeDataGenerator.productName());
  }

  /**
   * Create a product with missing required field (for negative tests)
   */
  static createProductMissingName(categoryId: string = randomUUID().toUpperCase(), brandId: string = randomUUID().toUpperCase()): Record<string, any> {
    const builder = new ProductBuilder(categoryId, brandId).build();
    const { name, ...rest } = builder;
    return rest;
  }

  /**
   * Create a product with invalid price (string instead of number)
   */
  static createProductInvalidPrice(categoryId: string = randomUUID().toUpperCase(), brandId: string = randomUUID().toUpperCase()): Record<string, any> {
    return {
      ...new ProductBuilder(categoryId, brandId).build(),
      price: 'invalid_price_not_a_number',
    };
  }
}

/**
 * ResponseFactory creates mocked API response objects
 */
export class ResponseFactory {
  /**
   * Create a valid ProductResponse object
   */
  static createProductResponse(
    categoryId: string = randomUUID().toUpperCase(),
    brandId: string = randomUUID().toUpperCase(),
    overrides?: Partial<ProductResponse>
  ): ProductResponse {
    const baseProduct: ProductResponse = {
      id: String(Math.floor(Math.random() * 10000)),
      name: FakeDataGenerator.productName(),
      description: FakeDataGenerator.description(),
      price: FakeDataGenerator.randomPrice(),
      is_location_offer: FakeDataGenerator.randomBoolean(),
      is_rental: FakeDataGenerator.randomBoolean(),
      in_stock: FakeDataGenerator.randomBoolean(),
      co2_rating: FakeDataGenerator.randomRating(),
      is_eco_friendly: FakeDataGenerator.randomBoolean(),
      brand: {
        id: String(brandId),
        name: FakeDataGenerator.randomElement(FakeDataGenerator.brands),
      },
      category: {
        id: String(categoryId),
        name: FakeDataGenerator.productName(),
        slug: 'category-slug',
      },
    };

    return { ...baseProduct, ...overrides };
  }

  /**
   * Create a paginated product response
   */
  static createPaginatedProductResponse(
    products: ProductResponse[],
    page: number = 1,
    perPage: number = 9
  ): PaginatedProductResponse {
    const total = products.length;
    const lastPage = Math.ceil(total / perPage);
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    return {
      current_page: page,
      data: products,
      from,
      to,
      last_page: lastPage,
      per_page: perPage,
      total,
    };
  }

  /**
   * Create multiple products for list responses
   */
  static createProductList(count: number, categoryId: string = randomUUID().toUpperCase(), brandId: string = randomUUID().toUpperCase()): ProductResponse[] {
    return Array.from({ length: count }, (_, i) =>
      this.createProductResponse(categoryId, brandId, {
        id: String(i + 1),
        name: `${FakeDataGenerator.productName()} #${i + 1}`,
      })
    );
  }
}

