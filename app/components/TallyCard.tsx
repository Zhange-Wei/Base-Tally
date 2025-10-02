'use client';

import { useEffect, useState } from 'react';
import { useAppKitAccount, useAppKitBalance, useAppKitNetwork, useAppKitState } from '@reown/appkit/react';
import { useWriteContract } from 'wagmi';
import { counterContractAbi, counterContractAddress } from '@/calls';

async function fetchNumber(): Promise<string> {
  try {
    const rpcUrl = 'https://mainnet.base.org';
    const data = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        {
          to: counterContractAddress,
          data: '0x8381f58a', // number()
        },
        'latest',
      ],
    } as const;
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });
    const json = (await res.json()) as { result?: string };
    if (!json.result) return '0';
    return BigInt(json.result).toString();
  } catch {
    return '0';
  }
}

export default function TallyCard() {
  const { address: walletAddress, isConnected } = useAppKitAccount({ namespace: 'eip155' });
  const { fetchBalance } = useAppKitBalance();
  const { chainId } = useAppKitNetwork();
  const { initialized } = useAppKitState();
  const [balance, setBalance] = useState<{ formatted?: string; symbol?: string } | null>(null);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [value, setValue] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const { writeContractAsync, isPending } = useWriteContract();

  const refresh = async () => {
    setLoading(true);
    const v = await fetchNumber();
    setValue(v);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 12_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!isConnected) {
        if (!ignore) {
          setBalance(null);
          setBalanceError(null);
        }
        return;
      }
      if (!ignore) setBalanceLoading(true);
      const result = await fetchBalance();
      if (!ignore) {
        const mappedBalance = result?.data
          ? { formatted: result.data.balance, symbol: result.data.symbol }
          : null;
        setBalance(mappedBalance);
        setBalanceError(result?.isError ? result.error ?? 'Failed to fetch balance' : null);
        setBalanceLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, isConnected, chainId, walletAddress]);

  const onIncrement = async () => {
    try {
      await writeContractAsync({
        address: counterContractAddress as `0x${string}`,
        abi: counterContractAbi,
        functionName: 'increment',
        args: [] as const,
      });
      await refresh();
    } catch {
      // swallow in UI; optionally add toast
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Onchain Tally</h2>
          <p className="text-sm text-gray-500">Base Mainnet • Counter</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs">
            {initialized ? 'Connected' : 'Disconnected'}
          </span>
          <a
            href={`https://basescan.org/address/${counterContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View on Basescan
          </a>
        </div>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <span className="text-5xl font-bold tabular-nums text-gray-900">{value}</span>
        {loading ? <span className="text-sm text-gray-500">Refreshing…</span> : null}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={!isConnected || isPending}
          onClick={onIncrement}
        >
          {isPending ? 'Incrementing…' : 'Increment counter'}
        </button>
        <button
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          onClick={refresh}
          disabled={loading}
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {walletAddress ? (
        <div className="mt-3 text-xs text-gray-500 break-all">
          <p>Signed in as {walletAddress}</p>
          {balanceLoading ? (
            <p className="mt-1">Fetching balance…</p>
          ) : balance ? (
            <p className="mt-1">
              Balance: {balance.formatted ?? '0'} {balance.symbol}
            </p>
          ) : balanceError ? (
            <p className="mt-1">Balance unavailable</p>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-500">Connect a wallet to increment</p>
      )}
    </div>
  );
}


