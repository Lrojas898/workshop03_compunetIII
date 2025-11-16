describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').type('admin123');
    cy.get('button.w-full').click();
    cy.get('div.grid a[href="/admin/users"]').click();
    cy.get('tr:nth-child(3) button.text-blue-600 svg.lucide').click();
    cy.get('span.hidden').click();
    cy.get('label:nth-child(2) input.rounded').check();
    cy.get('div.border-t button.text-white').click();
    cy.get('span.sm\\:text-base').click();
    cy.get('tr:nth-child(3) button.text-blue-600 svg.lucide').click();
    cy.get('span.bg-blue-100').click();
    cy.get('span.border-green-300').click();
    cy.get('div.flex-wrap').click();
  })
})