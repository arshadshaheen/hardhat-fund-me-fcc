const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const tadex = await ethers.getContract("TADEX");

    const balance = await tadex.balanceOf(deployer.address);
    console.log(`Deployer token balance: ${ethers.utils.formatUnits(balance, 6)} TADEX`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
