describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('coach@example.com');
    cy.get('#password').type('coach123');
    cy.get('button.w-full').click();
    cy.get('h3.text-lg').click();
    cy.contains('button', 'Nueva Clase').click();
    cy.contains('h3', 'Nueva Clase').should('be.visible');
    cy.get('#name').click();
    cy.get('#name').type('clase de salsa');
    cy.get('#description').click();
    cy.get('#description').type('bailalo rumbero');
    cy.get('button[type="submit"]').click();
  })
})