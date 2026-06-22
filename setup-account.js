const xrpl = require('xrpl')

const TESTNET_URL = 'wss://s.altnet.rippletest.net:51233'

async function main() {
  const client = new xrpl.Client(TESTNET_URL)
  await client.connect()
  console.log('Connected to XRPL Testnet')

  const issuer = xrpl.Wallet.fromSeed('sEd7kFu36bDadFsvecpPFHmM9r2iJPd')
  console.log('Issuer:', issuer.address)

  const result = await client.submitAndWait(
    {
      TransactionType: 'AccountSet',
      Account: issuer.address,
      SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple,
      SourceTag: 2606190003,
    },
    { wallet: issuer },
  )

  console.log('Result:', result.result.meta.TransactionResult)
  console.log('Hash:  ', result.result.hash)
  console.log('Tx URL:', `https://testnet.xrpl.org/transactions/${result.result.hash}`)
  console.log('Account:', `https://testnet.xrpl.org/accounts/${issuer.address}`)

  await client.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
