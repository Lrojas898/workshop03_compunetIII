describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('coach@example.com');
    cy.get('#password').type('coach123');
    cy.get('button.w-full').click();
    cy.get('#classId').select('8d3f7ff4-89df-41ba-b84b-b953b8878034');
    cy.get('#userId').select('9b474a92-26d9-433b-be0e-60db031a5135');
    cy.get('#notes').click();
    cy.get('#notes').type('muy bien');
    cy.get('button.w-full').click();
  })
})