describe('login landing', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/#/login')
    
    cy.get('button[type="submit"]').should('be.visible')

    cy.get('input[name="username"]').type('AdamT')
    cy.get('input[name="password"]').type('1234')
    
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/trips')
  })
})