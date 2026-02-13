/**
 * Example/Documentation file showing how to use ProductDto with API responses
 */
import { ProductDto, ProductDtoMapper } from '../src/api/dto/ProductDto';
import type { APIResponse } from '@playwright/test';

// Example 1: Handling product list response (array format)
async function exampleProductListArray(response: APIResponse) {
  const data = await response.json();
  // data = [{ id: '1', name: 'Product 1' }, { id: '2', name: 'Product 2' }]
  
  const products: ProductDto[] = ProductDtoMapper.toProductList(data);
  console.log(`Found ${products.length} products`);
  
  products.forEach(product => {
    const id = ProductDtoMapper.getProductId(product);
    console.log(`Product: ${product.name} (ID: ${id})`);
  });
}

// Example 2: Handling product list response (paginated format)
async function exampleProductListPaginated(response: APIResponse) {
  const data = await response.json();
  // data = { 
  //   data: [{ id: '1', name: 'Product 1' }],
  //   total: 100,
  //   current_page: 1,
  //   per_page: 10
  // }
  
  const products: ProductDto[] = ProductDtoMapper.toProductList(data);
  console.log(`Showing ${products.length} of ${data.total} products`);
}

// Example 3: Handling single product response
async function exampleSingleProduct(response: APIResponse) {
  const data = await response.json();
  // data = { id: '1', name: 'Product 1', price: 99.99 }
  
  const product: ProductDto = ProductDtoMapper.toProduct(data);
  const id = ProductDtoMapper.getProductId(product);
  
  console.log(`Product: ${product.name}`);
  console.log(`Price: $${product.price}`);
  console.log(`ID: ${id}`);
}

// Example 4: Using in test steps
function exampleInTestSteps() {
  // Store products in context
  // this.testContext.setProducts(products);
  
  // Retrieve products from context
  // const products = this.testContext.getProducts();
  // const firstProduct = products?.[0];
  
  // Get product ID safely
  // const productId = ProductDtoMapper.getProductId(firstProduct);
  
  // Store single product
  // this.testContext.setProduct(product);
  
  // Retrieve single product
  // const storedProduct = this.testContext.getProduct();
}
