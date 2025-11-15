describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').type('admin123');
    cy.get('button.w-full').click();
    cy.get('div.grid a[href="/admin/classes"]').click();
    cy.get('button.text-base').click();
    cy.get('#name').click();
    cy.get('#name').type('clase de baile - salsa');
    cy.get('#description').click();
    cy.get('button[type="submit"]').click();
  })
})