/// <reference types="cypress" />
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Comando personalizado para iniciar sesión como administrador.
       * Utiliza cy.session para cachear la sesión.
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(email?: string, password?: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsAdmin', (
  email = 'admin@example.com',
  password = 'admin123'
) => {
  cy.session([email, password], () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/login', 
      body: { email, password },
    }).then(({ body }) => {

      window.localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          token: body.token,
          user: body.user, 
          isAuthenticated: true,
        },
        version: 0, 
      }));
    });
  }, {

    validate() {

      cy.visit('/admin');
      cy.url().should('include', '/admin');
    }
  });
});

export {};