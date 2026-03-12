import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { metaMask, coinbaseWallet } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],

  transports: {
    [base.id]: http(),
  },

  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: "Grow Me",
    }),
  ],
});