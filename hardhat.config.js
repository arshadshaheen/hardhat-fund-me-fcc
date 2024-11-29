require("hardhat-gas-reporter")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");




// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const SEPOLIA_RPC_URL =    process.env.SEPOLIA_RPC_URL ;
const PRIVATE_KEY =    process.env.PRIVATE_KEY ;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ;
const ETH_USD_PRICE_FEED = process.env.ETH_USD_PRICE_FEED ;

/** const gasPrice = await ethers.provider.getGasPrice();
console.log(`Current gas price: ${gasPrice.toString()}`);
*/
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
console.log("SEPOLIA_RPC_URL:", process.env.SEPOLIA_RPC_URL);
console.log("COINMARKETCAP_API_KEY:", process.env.COINMARKETCAP_API_KEY);
console.log("ETHERSCAN_API_KEY:", process.env.ETHERSCAN_API_KEY);
console.log("ETH_USD_PRICE_FEED:", process.env.ETH_USD_PRICE_FEED);
console.log("MY_ADDRESS:", process.env.MY_ADDRESS);
console.log("CONTRACT_ADDRESS:", process.env.CONTRACT_ADDRESS);

module.exports = {
    defaultNetwork: "sepolia",
    networks: {
        hardhat: {
            chainId: 31337,
            gasPrice: 130000000000,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
            chainId: 11155111,
            blockConfirmations: 6,
            gasPrice: 14050609292, // 20 Gwei (common for Sepolia)
            gas: 5000000,          // Limit gas to 3 million units (adjust as needed)
        },
    },
    solidity: {
        compilers: [
            { version: "0.6.6" },  // Add other versions as needed
            { version: "0.8.20" }, // Replace with the main version of your contracts
          ],
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
        // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
    },
    mocha: {
        timeout: 500000,
    },
}
