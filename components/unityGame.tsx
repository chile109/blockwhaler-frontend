import React, { useState, useEffect, useCallback } from "react";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi } from "../abi/abi";
import { Unity, useUnityContext } from "react-unity-webgl";

export function ShotFishButton() {
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  // async function submit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const tokenId = 5000;
  //   const sentLink = 1000000000000000000;
  //   writeContract({
  //     address: "0xf2DD83CFB97f1f52D2f83B560046cb616E885Adc",
  //     abi,
  //     functionName: "shotFish",
  //     args: [BigInt(tokenId), BigInt(sentLink)],
  //   });
  // }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      handleTransactionSuccess();
    }
  }, [isConfirmed, handleTransactionSuccess]);

  const { unityProvider,isLoaded, sendMessage, addEventListener, removeEventListener } =
    useUnityContext({
      loaderUrl: "UnityBuild/webgl_app.loader.js",
      dataUrl: "UnityBuild/webgl_app.data",
      frameworkUrl: "UnityBuild/webgl_app.framework.js",
      codeUrl: "UnityBuild/webgl_app.wasm",
    });

  const handleShot = useCallback(() => {
    const tokenId = 100;
    const sentLink = 1000000000000000000;
    const tx = writeContract({
      address: "0xf2DD83CFB97f1f52D2f83B560046cb616E885Adc",
      abi,
      functionName: "shotFish",
      args: [BigInt(tokenId), BigInt(sentLink)],
    });
  }, [sendMessage]);

  useEffect(() => {
    addEventListener("ShootCallback", handleShot);
    return () => {
      removeEventListener("ShootCallback", handleShot);
    };
  }, [addEventListener, removeEventListener, handleShot]);

  function handleTransactionSuccess() {
    console.log("Transaction confirmed");
    sendMessage("Rocket Launcher", "FireWeapon");
  }

  return (
    <div>
        {/* <button disabled={isPending} type="submit">
          {isPending ? "Confirming..." : "Mint"}
        </button> */}
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      <Unity
        unityProvider={unityProvider}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          border: "2px solid black",
          background: "grey",
          visibility: isLoaded ? "visible" : "hidden",
        }}
      />
    </div>
  );
}
