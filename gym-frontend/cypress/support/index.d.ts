// cypress/support/index.d.ts

declare module 'cypress' {
  interface Chainable {
    /**
     * Comando personalizado para iniciar sesión como administrador.
     * Utiliza cy.session para cachear la sesión.
     * @example cy.loginAsAdmin()
     */
    loginAsAdmin(email?: string, password?: string): Chainable<void>;
  }
}

export {}; // Asegura que sea un módulo