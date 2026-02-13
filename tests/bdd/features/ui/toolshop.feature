Feature: Toolshop catalog
  Validate search, filter, and cart behavior for products

  Scenario: Search for a product
    Given Open the toolshop home page
    When Search for "Hammer"
    Then search results include "Hammer"

  Scenario: Open product details from search
    Given Open the toolshop home page
    When Search for "Hammer"
    And Open the product details for "Hammer"
    Then the product page shows "Hammer"

  Scenario: Add a product to the cart
    Given Open the toolshop home page
    When Search for "Hammer"
    And Open the product details for "Hammer"
    And Add the product to the cart
    Then the product page stays open

  Scenario: Filter by category and brand
    Given Open the toolshop home page
    When Filter by category "Hand Tools"
    And Filter by brand "ForgeFlex"
    Then search results are shown
