import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const FundMeModule = buildModule("FundMeModule", (m) => {
  const priceFeedAddress = m.getParameter("priceFeedAddress")

  const fundMe = m.contract("FundMe", [priceFeedAddress])

  return { fundMe }
})

export default FundMeModule
