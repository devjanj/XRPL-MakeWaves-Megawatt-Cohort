const xrpl = require('xrpl')

const TESTNET_URL = 'wss://s.altnet.rippletest.net:51233'
const CURRENCY_CODE = 'MWM'
const SOURCE_TAG = 2606190003

async function main() {
  const client = new xrpl.Client(TESTNET_URL)
  await client.connect()
  console.log('Connected to XRPL Testnet')

  const issuer = xrpl.Wallet.fromSeed('sEd7kFu36bDadFsvecpPFHmM9r2iJPd')
  await client.fundWallet(issuer)
  console.log('Issuer:', issuer.address)

  const ammResult = await client.submitAndWait(
    {
      TransactionType: 'AMMCreate',
      Account: issuer.address,
      Amount: { currency: CURRENCY_CODE, issuer: issuer.address, value: '100' },
      Amount2: xrpl.xrpToDrops('10'),
      TradingFee: 500,
      SourceTag: SOURCE_TAG,
    },
    { wallet: issuer },
  )
  console.log('AMMCreate:', ammResult.result.meta.TransactionResult)
  console.log('AMMCreate hash:', ammResult.result.hash)
  console.log('AMMCreate URL:', `https://testnet.xrpl.org/transactions/${ammResult.result.hash}`)

  const info = await client.request({
    command: 'amm_info',
    asset: { currency: CURRENCY_CODE, issuer: issuer.address },
    asset2: { currency: 'XRP' },
  })
  console.log('\n--- AMM Info ---')
  console.log(JSON.stringify(info.result.amm, null, 2))

  await client.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
