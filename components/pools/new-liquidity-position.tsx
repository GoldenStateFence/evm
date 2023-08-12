'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  useMediaQuery,
  Theme,
  Grid,
  FormControl,
  FormLabel,
  DialogTitle,
  Alert,
  TextField,
} from '@mui/material';
import { config } from '../config';
import SelectToken from './select-token';
import { FeeTier, Token } from '@/types/common';
import { useAccount, useContractRead } from 'wagmi';
import { toast } from 'react-toastify';
import SelectFeeTier from './select-fee-tier';
import { usePoolFactory } from '@/hooks/swap-protocol-hooks';
import { uniswapV3FactoryABI } from '@/types/wagmi/uniswap-v3-core';
import { zeroAddress } from 'viem';
import StartingPrice from './starting-price';
import SetPriceRange from './set-price-range';
import DepositAmounts from './deposit-amounts';

const NewLiquidityPosition = () => {
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const isMdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  useEffect(() => {
    if (!isConnected) setOpen(false);
  }, [isConnected]);

  const handleOpen = () => {
    if (!isConnected) {
      toast('Please connect your wallet first', { type: 'error' });
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBackdropClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === 'backdropClick') return;
    handleClose();
  };

  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);
  const [feeTier, setFeeTier] = useState<FeeTier>(config.feeTiers[0]);
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);

  const poolFactoryAddress = usePoolFactory();

  const { data: pool } = useContractRead({
    address: poolFactoryAddress,
    abi: uniswapV3FactoryABI,
    functionName: 'getPool',
    args: [tokenA?.address ?? zeroAddress, tokenB?.address ?? zeroAddress, feeTier.value],
    enabled: tokenA !== null && tokenB !== null,
  });

  const hasInitializedPool = pool !== zeroAddress && pool !== undefined;

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpen}
      >
        Add Liquidity
      </Button>

      <Dialog
        open={open}
        onClose={handleBackdropClose}
        maxWidth="lg"
        fullWidth={!isMdAndUp}
        PaperProps={{
          variant: 'outlined',
        }}
      >
        <DialogTitle>
          <b>Add Liquidity</b>
        </DialogTitle>
        <DialogContent>
          <Stack direction={{ xs: 'column', md: 'row' }}
            spacing={2}
          >
            {/* start of column 1 in desktop layout */}
            <Stack
              direction="column"
              spacing={2}
              px={{ xs: 0, md: 2 }}
              py={{ xs: 0, md: 1 }}
              justifyContent="stretch"
              width="100%"
            >
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 2 }}>Select Asset Pair</FormLabel>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  width="100%"
                  justifyContent="stretch"
                >
                  <SelectToken
                    inputLabel="Pair Token A"
                    token={tokenA}
                    setToken={setTokenA}
                  />

                  <SelectToken
                    inputLabel="Pair Token B"
                    token={tokenB}
                    setToken={setTokenB}
                  />
                </Stack>
              </FormControl>

              <SelectFeeTier
                feeTier={feeTier}
                setFeeTier={setFeeTier}
              />

              {isMdAndUp && (
                <DepositAmounts
                  tokenA={tokenA}
                  tokenB={tokenB}
                  amountA={amountA}
                  setAmountA={setAmountA}
                  amountB={amountB}
                  setAmountB={setAmountB}
                />
              )}
            </Stack>
            {/* end of column 1 in desktop layout */}

            {/* start of column 2 in desktop layout */}
            <Stack
              direction="column"
              spacing={2}
              px={{ xs: 0, md: 2 }}
              py={{ xs: 0, md: 1 }}
              justifyContent="stretch"
              width="100%"
            >
              {!hasInitializedPool && tokenA && tokenB && (
                <StartingPrice
                  startingPrice={startingPrice}
                  setStartingPrice={setStartingPrice}
                  tokenA={tokenA}
                  tokenB={tokenB}
                />
              )}

              <SetPriceRange
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                tokenA={tokenA}
                tokenB={tokenB}
              />

              {!isMdAndUp && (
                <DepositAmounts
                  tokenA={tokenA}
                  tokenB={tokenB}
                  amountA={amountA}
                  setAmountA={setAmountA}
                  amountB={amountB}
                  setAmountB={setAmountB}
                />
              )}
            </Stack>
            {/* end of column 2 in desktop layout */}
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            mt={2}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Add</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewLiquidityPosition;
