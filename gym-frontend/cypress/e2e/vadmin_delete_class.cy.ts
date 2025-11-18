describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').type('admin123');
    cy.get('button.w-full').click();
    cy.get('a[href="/admin/classes"] h3.font-bold').click();
    cy.get('tr:nth-child(3) button.text-red-600 svg.lucide').click();
  })
})