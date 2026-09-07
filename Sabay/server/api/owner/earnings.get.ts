export default defineEventHandler((event) => {
  const grossRevenue = 24850.00
  const platformFeePercentage = 0.15
  const netPayout = grossRevenue * (1 - platformFeePercentage)
  const pendingPayout = 3727.50

  return {
    currency: 'USD',
    grossRevenue,
    netPayout,
    pendingPayout,
    payoutHistory: [
      { id: 'PO-8821', date: '2026-08-01', method: 'Direct Bank Transfer (****4821)', gross: 8500.00, net: 7225.00, status: 'Completed' },
      { id: 'PO-7712', date: '2026-07-01', method: 'Direct Bank Transfer (****4821)', gross: 7800.00, net: 6630.00, status: 'Completed' },
      { id: 'PO-6603', date: '2026-06-01', method: 'Direct Bank Transfer (****4821)', gross: 8550.00, net: 7267.50, status: 'Completed' }
    ]
  }
})