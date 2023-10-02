import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState, useCallback } from 'react';
import { ChainName, Network, relayer } from '@certusone/wormhole-sdk';
import { MenuItem, Select, TextField, Grid, Button, Box, Typography} from '@mui/material';
type Environment = {label: string, value: Network};
const environments: Environment[] = [{label: 'Mainnet', value: 'MAINNET'}, {label: 'Testnet', value: 'TESTNET'}]
function App() {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [environment, setEnvironment] = useState<Environment>(environments[0]);
  const [chain, setChain] = useState<ChainName | undefined>(undefined);
  const [txHash, setTxHash] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const modifyTxHash = useCallback(() => {
    let actualValue = txHash;
    if(actualValue.substring(0, 2) !== '0x') actualValue = '0x' + actualValue;
    actualValue = actualValue.substring(66);
    setTxHash(actualValue);
  }, [txHash])
  const submitQuery = useCallback(async () => {
    setDisabled(true);
    modifyTxHash();
    try {
      const result = await relayer.getWormholeRelayerInfo(chain as ChainName, txHash, {environment: environment.value as Network});
      setResult(result.stringified || "");
      setDisabled(false)
    } catch (e) {
      setResult(`An error occured when querying status: ${e}`)
      setDisabled(false)
    }
  }, [environment, chain, txHash])
  return (
    <div className="App">
      <header className="App-header">
          <Grid direction="row">
          <Select value={environment.value} label="Environment" onChange={(event) => {setEnvironment(environments.find((e)=>(e.value === event.target.value))!)}}>
            {environments.map((environment) => <MenuItem value={environment.value}>{environment.label}</MenuItem>)}
          </Select>
          <Select value={chain} label="Source chain" onChange={(event) => {setChain(event.target.value as ChainName)}}>
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
          <Button variant="contained" onClick={submitQuery} sx={{height: '100%', marginLeft: "40px"}}> {"Submit"} </Button>
        </Grid>
       
        <Box sx={{whiteSpace: "break-spaces", textAlign: "left", width: "60vw", height: "70vh", overflow: "scroll", fontSize: "16px", marginTop: "32px"}}>
          {result}
        </Box>
  
      </header>
    </div>
  );
}

export default App;
