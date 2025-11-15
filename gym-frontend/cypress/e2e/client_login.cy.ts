describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('client@example.com');
    cy.get('#password').type('client123');
    cy.get('button.w-full').click();
    cy.get('a[href="/client/memberships"] span.font-medium').click();
    cy.get('a[href="/client"]').click();
  })
})