describe('template spec', () => {
  it('passes', () => {
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').type('admin123');
    cy.get('button.w-full').click();
    cy.get('a[href="/admin/classes"] div.items-start').click();
    cy.contains('tr', 'Pilates 10:00 AM').find('button[title="Editar"]').click();
    cy.get('#name').click();
    cy.get('#name').clear();
    cy.get('#name').type('gym solo gym');
    cy.get('#description').click();
    cy.get('#description').click();
    cy.get('#description').clear();
    cy.get('#description').type('verdadero entrenamiento');
    cy.get('#capacity').click();
    cy.get('#capacity').clear();
    cy.get('#capacity').type('20');
    cy.get('button[type="submit"]').click();
  })
})