import { dollarToCent } from "utils/money"

describe('Money utility functions', () => {
  test('Dollars to cents', () => {
    const n1 = 120

    expect(dollarToCent(n1)).toBe(12000)
    
    const n2 = 4012
    expect(dollarToCent(n2)).toBe(401200)

    const n3 = -45
    expect(dollarToCent(n3)).toBe(-4500)
  })
})
