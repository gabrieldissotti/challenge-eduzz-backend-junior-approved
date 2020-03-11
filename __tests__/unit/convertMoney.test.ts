import Transaction from '../../src/app/models/Transaction'

describe('Convert Money', () => {
  describe('bitcoin', () => {
    it('BRL to BTC conversion must contain a maximum 8 decimal digits', async () => {
      const conversion = await Transaction.convertMoney({
        type: 'BRL_TO_BTC',
        amount: 25,
        quote: 40799.98984
      })

      expect(conversion).toBe(0.00061275)
    });

    it('25 BRL to BTC conversion with quote = 40799.98983 should be 0.00061275', async () => {
      const conversion = await Transaction.convertMoney({
        type: 'BRL_TO_BTC',
        amount: 25,
        quote: 40799.98983,
      })

      expect(conversion).toBe(0.00061275)
    });

    it('0.0006127 BTC conversion with quote = 38005.00001 should be BRL 23.28566351', async () => {
      const sellAmount = await Transaction.convertMoney({
        type: 'BTC_TO_BRL',
        amount: 0.0006127,
        quote: 38005.00001,
      })

      expect(sellAmount).toBe(23.28566351)
    });
  });
})
