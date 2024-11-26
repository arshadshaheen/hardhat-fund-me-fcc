const { ethers } = require("hardhat");

async function main() {
    // Replace with your deployed contract address
    const contractAddress = "0x0997B7Ea8c8D31d311be8efc6d02d1bE7De2ceC7";

    // Fetch the ABI
    const Dextian = await ethers.getContractFactory("DEXTN");
    const dextian = Dextian.attach(contractAddress);

    // Call functions
    const name = await dextian.name();
    const symbol = await dextian.symbol();
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);

    // Example: Query total supply
    const totalSupply = await dextian.totalSupply();
    console.log(`Total Supply: ${ethers.utils.formatUnits(totalSupply, 6)}`);

    // Example: Interact with mint (if PREDICATE_ROLE is set to your address)
    const [deployer] = await ethers.getSigners();
    const mintAmount = ethers.utils.parseUnits("100000", 6); // Mint 1000 tokens
    const mintTx = await dextian.mint(deployer.address, mintAmount);
    await mintTx.wait();

    console.log(`Minted 1000 DEXTN to: ${deployer.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
