import { ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../../helper-hardhat-config"
import { FundMe } from "../../typechain-types"
import { assert, expect } from "chai"

developmentChains.includes(network.name)
  ? describe.skip
  : describe.only("FundMe", async () => {
      let fundMe: FundMe
      let deployer
      const sendValue = ethers.parseEther("0.1")

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
      })

      it("allows people to fund and withdraw", async () => {
        await fundMe.fund({ value: sendValue })
        await fundMe.withdraw()
        const endingBalance = await ethers.provider.getBalance(fundMe.target)
        assert.equal(endingBalance.toString(), "0")
      })
    })
