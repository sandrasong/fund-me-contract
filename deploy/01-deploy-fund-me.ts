import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { network } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  const ethUsdPriceFeedAddress =
    networkConfig[chainId as keyof object]["ethUsdPriceFeedAddress"]

  // Deploy mock for local testing

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [],
    log: true,
  })
}

export default func
func.tags = ["FundMe", "all"]
