describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').click();
    cy.get('#password').type('admin123');
    cy.get('button.w-full').click();
    cy.get('button.flex').click();
    cy.get('button.w-full.text-gray-700').click();
    cy.get('button.bg-gray-200').click();
  })
})