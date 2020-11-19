// TODO: populate dummy sneakers to setup

describe('Mono app test', () => {
  it('tests the buying experience', () => {
    cy.visit('https://localhost:3000');

    const sneakerCardName = 'Jordan 4 Columbia White';
    cy.contains(sneakerCardName);
  });
});
