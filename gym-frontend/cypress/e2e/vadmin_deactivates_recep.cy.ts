describe('template spec', () => {
  it('passes', () => {
     cy.visit('/login')
         cy.get('#email').click();
         cy.get('#email').type('admin@example.com');
         cy.get('#password').type('admin123');
         cy.get('button.w-full').click();
     cy.get('div.grid a[href="/admin/users"]').click();
     cy.get('tr:nth-child(5) button.text-yellow-600 svg.lucide').click();
     cy.get('p.font-medium').click();
     cy.get('button.hover\\:bg-red-50 span').click();
     cy.get('#email').click();
     cy.get('#email').type('receptionist@example.com');
     cy.get('#password').type('recep123');
     cy.get('button.w-full').click();
  })
})