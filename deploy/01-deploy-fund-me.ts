import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { network, getNamedAccounts, deployments } from "hardhat"
import { networkConfig, developmentChains } from "../helper-hardhat-config"

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let ethUsdPriceFeedAddress
  if (developmentChains.includes(network.name)) {
    // Deploy mock for local testing
    const ethUsdAggregator = await get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress =
      networkConfig[chainId as keyof object]["ethUsdPriceFeedAddress"]
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations:
      networkConfig[chainId as keyof object]["blockConfirmations"] || 1,
  })
  log("--------------------------")
}

export default func
func.tags = ["FundMe", "all"]
