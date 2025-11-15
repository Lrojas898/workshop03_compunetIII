describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').type('admin123');
    cy.get('button.w-full').click();
    cy.get('div.grid a[href="/admin/subscriptions"]').click();
    cy.get('tr:nth-child(1) button.text-blue-600 svg.lucide').click();
    cy.get('span.hidden').click();
  })
})