import { HardhatUserConfig, task } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import "hardhat-deploy-ethers"
import "dotenv/config"

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()
  for (const account of accounts) {
    const balance = await hre.ethers.provider.getBalance(account)
    console.log(`${account.address} | balance: ${balance}`)
  }
})

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY as string

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.19" }, { version: "0.8.24" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
  },
  namedAccounts: {
    deployer: {
      default: 1,
      31337: 1,
      11155111: 0,
    },
    users: {
      default: 2,
    },
  },
}

export default config
