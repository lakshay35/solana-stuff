import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getConnection } from "../src/connection";

const getBalanceUsingWeb3 = (address: PublicKey): Promise<number> => {
  const connection = getConnection(true);
  return connection.getBalance(address);
};

(async () => {
  const publicKey = new PublicKey(
    process.env.SOLANA_WALLET_ADDRESS ||
      "7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp"
  );

  const lamportsBalance = await getBalanceUsingWeb3(publicKey);
  const solanaBalance = lamportsBalance / LAMPORTS_PER_SOL;

  console.log("%f SOL", solanaBalance.toFixed(5));
})();
