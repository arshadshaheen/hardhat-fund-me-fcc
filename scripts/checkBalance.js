const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const dextian = await ethers.getContract("DEXTN");

    const balance = await dextian.balanceOf(deployer.address);
    console.log(`Deployer token balance: ${ethers.utils.formatUnits(balance, 6)} DEXTN`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
