// import { HardhatUserConfig, task } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";

// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//     console.log((await account.getBalance()).toString());
//   }
// });


// const config: HardhatUserConfig = {
//   paths: { tests: "tests" },
//   networks: {hardhat: {hardfork: "merge"}},
//   solidity: {
//       version: "0.8.18",
//       settings: {
//         optimizer: {
//           enabled: false,
//           runs: 0,
//         },
//       },
//     }
// };

// export default config;

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()
//import "@openzeppelin/hardhat-upgrades"
import 'hardhat-gas-reporter';
import 'solidity-coverage';
//import "@nomiclabs/hardhat-ethers";

// const walletPrivateKey =  `${process.env.PRIVATE_KEY}`

const config: HardhatUserConfig = {
  // solidity: "0.8.0",
  paths: { tests: "tests" },
  solidity: {
    version: '0.8.17',
    settings: {
      evmVersion: process.env.EVM_VERSION || 'london',
      optimizer: {
        enabled: true,
        runs: 200,
        details: {
          peephole: true,
          inliner: true,
          jumpdestRemover: true,
          orderLiterals: true,
          deduplicate: true,
          cse: true,
          constantOptimizer: true,
          yul: true,
          yulDetails: {
            stackAllocation: true,
          },
        },
      },

    },

  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    filecoinCalibrationNet: {
      url: "https://filecoin-calibration.chainstacklabs.com/rpc/v1",
      chainId: 314159,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    filecoinMainnet: {
      url: "https://api.node.glif.io", //'https://rpc.ankr.com/filecoin_testnet', //https://filecoin-hyperspace.chainstacklabs.com/rpc/v1
      chainId: 314,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    mumbai: {
      url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
      chainId: 80001,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    lilypad: {
      url: "http://testnet.lilypadnetwork.org:8545",
      chainId: 1337,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    arbitrumGoerli: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId:421613,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    aurora: {
      url: "https://testnet.aurora.dev",
      chainId: 1313161555,
      accounts: [`${process.env.PRIVATE_KEY}`],
    }
  },
  typechain: {
    target: "ethers-v5"
  },

};

export default config;