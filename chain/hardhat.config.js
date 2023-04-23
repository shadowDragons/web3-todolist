require("@nomicfoundation/hardhat-toolbox");

// 申请alchemy的api key
const ALCHEMY_API_KEY = "6J2kR46lvsRpHX-jQ-ZjYTToDm7x-j56";

//将此私钥替换为测试账号私钥
//从Metamask导出您的私钥，打开Metamask和进入“帐户详细信息”>导出私钥
//注意:永远不要把真正的以太放入测试帐户
const GOERLI_PRIVATE_KEY = "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "../webapp/src/contract-build/"
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: "PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8",
  },
};
