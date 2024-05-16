const networkConfig: object = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeedAddress: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    blockConfirmations: 5,
  },
  31337: {
    name: "localhost",
  },
}

const developmentChains = ["hardhat", "localhost"]

export { networkConfig, developmentChains }
