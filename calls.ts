export const counterContractAddress = '0xFA3A0fe0B4EA6c5a1e1811fc3c4fa411DbA08094';
export const counterContractAbi = [
  {
    type: 'function',
    name: 'increment',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

import type { ContractFunctionParameters } from 'viem';

export const calls: ContractFunctionParameters[] = [
  {
    address: counterContractAddress,
    abi: counterContractAbi,
    functionName: 'increment',
    args: [],
  },
];


