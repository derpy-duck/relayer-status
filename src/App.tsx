import React from 'react';
import './App.css';
import { useState, useCallback, useEffect } from 'react';
import { ChainName, Network, relayer} from '@certusone/wormhole-sdk';
import { MenuItem, Select, TextField, Grid, Button, Box, Typography, Checkbox} from '@mui/material';
import { ethers } from 'ethers';
import {Environment, environments, getChainInfo, ManualDeliveryResult } from "./chainInfo"

const modifyTxHash = (rawTxHash: string) => {
  let actualValue = rawTxHash.trim();
  if(actualValue.substring(0, 2) !== '0x') actualValue = '0x' + actualValue;
  actualValue = actualValue.substring(0, 66);
  return actualValue;
} 

const formatManualDeliveryPrompt = (manualDeliveryInfo: ManualDeliveryResult) => {
  return `Manually delivering on ${manualDeliveryInfo.targetChain} would cost ${ethers.utils.formatEther(manualDeliveryInfo.quote)} ${manualDeliveryInfo.targetChain} currency - Click 'Manual Delivery' to do this!`
}

const formatManualDeliveryResult = (manualDeliveryInfo: ManualDeliveryResult, txHash: string, chain: ChainName, environment: Environment) => {
  const blockScanLink = getChainInfo(environment, manualDeliveryInfo.targetChain).blockExplorerUrls[0] + `tx/${manualDeliveryInfo.txHash}`
  return (`Manual delivery for transaction ${txHash} on ${chain}, ${environment.label}\n\nDestination transaction: ${blockScanLink}`)
}


function App() {
  const [disabled, setDisabled] = useState<boolean>(false);

  const [environment, setEnvironment] = useState<Environment>(environments[0]);
  const [chain, setChain] = useState<ChainName | undefined>(undefined);
  const [txHash, setTxHash] = useState<string>("");
  const [nthRelayerVaa, setNthRelayerVaa] = useState<number>(0);
  const [destinationBlockNumber, setDestinationBlockNumber] = useState<number | undefined>(undefined);
  const [extraFields, setExtraFields] = useState<boolean>(false);

  const [statusResult, setStatusResult] = useState<relayer.DeliveryInfo | undefined>(undefined);
  const [manualDeliveryResult, setManualDeliveryResult] = useState<ManualDeliveryResult | undefined>(undefined);

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);

  const setTargetChainForManualDeliveryWallet = useCallback(async (targetChain: ChainName) => {
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
  }, [environment])
  
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

  const submitQuery = useCallback(async () => {
    setDisabled(true);
    const txHashForQuery = modifyTxHash(txHash);
    console.log(txHash + " " + txHashForQuery);
    setTxHash(txHashForQuery);
    setErrorMessage(undefined);
    setManualDeliveryResult(undefined);
    setStatusResult(undefined);
    try {
      console.log(`destination block nuimber: ${destinationBlockNumber} ${destinationBlockNumber ? [destinationBlockNumber, destinationBlockNumber] : undefined}`)
      const result = await relayer.getWormholeRelayerInfo(chain as ChainName, txHashForQuery, {environment: environment.value as Network, wormholeRelayerWhMessageIndex: nthRelayerVaa, targetBlockRange: destinationBlockNumber ? [destinationBlockNumber, destinationBlockNumber] : undefined});
      setStatusResult(result);

      try {
        const manualDeliveryInfo = await relayer.manualDelivery(chain as ChainName, txHashForQuery, {environment: environment.value as Network, wormholeRelayerWhMessageIndex: nthRelayerVaa, targetBlockRange: destinationBlockNumber ? [destinationBlockNumber, destinationBlockNumber] : undefined}, true);
        setManualDeliveryResult(manualDeliveryInfo);
      } catch {
        setManualDeliveryResult(undefined);
      }

      setErrorMessage(undefined);
      setDisabled(false)
    } catch (e) {
      setErrorMessage(`An error occured when querying status: ${e}`);
      setDisabled(false)
    }
  }, [environment, chain, txHash, nthRelayerVaa, destinationBlockNumber])

  const manualDelivery = useCallback(async () => {
    if(!provider) return;
    setDisabled(true);
    setErrorMessage(undefined);
    setManualDeliveryResult(undefined);
    setStatusResult(undefined);
    try {
      const manualDeliveryInfo = await relayer.manualDelivery(chain as ChainName, txHash, {environment: environment.value as Network, wormholeRelayerWhMessageIndex: nthRelayerVaa, targetBlockRange: destinationBlockNumber ? [destinationBlockNumber, destinationBlockNumber] : undefined}, true);
      setManualDeliveryResult(manualDeliveryInfo);
      const mySigner = await updateSigner();
      await setTargetChainForManualDeliveryWallet(manualDeliveryInfo.targetChain);
      const manualDeliveryResponse = await relayer.manualDelivery(chain as ChainName, txHash, {environment: environment.value as Network, wormholeRelayerWhMessageIndex: nthRelayerVaa, targetBlockRange: destinationBlockNumber ? [destinationBlockNumber, destinationBlockNumber] : undefined}, false, undefined, mySigner);
      setManualDeliveryResult(manualDeliveryResponse);
      setErrorMessage('');
      setDisabled(false)
    } catch (e) {
      console.log(`got an error: ${e}`)
      setErrorMessage(`An error occured when manually delivering: ${e}`)
      setDisabled(false)
    }
  }, [environment, chain, txHash, nthRelayerVaa, destinationBlockNumber])

  let resultString = '';
  if(statusResult) {
    resultString += statusResult.stringified;
    if(statusResult.targetChainStatus.chain === 'arbitrum' && !extraFields) {
      resultString += `\n\nThe destination chain is Arbitrum - for Arbitrum, you have to specify the 'destination block number' to see if the delivery has occured (click the checkbox above)`
    }
    resultString += `\n\n${(manualDeliveryResult && provider) ? (manualDeliveryResult.txHash && chain ? formatManualDeliveryResult(manualDeliveryResult, txHash, chain, environment) : (statusResult.targetChainStatus.events.length === 0) ? formatManualDeliveryPrompt(manualDeliveryResult) : '') : ''}`
  }
  console.log(`da error mesg: ${errorMessage}`)
  return (
    <div className="App">
      <header className="App-header">
          <Grid direction="row">
          <Select value={environment.value} disabled={disabled} label="Environment" onChange={(event) => {setEnvironment(environments.find((e)=>(e.value === event.target.value))!)}}>
            {environments.map((myEnvironment) => <MenuItem value={myEnvironment.value}>{myEnvironment.label}</MenuItem>)}
          </Select>
          <Select value={chain} disabled={disabled} label="Source chain" onChange={(event) => {setChain(event.target.value as ChainName)}}>
            {['ethereum', 'bsc', 'polygon', 'avalanche', 'celo', 'moonbeam', 'arbitrum', 'optimism', 'base'].map((chain) => <MenuItem value={chain}>{chain}</MenuItem>)}
          </Select>
          <TextField
            id="outlined-controlled"
            label="Transaction Hash"
            value={txHash}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTxHash(event.target.value);
            }}
            disabled={disabled}
            onKeyDown={async (event) => {
              if((event.key === 'Enter') && txHash && chain) {
                submitQuery();
              }
            }}
          />
          <Checkbox value={extraFields} onChange={(e) => {setExtraFields(e.target.checked); if(!e.target.checked) {setNthRelayerVaa(0); setDestinationBlockNumber(undefined)}}} />
          {extraFields && <TextField type="number" value={nthRelayerVaa} label={`Index of request in tx (0-indexed)`} disabled={disabled} onChange={(event) => {setNthRelayerVaa(parseInt(event.target.value))}} />}
          {extraFields && <TextField type="number" value={destinationBlockNumber} label="Destination Block Number" disabled={disabled} onChange={(event) => {setDestinationBlockNumber(parseInt(event.target.value))}} />}
          <Button variant="contained" onClick={submitQuery} sx={{height: '100%', marginLeft: "40px"}}> {"Get Status"} </Button>
          {provider && <Button variant="contained" onClick={manualDelivery} sx={{height: '100%', marginLeft: "20px"}}> {"Manual Delivery"} </Button>}
        </Grid>
       
        {<Box sx={{whiteSpace: "break-spaces", textAlign: "left", width: "60vw", height: "60vh", overflow: "scroll", fontSize: "16px", marginTop: "32px", marginBottom: "32px"}}>
          {(disabled) ? 'Loading...' : <div>
            {errorMessage ? errorMessage : resultString}
          </div>}
        </Box>}
        

  
      </header>
    </div>
  );
}

export default App;
