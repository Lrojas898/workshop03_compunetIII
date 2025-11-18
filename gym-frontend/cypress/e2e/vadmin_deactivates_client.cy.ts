describe('template spec', () => {
  it('passes', () => {
    cy.on('window:confirm', (text) => {
      // Verificamos que el texto del diálogo sea el correcto.
      expect(text).to.contains(`¿Estás seguro de que deseas desactivar a Client User?`);
      // Al no devolver `false`, Cypress automáticamente hará clic en "Aceptar".
    });
    cy.visit('/login')
    cy.get('#email').click();
    cy.get('#email').type('admin@example.com');
    cy.get('#password').type('admin123');
    cy.get('button.w-full').click();
    cy.get('div.grid a[href="/admin/users"]').click();
    cy.contains('tr', 'Client User').find('button[title="Desactivar usuario"]').click();
  })
})