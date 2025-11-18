describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('coach@example.com');
    cy.get('#password').type('coach123');
    cy.get('button.w-full').click();

    cy.get('#classId').select('Spinning 6:00 PM - Clase de ciclismo indoor de alta intensidad');
    cy.get('#userId').select('Client User (client@example.com)');
    cy.get('#notes').click();
    cy.get('#notes').type('muy bien');
    cy.get('button.w-full').click();
  })
})