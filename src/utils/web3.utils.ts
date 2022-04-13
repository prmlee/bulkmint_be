import Web3 from 'web3';

const httpProvider = process.env.MUMBAL_RPC_URL || '';

const web3Provider = new Web3.providers.HttpProvider(httpProvider);
const web3 = new Web3(web3Provider);

export const getContract = (abi: any, contractAddress: string) => {
  return new web3.eth.Contract(abi, contractAddress);
};
