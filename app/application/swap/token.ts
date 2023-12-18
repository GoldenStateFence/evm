import { useState } from 'react';
import { Token } from '@/types/common';

type UseTokenManagerProps = {
  tokenA: Token | null;
  tokenB: Token | null;
  setTokenA: (token: Token | null) => void;
  setTokenB: (token: Token | null) => void;
};

/**
 * @description Token manager hook
 * @returns {UseTokenManagerProps} Token manager
 * @example
 * const { tokenA, tokenB, setTokenA, setTokenB } = useTokenManager();
 * setTokenA(token);
 * setTokenB(token);
 * setTokenA(null);
 * setTokenB(null);
 * let something = tokenA;
 * let something = tokenB;
 */
export function useTokenManager() {
  const [tokenA, setTokenAState] = useState<Token | null>(null);
  const [tokenB, setTokenBState] = useState<Token | null>(null);

  /**
   * @description Set tokenA making sure that it is not the same as tokenB
   * @param {Token | null} token - Set token A's value
   * @returns {void}
   */
  const setTokenA = (token: Token | null) => {
    if (tokenB !== token) {
      setTokenAState(token);
    } else {
      setTokenAState(null);
      setTokenBState(token);
    }
  };

  /**
   * @description Set tokenB making sure that it is not the same as tokenA
   * @param {Token | null} token - Set token B's value
   * @returns {void}
   */
  const setTokenB = (token: Token | null) => {
    if (tokenA !== token) {
      setTokenBState(token);
    } else {
      setTokenBState(null);
      setTokenAState(token);
    }
  };

  return { tokenA, tokenB, setTokenA, setTokenB };
}