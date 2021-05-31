export default {
  baseCurrency: 'USD',
  supportedCurrencies: {
    USD: 'USD',
    ETH: 'ETH',
    BXC: 'BXC',
    BTC: 'BTC',
    XRP: 'XRP',
    LTC: 'LTC',
    USDT: 'USDT',
  },
  activeTokens: {
    ETH: 'ETH',
    BXC: 'BXC',
    BTC: 'BTC',
    LTC: 'LTC',
  },
  kycStatus: [
    { key: 'UNVERIFIED', value: 'UNVERIFIED', text: 'UNVERIFIED' },
    { key: 'PENDING', value: 'PENDING', text: 'PENDING' },
    { key: 'REJECTED', value: 'REJECTED', text: 'REJECTED' },
    { key: 'APPROVED', value: 'APPROVED', text: 'APPROVED' },
  ],
};
