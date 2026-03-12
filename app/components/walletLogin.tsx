"use client";

import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";

export default function WalletLogin() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  async function signIn() {
    if (!address) return alert("Connect wallet first");

    const nonceRes = await fetch("/api/auth/nonce");
    const { nonce } = await nonceRes.json();

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in to Grow Me",
      uri: window.location.origin,
      version: "1",
      chainId: 8453, // Base mainnet
      nonce,
    });

    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    });

    await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        signature,
      }),
    });

    alert("Login success");
  }

  return (
    <button onClick={signIn}>
      Sign In With Wallet
    </button>
  );
}