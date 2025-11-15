describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('client2@example.com');
    cy.get('#password').type('client123');
    cy.get('button.w-full').click();
    cy.get('a.text-white').click();
    cy.get('div.grid > div:nth-child(1)').click();
    cy.get('button.text-white').click();
    cy.get('a[href="/client/my-subscription"]').click();
  })
})