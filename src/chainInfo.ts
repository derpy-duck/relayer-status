import { ChainName, Network, relayer } from '@certusone/wormhole-sdk';
import { BigNumber } from 'ethers';

export type Environment = {label: string, value: Network};

export type ManualDeliveryResult = { quote: BigNumber; targetChain: ChainName; txHash?: string };

export const environments: Environment[] = [{label: 'Testnet', value: 'TESTNET'}]
// const environments: Environment[] = [{label: 'Mainnet', value: 'MAINNET'}, {label: 'Testnet', value: 'TESTNET'}]

export const getChainInfo = (environment: Environment, targetChain: ChainName) => {
  if (!targetChain) {
    throw new Error('This should not happen');
  }

  if (environment.label === 'Mainnet') {
    if (targetChain === 'ethereum') {
      return {
        chainId: "0x1",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://etherscan.io/"],
      };
    } else if (targetChain === 'bsc') {
      return {
        chainId: "0x38",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Binance Smart Chain",
        nativeCurrency: {
          name: "Binance Coin",
          symbol: "BNB",
          decimals: 18,
        },
        blockExplorerUrls: ["https://bscscan.com/"],
      };
    } else if (targetChain === 'polygon') {
      return {
        chainId: "0x89",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Polygon Mainnet",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com/"],
      };
    } else if (targetChain === 'avalanche') {
      return {
        chainId: "0xa86a",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Avalanche Mainnet",
        nativeCurrency: {
          name: "AVAX",
          symbol: "AVAX",
          decimals: 18,
        },
        blockExplorerUrls: ["https://explorer.avax.network/"],
      };
    } else if (targetChain === 'celo') {
      return {
        chainId: "0xa4ec",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Celo Mainnet",
        nativeCurrency: {
          name: "Celo Dollar",
          symbol: "cUSD",
          decimals: 18,
        },
        blockExplorerUrls: ["https://explorer.celo.org/"],
      };
    } else if (targetChain === 'moonbeam') {
      return {
        chainId: "0x504",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Moonbeam Mainnet",
        nativeCurrency: {
          name: "Moonbeam Token",
          symbol: "MOON",
          decimals: 18,
        },
        blockExplorerUrls: ["https://moonscan.io"],
      };
    } else if (targetChain === 'arbitrum') {
      return {
        chainId: "0xa4b1",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Arbitrum Mainnet",
        nativeCurrency: {
          name: "Arbitrum Ether",
          symbol: "AETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://arbiscan.io"],
      };
    } else if (targetChain === 'optimism') {
      return {
        chainId: "0xa",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Optimism Mainnet",
        nativeCurrency: {
          name: "Optimism Ether",
          symbol: "OETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://optimistic.etherscan.io"],
      };
    } else if (targetChain === 'base') {
      return {
        chainId: "0x2105",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Base Mainnet",
        nativeCurrency: {
          name: "Base Token",
          symbol: "BASE",
          decimals: 18,
        },
        blockExplorerUrls: ["https://basescan.org"],
      };
    } else {
      throw new Error('Invalid target chain');
    }
  } else if (environment.label === 'Testnet') {
    if (targetChain === 'ethereum') {
      return {
        chainId: "0x5",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Ethereum Testnet",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://goerli.etherscan.io/"],
      };
    } else if (targetChain === 'bsc') {
      return {
        chainId: "0x61",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "BSC Testnet",
        nativeCurrency: {
          name: "Binance Coin",
          symbol: "BNB",
          decimals: 18,
        },
        blockExplorerUrls: ["https://testnet.bscscan.com/"],
      };
    } else if (targetChain === 'polygon') {
      return {
        chainId: "0x13881",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Polygon Testnet",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://mumbai.polygonscan.com"],
      };
    } else if (targetChain === 'avalanche') {
      return {
        chainId: "0xa869",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Avalanche Testnet",
        nativeCurrency: {
          name: "AVAX",
          symbol: "AVAX",
          decimals: 18,
        },
        blockExplorerUrls: ["https://testnet.snowtrace.io/"],
      };
    } else if (targetChain === 'celo') {
      return {
        chainId: "0xaef3",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Celo Testnet",
        nativeCurrency: {
          name: "Celo Dollar",
          symbol: "cUSD",
          decimals: 18,
        },
        blockExplorerUrls: ["https://alfajores.celoscan.io/"],
      };
    } else if (targetChain === 'moonbeam') {
      return {
        chainId: "0x507",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Moonbeam Testnet",
        nativeCurrency: {
          name: "Moonbeam Token",
          symbol: "MOON",
          decimals: 18,
        },
        blockExplorerUrls: ["https://moonbase.moonscan.io/"],
      };
    } else if (targetChain === 'arbitrum') {
      return {
        chainId: "0x66eed",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Arbitrum Testnet",
        nativeCurrency: {
          name: "Arbitrum Ether",
          symbol: "AETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://testnet.arbiscan.io/"],
      };
    } else if (targetChain === 'optimism') {
      return {
        chainId: "0x1a4",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Optimism Testnet",
        nativeCurrency: {
          name: "Optimism Ether",
          symbol: "OETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://goerli-optimism.etherscan.io/"],
      };
    } else if (targetChain === 'base') {
      return {
        chainId: "0x14a33",
        rpcUrls: [relayer.RPCS_BY_CHAIN[environment.value][targetChain]],
        chainName: "Base Testnet",
        nativeCurrency: {
          name: "Base Token",
          symbol: "BASE",
          decimals: 18,
        },
        blockExplorerUrls: ["https://goerli.basescan.org/"],
      };
    } else {
      throw new Error('Invalid target chain');
    }
  } else {
    throw new Error('Invalid environment');
  }
};
