describe('Shopping Flow', () => {
  it('can browse products and add to cart', () => {
    cy.visit('/products');
    cy.get('[data-testid="product-card"]').first().click();
    cy.url().should('include', '/products/');
    cy.contains('Add to Cart').click();
    cy.contains('added to cart').should('be.visible');
    cy.visit('/cart');
    cy.contains('Shopping Cart').should('be.visible');
    cy.contains('Proceed to Checkout').should('be.visible');
  });

  it('can register a new account', () => {
    cy.visit('/register');
    cy.get('#name').type('Test User');
    cy.get('#email').type(`test${Date.now()}@example.com`);
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('verify your email').should('be.visible');
  });
});
