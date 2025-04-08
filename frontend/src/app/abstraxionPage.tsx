"use client";
import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import "@burnt-labs/ui/dist/index.css";

export default function AbstractionPage({
  children,
}: {
  children: React.ReactNode;
}) {
  // Abstraxion hooks
  const { data: account } = useAbstraxionAccount();
  const { client, signArb, logout } = useAbstraxionSigningClient();
  const [, setShowModal]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useModal();

  console.log(account);

  return client ? (
    <>{children}</>
  ) : (
    <main className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center gap-4 p-4 bg-black">
      <h1 className="text-2xl font-bold tracking-tighter text-white">
        ABSTRAXION
      </h1>

      <Button fullWidth onClick={() => setShowModal(true)} structure="base">
        {account?.bech32Address ? "CONNECTED" : "CONNECT"}
      </Button>

      <Abstraxion onClose={() => setShowModal(false)} />
    </main>
  );
}
