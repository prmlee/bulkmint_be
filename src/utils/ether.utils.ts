import { BigNumber, ethers } from 'ethers';
import { ContractContext as FactoryContract } from '../contract-abi/generated-types/factory';
import { ContractContext as NftContract } from '../contract-abi/generated-types/nft';
import * as ContractFactoryAbi from '../contract-abi/factory.json';
import * as ContractNftAbi from '../contract-abi/nft.json';

const privateKey = process.env.PRIVATE_KEY || '';
const factoryAddress = process.env.FACTORY_ADDRESS || '';

export const getFactoryContract = (): FactoryContract => {
  const provider = getProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(factoryAddress, (<any>ContractFactoryAbi).abi, signer) as unknown as FactoryContract;
};

export const getNftContract = (address: string): NftContract => {
  const provider = getProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(address, (<any>ContractNftAbi).abi, signer) as unknown as NftContract;
};

const getProvider = (): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(process.env.MUMBAL_RPC_URL);
};

export const percentageToBigNumber = (value: number): ethers.BigNumberish => {
  return BigNumber.from((value * 100).toFixed(0));
};
