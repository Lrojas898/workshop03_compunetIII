describe('template spec', () => {
  it('passes', () => {
    cy.visit('/register')
    cy.get('#fullName').click();
    cy.get('#fullName').type('santiago angel');
    cy.get('#email').type('santiago@example.com');
    cy.get('#age').type('21');
    cy.get('#password').type('santiago123');
    cy.get('#confirmPassword').type('santiago123');
    cy.get('button.w-full').click();
    cy.get('p.text-xs').click();
    cy.get('button.w-full.text-gray-700 span').click();
    cy.get('button.bg-gray-200').click();
  })
})