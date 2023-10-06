import React from 'react';
import './App.css';
import { useState, useCallback, useEffect } from 'react';
import { ChainName, Network, relayer } from '@certusone/wormhole-sdk';
import { MenuItem, Select, TextField, Grid, Button, Box, Typography} from '@mui/material';
import { ethers } from 'ethers';


type Environment = {label: string, value: Network};

const environments: Environment[] = [{label: 'Testnet', value: 'TESTNET'}]
// const environments: Environment[] = [{label: 'Mainnet', value: 'MAINNET'}, {label: 'Testnet', value: 'TESTNET'}]

const getChainInfo = (environment: Environment, targetChain: ChainName) => {
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

function App() {
  const [disabled, setDisabled] = useState<boolean>(false);

  const [environmentInput, setEnvironmentInput] = useState<Environment>(environments[0]);
  const [chainInput, setChainInput] = useState<ChainName | undefined>(undefined);
  const [txHashInput, setTxHashInput] = useState<string>("");

  const [environment, setEnvironment] = useState<Environment>(environments[0]);
  const [chain, setChain] = useState<ChainName | undefined>(undefined);
  const [txHash, setTxHash] = useState<string>("");

  const [result, setResult] = useState<string>("");
  const [manualDeliveryText, setManualDeliveryText] = useState<string>("");
  const [targetChain, setTargetChain] = useState<ChainName | undefined>(undefined);


  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
  const setChainToBeCorrectForManualDelivery = useCallback(async () => {
    if(!targetChain) return;

    const myChainInfo = getChainInfo(environment, targetChain);
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [myChainInfo]
    });
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{chainId: myChainInfo.chainId}]
    });
  }, [targetChain, environment])
  
  useEffect(() => {
    if(!window.ethereum) return;
    const newProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
    setProvider(newProvider);
  }, [window.ethereum])

  const updateSigner = useCallback(async (): Promise<ethers.Signer | undefined> => {
    if(!provider) return;
    await provider.send("eth_requestAccounts", []);
    const newSigner = provider.getSigner();
    setSigner(newSigner);
    return newSigner;
  }, [provider])

  const modifyTxHash = useCallback(() => {
    let actualValue = txHashInput.trim();
    if(actualValue.substring(0, 2) !== '0x') actualValue = '0x' + actualValue;
    actualValue = actualValue.substring(66);
    setTxHashInput(actualValue);
  }, [txHashInput])
  const submitQuery = useCallback(async () => {
    setDisabled(true);
    modifyTxHash();

    setEnvironment(environmentInput);
    setTxHash(txHashInput);
    setChain(chainInput);
    try {
      const result = await relayer.getWormholeRelayerInfo(chainInput as ChainName, txHashInput, {environment: environmentInput.value as Network});
      setResult(result.stringified || "");
      const manualDeliveryInfo = await relayer.manualDelivery(chainInput as ChainName, txHashInput, {environment: environmentInput.value as Network}, true);
      setManualDeliveryText(`Manual deliver on ${manualDeliveryInfo.targetChain} using ${ethers.utils.formatEther(manualDeliveryInfo.quote)} ${manualDeliveryInfo.targetChain} currency`)
      setTargetChain(manualDeliveryInfo.targetChain);
      setDisabled(false)
    } catch (e) {
      setResult(`An error occured when querying status: ${e}`)
      setTargetChain(undefined);
      setDisabled(false)
    }
  }, [environmentInput, chainInput, txHashInput])
  const manualDelivery = useCallback(async () => {
    setDisabled(true);
    if(!provider) return;
    const mySigner = await updateSigner();
    await setChainToBeCorrectForManualDelivery();
    try {
      const manualDeliveryInfo = await relayer.manualDelivery(chain as ChainName, txHash, {environment: environment.value as Network}, false, undefined, mySigner);
      const blockScanLink = getChainInfo(environment, manualDeliveryInfo.targetChain).blockExplorerUrls[0] + `tx/${manualDeliveryInfo.txHash}`
      setResult(`Manual delivery for transaction ${txHash} on chain ${chain}, ${environment.label} done\n\nDestination transaction: ${blockScanLink}`)
      setDisabled(false)
    } catch (e) {
      setResult(`An error occured when manually delivering: ${e}`)
      setDisabled(false)
    }
  }, [targetChain, environment, chain, txHash])
  return (
    <div className="App">
      <header className="App-header">
          <Grid direction="row">
          <Select value={environmentInput.value} disabled={disabled} label="Environment" onChange={(event) => {setEnvironmentInput(environments.find((e)=>(e.value === event.target.value))!)}}>
            {environments.map((myEnvironment) => <MenuItem value={myEnvironment.value}>{myEnvironment.label}</MenuItem>)}
          </Select>
          <Select value={chainInput} disabled={disabled} label="Source chain" onChange={(event) => {setChainInput(event.target.value as ChainName)}}>
            {['ethereum', 'bsc', 'polygon', 'avalanche', 'celo', 'moonbeam', 'arbitrum', 'optimism', 'base'].map((chain) => <MenuItem value={chain}>{chain}</MenuItem>)}
          </Select>
          <TextField
            id="outlined-controlled"
            label="Transaction Hash"
            value={txHashInput}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTxHashInput(event.target.value);
            }}
            disabled={disabled}
            onKeyDown={async (event) => {
              if((event.key === 'Enter') && txHashInput && chainInput) {
                submitQuery();
              }
            }}
          />
          <Button variant="contained" onClick={submitQuery} sx={{height: '100%', marginLeft: "40px"}}> {"Submit"} </Button>
        </Grid>
       
        <Box sx={{whiteSpace: "break-spaces", textAlign: "left", width: "60vw", height: "60vh", overflow: "scroll", fontSize: "16px", marginTop: "32px", marginBottom: "32px"}}>
          {disabled ? 'Loading...' : <div>
          {result}
          {((targetChain !== undefined) && provider) && <Button variant="outlined" disabled={disabled} onClick={manualDelivery} sx={{marginTop: "32px"}}> {manualDeliveryText} </Button>}
          </div>}
        </Box>
        

  
      </header>
    </div>
  );
}

export default App;
