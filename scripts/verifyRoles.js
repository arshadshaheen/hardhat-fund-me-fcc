const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
    const { deployer } = await getNamedAccounts();

    // Get the signer object
    const deployerSigner = await ethers.getSigner(deployer);

    // Get the deployed contract
    const dextianDeployment = await deployments.get("DEXTN");
    const dextian = await ethers.getContractAt(
        "DEXTN",
        dextianDeployment.address,
        deployerSigner
    );

    // Verify roles
    const predicateRole = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes("PREDICATE_ROLE")
    );
    const hasRole = await dextian.hasRole(
        predicateRole,
        "0x0997B7Ea8c8D31d311be8efc6d02d1bE7De2ceC7"
    );

    console.log(`Has PREDICATE_ROLE: ${hasRole}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
