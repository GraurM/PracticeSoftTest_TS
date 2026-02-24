# Feature: Product API
#   Comprehensive testing of Product endpoints with filters, sorting, and CRUD operations

#   Background:
#     Given Product API is available

#   # LIST PRODUCTS - Basic and with filters
#   Scenario: List all products
#     When Request all products
#     Then API response status is 200
#     And Response contains paginated products
#     And Response has valid product structure

#   Scenario: List products with category filter
#     When Request products filtered by valid category
#     Then API response status is 200
#     And Response contains paginated products
#     And All products in response belong to requested category

#   # Scenario: List products with brand filter
#   #   When Request products filtered by valid brand
#   #   Then API response status is 200
#   #   And Response contains paginated products
#   #   And All products in response belong to requested brand

#   Scenario: List eco-friendly products
#     When Request eco-friendly products only
#     Then API response status is 200
#     And Response contains paginated products
#     And All products have CO2 rating A or B

#   Scenario: List rental products
#     When Request rental products only
#     Then API response status is 200
#     And Response contains paginated products
#     And All products are marked as rental

#   # Scenario: List products with price range filter
#   #   When Request products in price range between "10" and "100"
#   #   Then API response status is 200
#   #   And Response contains paginated products
#   #   And All products have price between 10 and 100

#   Scenario: List products with sorting by name ascending
#     When Request products sorted by "name,asc"
#     Then API response status is 200
#     And Response contains paginated products
#     And Products are sorted by name in ascending order

#   Scenario: List products with sorting by price descending
#     When Request products sorted by "price,desc"
#     Then API response status is 200
#     And Response contains paginated products
#     And Products are sorted by price in descending order

#   Scenario: List products with pagination
#     When Request products with page "1"
#     Then API response status is 200
#     And Response contains paginated products
#     And Current page is "1"

#   # GET PRODUCT DETAILS
#   Scenario: Get product details by ID
#     Given Store first product from list
#     When Request product details by stored product ID
#     Then API response status is 200
#     And Response product matches stored product
#     And Response has complete product details

#   Scenario: Get product details for invalid ID
#     When Request product details for invalid ID "invalid-id-12345"
#     Then API response status is 404

#   # SEARCH PRODUCTS
#   Scenario: Search products by name
#     When Search products for "Hammer"
#     Then API response status is 200
#     And Response contains paginated search results
#     And All results match search term "Hammer"

#   Scenario: Search products with pagination
#     When Search products for "tool" with page "1"
#     Then API response status is 200
#     And Response contains paginated search results
#     And Current page is "1"

#   # RELATED PRODUCTS
#   Scenario: Get related products
#     Given Store first product from list
#     When Request related products for stored product ID
#     Then API response status is 200
#     And Response contains array of related products
#     And Related products have valid structure

#   # # CREATE PRODUCT
#   # Scenario: Create new product successfully
#   #   When Create product with valid data
#   #   Then API response status is 200
#   #   And Response contains created product
#   #   And Created product has valid ID
#   #   And Store created product ID for cleanup

#   # # UPDATE PRODUCT
#   # Scenario: Update product fully (PUT)
#   #   Given Store first product from list
#   #   When Update product with new valid data
#   #   Then API response status is 200
#   #   And Response indicates "successful" update

#   # Scenario: Update non-existent product
#   #   When Update non-existent product with valid data
#   #   Then API response status is 200
#   #   And Response indicates "failed" update

#   # PATCH PRODUCT
#   Scenario: Update product partially (PATCH)
#     Given Store first product from list
#     When Partially update stored product with new name
#     Then API response status is 200
#     And Response indicates "successful" update

#   Scenario: Patch non-existent product
#     When Partially update non-existent product
#     Then API response status is 200
#     And Response indicates "failed" update

#   # # DELETE PRODUCT
#   # Scenario: Delete product successfully
#   #   Given Store first product from list
#   #   When Delete stored product
#   #   Then API response status is 204

#   # Scenario: Delete non-existent product
#   #   When Delete non-existent product
#   #   Then API response status is 404

#   # COMBINED OPERATIONS
#   Scenario: List, find, get details, and search in sequence
#     When Request all products
#     And Store first product from response
#     And Request product details by stored product ID
#     And Search products for first product name
#     Then All API calls returned status 200
#     And Response contains matching products in search results
