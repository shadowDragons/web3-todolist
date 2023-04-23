const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("Todo");
  const token = await Contract.deploy();

  await token.deployed();

  console.log("deploy success:", token.address);
}

// 运行脚本
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});