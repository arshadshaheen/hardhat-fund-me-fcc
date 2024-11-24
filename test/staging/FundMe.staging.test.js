const { assert } = require("chai");
const { network, ethers, deployments, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
    ? describe.skip // Skip on local development chains
    : describe("FundMe Staging Tests", function () {
          let deployer;
          let fundMe;
          const sendValue = ethers.utils.parseEther("0.1"); // 0.1 ETH

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;

              // Use Hardhat's deployments fixture to fetch the deployed contract
              await deployments.fixture(["all"]); // Ensure all deployments are up to date
              fundMe = await ethers.getContractAt(
                  "FundMe", 
                  (await deployments.get("FundMe")).address,
                  deployer
              );
          });

          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await fundMe.fund({ value: sendValue });
              await fundTxResponse.wait(1);

              const withdrawTxResponse = await fundMe.withdraw();
              await withdrawTxResponse.wait(1);

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );

              console.log(
                  `${endingFundMeBalance.toString()} should equal 0, running assert equal...`
              );

              assert.equal(endingFundMeBalance.toString(), "0");
          });
      });
