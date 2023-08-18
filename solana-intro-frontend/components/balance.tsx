import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";

export const Balance = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) setBalance(info.lamports);
    });
  }, [connection, publicKey]);

  const sendSol = () => {
    const transaction = new Transaction();
    const recipientPubKey = new PublicKey(
      "AGfJtYcrSU2mqjyVw1wueA6kKjCh7jNqdztPEesGpqv4"
    );

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: publicKey || new PublicKey(""),
      toPubkey: recipientPubKey,
      lamports: LAMPORTS_PER_SOL * 0.001,
    });

    transaction.add(sendSolInstruction);

    sendTransaction(transaction, connection).then((sig) => {
      console.log(sig);
    });
  };

  return (
    <div style={{ marginTop: 50 }}>
      Hey there your balance is {(balance / LAMPORTS_PER_SOL).toFixed(5)} SOL
      <br />
      <button
        style={{ fontSize: 25, cursor: "pointer" }}
        onClick={() => sendSol()}
        disabled={!publicKey}
      >
        Send 0.001 Sol to our friend
      </button>
    </div>
  );
};
