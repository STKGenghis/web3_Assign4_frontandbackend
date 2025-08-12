import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

/**
 * Hook for detecting if the app is connected to Lisk Sepolia network
 * @returns isLisk - boolean indicating if connected to Lisk Sepolia
 * @returns liskNotice - function to show notification if not on Lisk Sepolia
 */
export const useLiskNetwork = () => {
  const { chain } = useNetwork();
  const [isLisk, setIsLisk] = useState(false);

  useEffect(() => {
    // Lisk Sepolia chain ID is 4202
    setIsLisk(chain?.id === 4202);
  }, [chain]);

  const liskNotice = () => {
    if (!isLisk) {
      notification.warning("Please switch to Lisk Sepolia network to interact with BaseFlow");
    }
  };

  return { isLisk, liskNotice };
};

/**
 * Helper function to format currency values
 * @param value - BigInt or number to format
 * @param decimals - number of decimals (default: 6 for USDC)
 * @returns formatted string with currency symbol
 */
export const formatCurrency = (value: bigint | number | undefined, decimals = 6, symbol = "USDC") => {
  if (value === undefined) return `0 ${symbol}`;
  
  const num = typeof value === "bigint" 
    ? Number(value) / Math.pow(10, decimals)
    : Number(value) / Math.pow(10, decimals);
  
  return `${num.toFixed(2)} ${symbol}`;
};

/**
 * Shortens an Ethereum address to a more readable format
 * @param address - The address to shorten
 * @param chars - Number of characters to display at start and end
 * @returns shortened address string
 */
export const shortenAddress = (address: string | undefined, chars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};
