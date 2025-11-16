describe('my first test', () => {
  it('gets, types and asserts', () => {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    // como nos movemos a una nueva pagina, verificamos su url:
    cy.url().should('include', '/commands/actions')

    //get an input, type into it
    cy.get('.action-email').type('fake@email.com')
    //verify value has been updated
    cy.get('.action-email').should('have.value', 'fake@email.com')
  })
})