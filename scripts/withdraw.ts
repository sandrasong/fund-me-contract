import { ethers, getNamedAccounts } from "hardhat"
import { FundMe } from "../typechain-types"

const main = async () => {
  const { deployer } = await getNamedAccounts()
  const fundMe: FundMe = await ethers.getContract("FundMe", deployer)
  console.log("Withdrawing...")
  const fundMeResponse = await fundMe.cheaperWithdraw()
  await fundMeResponse.wait(1)
  console.log("Got it back!")
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
