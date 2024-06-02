import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { Unity, useUnityContext } from "react-unity-webgl";
import React, { useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { abi } from "../abi/abi";
import { MintNFT } from '../components/mint-nft'

const config = getDefaultConfig({
  appName: "BlockWhaler App",
  projectId: "20240602",
  chains: [
    sepolia,
    mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const { unityProvider, sendMessage, addEventListener, removeEventListener } =
    useUnityContext({
      loaderUrl: "UnityBuild/webgl_app.loader.js",
      dataUrl: "UnityBuild/webgl_app.data",
      frameworkUrl: "UnityBuild/webgl_app.framework.js",
      codeUrl: "UnityBuild/webgl_app.wasm",
    });

  const handleShot = useCallback(
    () => {
      console.log("Shot");
    },
    [sendMessage]
  );
  
  useEffect(() => {
    addEventListener("MoveCallback", handleShot);
    return () => {
      removeEventListener("MoveCallback", handleShot);
    };
  }, [addEventListener, removeEventListener, handleShot]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <ConnectButton />
          <MintNFT />
          <Component {...pageProps} />
          <Unity
            unityProvider={unityProvider}
            style={{
              height: "100%",
              width: 1000,
              border: "2px solid black",
              background: "grey",
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
