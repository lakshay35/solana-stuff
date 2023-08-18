import { Connection, clusterApiUrl } from "@solana/web3.js";

export const getConnection = (dev?: boolean) => {
  // Connection to mainnet using RPC Url
  const endpoint = dev
    ? clusterApiUrl("devnet")
    : process.env.SOLANA_RPC_URL || "";

  if (!endpoint) {
    console.error(
      `${dev ? "$SOLANA_DEV_RPC_URL" : "$SOLANA_RPC_URL"} NOT FOUND!`
    );
    process.exit(1);
  }

  return new Connection(endpoint);
};
