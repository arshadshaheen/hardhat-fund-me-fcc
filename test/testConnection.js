const { ethers, getNamedAccounts } = require("hardhat");
async function main() {
    // Get the deployer address from named accounts
    const { deployer } = await getNamedAccounts();

    // Fetch the balance of the deployer
    const balance = await ethers.provider.getBalance(deployer);
    console.log(`Deployer Address: ${deployer}`);
    console.log(`Deployer Balance: ${ethers.utils.formatEther(balance)} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
