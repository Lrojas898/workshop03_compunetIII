describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').type('admin123');
    cy.get('button.w-full').click();
    cy.get('a[href="/admin/attendances"] div.items-start').click();
    cy.get('input.w-full').click();
    cy.get('input.w-full').type('client');
    cy.get('div.md\\:grid-cols-2 div:nth-child(2)').click();
    cy.get('select.w-full').select('gym');
    cy.get('select.w-full').select('class');
    cy.get('button.justify-center').click();
  })
})