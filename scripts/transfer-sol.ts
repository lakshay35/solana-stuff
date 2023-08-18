import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { getConnection } from "../src/connection";
import base58 from "bs58";

// TODO: Fix this script. Error during signature verification

/**
 *
 * @returns Randomly generated keypair for the solana blockchain
 */
const getKeyPair = () => {
  return Keypair.generate();
};

/**
 *
 * @param privateKey
 * @returns keypair object generated using private key uint array
 */
const parseKeyPair = (privateKey: string) => {
  if (!privateKey) process.exit(1);
  return Keypair.fromSecretKey(base58.decode(privateKey));
};

(async () => {
  const transaction = new Transaction();

  const connection = getConnection(true);

  // Create random keypair and request airdrop on devnet
  const randomKeyPair = Keypair.generate();
  await connection.requestAirdrop(
    randomKeyPair.publicKey,
    1 * LAMPORTS_PER_SOL
  );
  await new Promise((res) => setTimeout(() => res(0), 3000));

  // Generate keypair using private key
  const fromKeypair = parseKeyPair(process.env.SOLANA_WALLET_PRIVATE_KEY || "");

  // Generate keypair using base58 private key
  const destinationKeyPair = Keypair.fromSecretKey(
    base58.decode(
      "4BGF8xAomLXHQiPiEJudnbP3n1xeN5MMNxYTRJvZG2a7AGLt7jV1xu6EoTDDPfvQ2ZytJFwvw6XBwPjiYWpufufS"
    )
  );

  const sendSolTransaction = SystemProgram.transfer({
    fromPubkey: fromKeypair.publicKey,
    toPubkey: destinationKeyPair.publicKey,
    lamports: LAMPORTS_PER_SOL / 1000,
  });

  transaction.add(sendSolTransaction);

  transaction.add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: randomKeyPair.publicKey,
      lamports: LAMPORTS_PER_SOL / 1000,
    })
  );

  // keypairs that require signing need to be sent with the sendAndConfirmTransaction Function call
  const keypairs = [fromKeypair];

  console.log(
    await sendAndConfirmTransaction(connection, transaction, keypairs)
  );
})();
