describe('template spec', () => {
    it('passes', () => {
      cy.visit('https://www.google.com')
      cy.screenshot();
      cy.screenshot();
    })
  })