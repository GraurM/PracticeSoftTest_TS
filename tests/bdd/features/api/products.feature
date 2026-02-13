Feature: Product API
  Validate product listing and product details responses

  Scenario: List products
    Given Product API is available
    When Request product list
    Then API response status is 200
    And Response includes products
    And Store first product id

  Scenario: Get product details by stored id
    Given Product API is available
    When Request product list
    And Store first product id
    And Request product details by stored id
    Then API response status is 200
    And Response product id matches stored id
