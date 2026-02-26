Feature: Automation Test Store
  Validate search, product details, cart, and checkout behavior

  @screenshot
  Scenario: Search for a product
    Given Open the Automation Test Store home page
    When Search for "Skinsheen"
    Then search results include a product

  Scenario: Add a product to the cart
    Given Open the Automation Test Store home page
    When Search for "Skinsheen"
    And Add the product to cart
    Then the product is added to the cart

  Scenario: Complete checkout flow
    Given Open the Automation Test Store home page
    When Search for "Skinsheen"
    And Add the product to cart
    And click the Checkout button
    Then the Account Login page is displayed
    And user is asked to authenticate or create an account
