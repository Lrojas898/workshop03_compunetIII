describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('coach@example.com');
    cy.get('#password').type('coach123');
    cy.get('button.w-full').click();
    cy.get('p.text-blue-100').click();
    cy.get('a[href="/coach"] span.font-medium').click();
  })
})