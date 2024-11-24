const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    const tadex = await ethers.getContract("TADEX");

    const mintAmount = ethers.utils.parseUnits("1000", 6); // Mint 1000 tokens
    console.log(`Minting ${mintAmount} tokens to deployer: ${deployer.address}`);

    const tx = await tadex.mint(deployer.address, mintAmount);
    await tx.wait();

    console.log(`Successfully minted tokens to: ${deployer.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
