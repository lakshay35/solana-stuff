import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
  useWalletModal,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { NextPage } from "next";
import ClassForm from "../components/ClassForm";
import { Balance } from "../components/balance";

import styles from "../styles/Home.module.css";
import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const Test: NextPage = () => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(
    () => clusterApiUrl(WalletAdapterNetwork.Devnet),
    [network]
  );
  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/solana-labs/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new PhantomWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <WalletMultiButton />
              <WalletDisconnectButton />
              <Balance />

              <ClassForm />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </header>
    </div>
  );
};

export default Test;
