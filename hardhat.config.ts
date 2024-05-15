import { HardhatUserConfig, task } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()
  for (const account of accounts) {
    const balance = await hre.ethers.provider.getBalance(account)
    console.log(`${account.address} | balance: ${balance}`)
  }
})

const config: HardhatUserConfig = {
  solidity: "0.8.8",
}

export default config
