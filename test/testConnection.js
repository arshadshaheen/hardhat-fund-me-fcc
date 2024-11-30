async function main() {
    const { deployer } = await getNamedAccounts();
    console.log("Deployer Address:", deployer);

    const balance = await ethers.provider.getBalance(deployer); // Use provider for balance
    console.log("Deployer Balance:", ethers.formatEther(balance), "ETH");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
