const { ethers } = require("hardhat");

async function main() {
    // Replace with your deployed contract address
    const contractAddress = "0xb3212036815788FE65D8AbF2f4eC5e1405AAcA2A";

    // Fetch the ABI
    const Tadex = await ethers.getContractFactory("TADEX");
    const tadex = Tadex.attach(contractAddress);

    // Call functions
    const name = await tadex.name();
    const symbol = await tadex.symbol();
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);

    // Example: Query total supply
    const totalSupply = await tadex.totalSupply();
    console.log(`Total Supply: ${ethers.utils.formatUnits(totalSupply, 6)}`);

    // Example: Interact with mint (if PREDICATE_ROLE is set to your address)
    const [deployer] = await ethers.getSigners();
    const mintAmount = ethers.utils.parseUnits("100000", 6); // Mint 1000 tokens
    const mintTx = await tadex.mint(deployer.address, mintAmount);
    await mintTx.wait();

    console.log(`Minted 1000 TADEX to: ${deployer.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
