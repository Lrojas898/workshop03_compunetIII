describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('receptionist@example.com');
    cy.get('#password').type('recep123');
    cy.get('button.w-full').click();
    cy.get('p.text-xs').click();
    cy.get('button.w-full.text-gray-700 span').click();
    cy.get('button.bg-gray-200').click();
    cy.get('nav.p-6 a[href="/receptionist/check-in"]').click();
    cy.get('a[href="/receptionist"] span.font-medium').click();
  })
})