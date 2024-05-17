# Fund me contract with Hardhat

This is a FCC web3 code camp project. It allows people to crowdfunding, and owner to withdraw the fund.

### Deploying the contract by:

```shell
npx hardhat deploy
```

### Deploying to localhost:
```shell
npx hardhat node
```
then, run command in another terminal window:
```shell
npx hardhat deploy --network localhost
```

### Deploying to Sepolia testnet:
```shell
npx hardhat deplopy --network sepolia
```
### Scripts
```shell
npx hardhat run scripts/fund.ts --network localhost
```
or
```shell
npx hardhat run scripts/withdraw.ts --network localhost
```
### Testing
Unit test
```shell
npm run test
```

Staging test on testnet
```shell
npm run test:staging
```