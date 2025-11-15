describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').type('admin123');
    cy.get('button.w-full').click();
    cy.get('a[href="/admin"] span.font-medium').click();
    cy.get('div.grid a[href="/admin/memberships"]').click();
    cy.get('button.text-base').click();
    cy.get('#name').click();
    cy.get('#name').type('premium exclusive');
    cy.get('#cost').click();
    cy.get('#cost').clear();
    cy.get('#cost').type('120');
    cy.get('#max_classes').click();
    cy.get('#max_classes').clear();
    cy.get('#max_classes').type('20');
    cy.get('#max_gym').click();
    cy.get('#max_gym').clear();
    cy.get('#max_gym').type('20');
    cy.get('button.flex-1').click();
    cy.get('tr:nth-child(1) button.text-blue-600 svg.lucide').click();
    cy.get('button.justify-center').click();
  })
})