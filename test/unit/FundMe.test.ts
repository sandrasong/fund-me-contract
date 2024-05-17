import { deployments, ethers, getNamedAccounts } from "hardhat"
import { assert, expect } from "chai"
import { FundMe, MockV3Aggregator } from "../../typechain-types"

describe.only("FundMe", async function () {
  let fundMe: FundMe
  let deployer: string
  let mockV3Aggregator: MockV3Aggregator
  const sendValue = ethers.parseEther("1")

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer
    // deploy our fundMe contract using hardhat-deploy
    await deployments.fixture(["all"])
    fundMe = await ethers.getContract("FundMe", deployer)
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
  })

  describe("constructor", async function () {
    it("set the aggregator address correctly", async function () {
      const response = await fundMe.getPriceFeed()
      assert.equal(response, mockV3Aggregator.target)
    })
  })

  describe("fund", async function () {
    it("fails if you don't send enough ETH", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      )
    })
    it("Updated the amount funded data structure", async () => {
      await fundMe.fund({ value: sendValue })
      const response = await fundMe.getAddressToAmountFunded(deployer)
      assert.equal(response.toString(), sendValue.toString())
    })
    it("Adds funder to array of funders", async () => {
      await fundMe.fund({ value: sendValue })
      const funder = await fundMe.getFunder(0)
      assert.equal(funder, deployer)
    })
  })

  describe("withdraw", async () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue })
    })

    it("Withdraw ETH from a single funder", async () => {
      const startingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      )
      const startingDeployerBalance = await ethers.provider.getBalance(deployer)

      const withdrawResponse = await fundMe.withdraw()
      const withdrawReceipt = await withdrawResponse.wait(1)
      const { gasUsed, gasPrice } = withdrawReceipt
      const gasCost = gasUsed * gasPrice

      const endingFundMeBalance = await ethers.provider.getBalance(
        fundMe.target
      )
      const endingDeployerBalance = await ethers.provider.getBalance(deployer)
      assert.equal(endingFundMeBalance, 0n)
      assert.equal(
        (startingFundMeBalance + startingDeployerBalance).toString(),
        (endingDeployerBalance + gasCost).toString()
      )
    })

    it("allows us to withdraw with multiple funders", async () => {
      // Arrange
      const accounts = await ethers.getSigners()
      for (let i = 2; i < 7; i++) {
        const fundMeConnectContract = await fundMe.connect(accounts[i])
        await fundMeConnectContract.fund({ value: sendValue })
        const startingFundMeBalance = await ethers.provider.getBalance(
          fundMe.target
        )
        const startingDeployerBalance = await ethers.provider.getBalance(
          deployer
        )

        // Act
        const withdrawMulResponse = await fundMe.withdraw()
        const withdrawMulReceipt = await withdrawMulResponse.wait(1)
        const { gasUsed, gasPrice } = withdrawMulReceipt
        const gasCost = gasUsed * gasPrice

        // Assert
        const endingFundMeBalance = await ethers.provider.getBalance(
          fundMe.target
        )
        const endingDeployerBalance = await ethers.provider.getBalance(deployer)
        assert.equal(endingFundMeBalance, 0n)
        assert.equal(
          (startingFundMeBalance + startingDeployerBalance).toString(),
          (endingDeployerBalance + gasCost).toString()
        )

        // Make sure funders[] are reset properly
        await expect(fundMe.getFunder(0)).to.be.reverted
        for (i = 2; i < 7; i++) {
          assert.equal(
            await fundMe.getAddressToAmountFunded(accounts[i].address),
            0n
          )
        }
      }
    })

    it("Only allows the owner to withdraw", async () => {
      const accounts = await ethers.getSigners()
      const attacker = accounts[2] // deployer is accounts[1]
      const attackerConnectedContract = await fundMe.connect(attacker)
      await expect(attackerConnectedContract.withdraw()).to.be.rejectedWith(
        "FundMe__NotOwner"
      )
    })

    it("cheaper withdraw with multiple funders", async () => {
      // Arrange
      const accounts = await ethers.getSigners()
      for (let i = 2; i < 7; i++) {
        const fundMeConnectContract = await fundMe.connect(accounts[i])
        await fundMeConnectContract.fund({ value: sendValue })
        const startingFundMeBalance = await ethers.provider.getBalance(
          fundMe.target
        )
        const startingDeployerBalance = await ethers.provider.getBalance(
          deployer
        )

        // Act
        const withdrawMulResponse = await fundMe.cheaperWithdraw()
        const withdrawMulReceipt = await withdrawMulResponse.wait(1)
        const { gasUsed, gasPrice } = withdrawMulReceipt
        const gasCost = gasUsed * gasPrice

        // Assert
        const endingFundMeBalance = await ethers.provider.getBalance(
          fundMe.target
        )
        const endingDeployerBalance = await ethers.provider.getBalance(deployer)
        assert.equal(endingFundMeBalance, 0n)
        assert.equal(
          (startingFundMeBalance + startingDeployerBalance).toString(),
          (endingDeployerBalance + gasCost).toString()
        )

        // Make sure funders[] are reset properly
        await expect(fundMe.getFunder(0)).to.be.reverted
        for (i = 2; i < 7; i++) {
          assert.equal(
            await fundMe.getAddressToAmountFunded(accounts[i].address),
            0n
          )
        }
      }
    })
  })
})
