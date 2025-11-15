describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('coach@example.com');
    cy.get('#password').type('coach123');
    cy.get('button.w-full').click();
    cy.get('h3.text-lg').click();
    cy.get('button.text-base').click();
    cy.get('#name').click();
    cy.get('#name').type('clase de salsa');
    cy.get('#description').click();
    cy.get('#description').type('bailalo rumbero');
    cy.get('button[type="submit"]').click();
  })
})