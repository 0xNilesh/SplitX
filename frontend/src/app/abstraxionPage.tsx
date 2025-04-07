"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useAbstraxionClient,
  useModal,
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import "@burnt-labs/ui/dist/index.css";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";

const contractAddress = "YOUR_COUNTER_CONTRACT_ADDRESS_HERE";

type ExecuteResultOrUndefined = ExecuteResult | undefined;

export default function AbstractionPage({
    children,
  }: {
    children: React.ReactNode
  }) {
  // Abstraxion hooks
  const { data: account } = useAbstraxionAccount();
  const { client, signArb, logout } = useAbstraxionSigningClient();
  const { client: queryClient } = useAbstraxionClient();

  // State variables
  const [count, setCount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState<ExecuteResultOrUndefined>(undefined);
  const [, setShowModal]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useModal();

  const blockExplorerUrl = `https://www.mintscan.io/xion-testnet/tx/${executeResult?.transactionHash}`;

  // Fetch the count from the smart contract
  const getCount = async () => {
    setLoading(true);
    try {
      if (!queryClient) {
        throw new Error("Query client is not initialized");
      }
      const response = await queryClient.queryContractSmart(contractAddress, { get_count: {} });
      setCount(response.count);
      console.log("Get Count:", response);
    } catch (error) {
      console.error("Error querying contract:", error);
    } finally {
      setLoading(false);
    }
  };

  // Increment the count in the smart contract
//   const increment = async () => {
//     setLoading(true);
//     const msg = { increment: {} };

//     try {
//       const res = await client?.execute(account.bech32Address, contractAddress, msg, "auto");
//       setExecuteResult(res);
//       console.log("Transaction successful:", res);
//       await getCount(); // Refresh count after successful increment
//     } catch (error) {
//       console.error("Error executing transaction:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  // Fetch count on page load
  useEffect(() => {
    if (queryClient) {
      getCount();
    }
  }, [queryClient]);

  console.log(account);

  return client ? (
    <>
      {children}
    </>
  ) : (
    <main className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold tracking-tighter text-white">ABSTRAXION</h1>
  
      <Button fullWidth onClick={() => setShowModal(true)} structure="base">
        {account?.bech32Address ? "CONNECTED" : "CONNECT"}
      </Button>
  
      <Abstraxion onClose={() => setShowModal(false)} />
    </main>
  );
  
}