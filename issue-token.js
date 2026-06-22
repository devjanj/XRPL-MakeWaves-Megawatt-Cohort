const xrpl = require('xrpl')

const TESTNET_URL = 'wss://s.altnet.rippletest.net:51233'
const CURRENCY_CODE = 'JAN'

async function main() {
  const client = new xrpl.Client(TESTNET_URL)
  await client.connect()
  console.log('Connected to XRPL Testnet')

  const issuer = xrpl.Wallet.fromSeed('sEd7kFu36bDadFsvecpPFHmM9r2iJPd')
  const { wallet: holder } = await client.fundWallet()

  console.log('Issuer:', issuer.address)
  console.log('Holder:', holder.address)

  const trustResult = await client.submitAndWait(
    {
      TransactionType: 'TrustSet',
      Account: holder.address,
      LimitAmount: {
        currency: CURRENCY_CODE,
        issuer: issuer.address,
        value: '1000000',
      },
    },
    { wallet: holder },
  )
  console.log('TrustSet:', trustResult.result.meta.TransactionResult)
  console.log('TrustSet hash:', trustResult.result.hash)
  console.log('TrustSet URL:', `https://testnet.xrpl.org/transactions/${trustResult.result.hash}`)

  const payResult = await client.submitAndWait(
    {
      TransactionType: 'Payment',
      Account: issuer.address,
      Destination: holder.address,
      Amount: {
        currency: CURRENCY_CODE,
        issuer: issuer.address,
        value: '500',
      },
    },
    { wallet: issuer },
  )
  console.log('Payment: ', payResult.result.meta.TransactionResult)
  console.log('Payment hash:', payResult.result.hash)
  console.log('Payment URL:', `https://testnet.xrpl.org/transactions/${payResult.result.hash}`)
  console.log('Issuer account:', `https://testnet.xrpl.org/accounts/${issuer.address}`)

  await client.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
