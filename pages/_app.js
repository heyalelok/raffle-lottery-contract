import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "@web3uikit/core"

function MyApp({ Component, pageProps }) {
    const appId = "42u4Y2p0XXIBw55psoFyk2P18ASog4GPg5S7YqBp"
    const serverURL = "https://bvbluoaeujn3.usemoralis.com:2053/server"
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
