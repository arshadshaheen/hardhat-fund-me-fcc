const { ethers, getNamedAccounts } = require("hardhat")

async function main() {

  const CONTRACT_ADDRESS = process.env.DEPLOYER_ADDRESS; // Address for deployed contract
  const Dextian = await ethers.getContractFactory("DEXTIAN");
  const dextian = Dextian.attach(CONTRACT_ADDRESS);

  console.log(`Got contract dextian at ${dextian.address}`)
  console.log("Withdrawing from contract...")
  
  const transactionResponse = await dextian.withdraw()
  await transactionResponse.wait()
  console.log("Got it back!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
