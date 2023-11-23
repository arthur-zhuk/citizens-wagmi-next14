import { createConfig } from 'wagmi'
import { getDefaultConfig } from 'connectkit'
import { sepolia, mainnet } from 'wagmi/chains'

const walletConnectProjectId = 'a3854428024553eafe1c9e4561856607'

export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'citizens',
    walletConnectProjectId,
    chains: [sepolia, mainnet],
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  })
)
