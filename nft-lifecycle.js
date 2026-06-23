const xrpl = require('xrpl')

const TESTNET_URL = 'wss://s.altnet.rippletest.net:51233'
const SOURCE_TAG = 2606190003

async function main() {
  const client = new xrpl.Client(TESTNET_URL)
  await client.connect()
  console.log('Connected to XRPL Testnet')

  const wallet = xrpl.Wallet.fromSeed('sEd7kFu36bDadFsvecpPFHmM9r2iJPd')
  console.log('Wallet:', wallet.address)

  const mintResult = await client.submitAndWait(
    {
      TransactionType: 'NFTokenMint',
      Account: wallet.address,
      NFTokenTaxon: 0,
      Flags: 8,
      TransferFee: 5000,
      URI: xrpl.convertStringToHex('ipfs://jan-megawatt-makewaves'),
      SourceTag: SOURCE_TAG,
    },
    { wallet },
  )
  console.log('Mint:    ', mintResult.result.meta.TransactionResult)
  console.log('Mint URL:', `https://testnet.xrpl.org/transactions/${mintResult.result.hash}`)

  const tokenId = mintResult.result.meta.nftoken_id
  console.log('NFTokenID:', tokenId)

  const nftsBefore = await client.request({
    command: 'account_nfts',
    account: wallet.address,
  })
  console.log('NFTs held:', nftsBefore.result.account_nfts.length)

  const burnResult = await client.submitAndWait(
    {
      TransactionType: 'NFTokenBurn',
      Account: wallet.address,
      NFTokenID: tokenId,
      SourceTag: SOURCE_TAG,
    },
    { wallet },
  )
  console.log('Burn:    ', burnResult.result.meta.TransactionResult)
  console.log('Burn URL:', `https://testnet.xrpl.org/transactions/${burnResult.result.hash}`)

  const nftsAfter = await client.request({
    command: 'account_nfts',
    account: wallet.address,
  })
  console.log('NFTs held after burn:', nftsAfter.result.account_nfts.length)

  await client.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
