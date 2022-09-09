// have a function to enter the lottery
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"
export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, } = useMoralis()
    const chainId = parseInt(chainIdHex)
    // console.log(chainId)
    // const chainIdd = chainId == 1337 ? 31337 : chainId
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    // const raffleAddress = contractAddress[31337][0]
    // console.log(raffleAddress)
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    // let entranceFee
    const dispatch  = useNotification()
    const { runContractFunction: enterRaffle, isLoading,isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayer } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayer",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })
    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayer()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notifiaction",
            position: "topR",
            
        })
    }
    return (
        <div className="p-5">
            <div>hi from lottery entrance</div>
            {raffleAddress ? (
                <div>
                    <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ?<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> :<div>Enter Raffle</div>}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>Number Of Players: {numPlayers}</div>
                    <div>Recent Of Winner:{recentWinner}</div>
                </div>
            ) : (
                <div> No Raffle Address deteched!</div>
            )}
        </div>
    )
}
