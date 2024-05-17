import { ethers, getNamedAccounts } from "hardhat"
import { FundMe } from "../typechain-types"

const main = async () => {
  const { deployer } = await getNamedAccounts()
  const fundMe: FundMe = await ethers.getContract("FundMe", deployer)
  const sendValue = ethers.parseEther("0.1")
  console.log("Funding contract...")
  const fundMeResponse = await fundMe.fund({ value: sendValue })
  await fundMeResponse.wait(1)
  console.log("Funded!")
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
