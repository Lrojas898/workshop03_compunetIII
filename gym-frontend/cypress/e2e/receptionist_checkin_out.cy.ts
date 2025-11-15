describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('receptionist@example.com');
    cy.get('#password').type('recep123');
    cy.get('button.w-full').click();
    cy.get('a[href="/receptionist/check-in"] span.font-medium').click();
    cy.get('button:nth-child(1) span.truncate').click();
    cy.get('button.w-full').click();
    cy.get('button.w-full').click();
    cy.get('button.text-blue-600').click();
  })
})