const xrpl = require('xrpl')

async function main() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await client.connect()

  const sender = xrpl.Wallet.fromSeed('sEd7kFu36bDadFsvecpPFHmM9r2iJPd')
  const recipient = xrpl.Wallet.generate()

  console.log('Sender:   ', sender.address)
  console.log('Recipient:', recipient.address)

  const prepared = await client.autofill({
    TransactionType: 'Payment',
    Account: sender.address,
    Amount: xrpl.xrpToDrops('1'),
    Destination: recipient.address,
    SourceTag: 2606190003,
  })
  const signed = sender.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)

  console.log('Result:   ', result.result.meta.TransactionResult)
  console.log('Tx hash:  ', signed.hash)
  console.log('Explorer: ', `https://testnet.xrpl.org/transactions/${signed.hash}`)

  await client.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
