import { getContract as getWeb3Contract } from '../../utils/web3.utils';
import { utils } from 'ethers';
import * as contractAbi from '../../contract-abi/factory.json';
import * as contractNftAbi from '../../contract-abi/nft.json';
import { MintBulk } from '../../models/bulk.model';
import { getFactoryContract, getNftContract, percentageToBigNumber } from '../../utils/ether.utils';

const factoryAddress = process.env.FACTORY_ADDRESS || '';
const adminAddress = process.env.ADMIN_ADDRESS || '';
const gasMaxAllowance = process.env.GAS_MAX_ALLOWANCE ? parseInt(process.env.GAS_MAX_ALLOWANCE) : 40000000;

const createERC721 = async (name: string, symbol: string): Promise<string> => {
  const web3FactoryContract = getWeb3Contract((<any>contractAbi).abi, factoryAddress);
  const newNftAddress = await web3FactoryContract.methods.createIGIERC721(name, symbol, adminAddress).send({ from: adminAddress });
  console.log('createERC721-nft: ', newNftAddress);
  return newNftAddress;
};

const createNftContract = async (name: string, symbol: string): Promise<string> => {
  const factoryContract = getFactoryContract();
  const transaction = await factoryContract.createIGIERC721(name, symbol, adminAddress);
  const receipt = await transaction.wait();
  if (!receipt) return 'error: null';
  return utils.hexStripZeros(receipt.logs[0].address);
};

const mintBulk = async (bulkParams: MintBulk): Promise<void> => {
  const web3NftContract = getWeb3Contract((<any>contractNftAbi).abi, bulkParams.address);
  await web3NftContract.methods.mintBulk().send({
    _quantity: bulkParams.quantity,
    _to: adminAddress,
    _tokenURI: bulkParams.tokenUri,
    _skuPrefix: bulkParams.skuPrefix,
    _royalty: bulkParams.royalty,
    _fee: bulkParams.fee,
  });
};

const mintNftBulk = async (bulkParams: MintBulk): Promise<string> => {
  const nftContract = getNftContract(bulkParams.address);
  const web3NftContract = getWeb3Contract((<any>contractNftAbi).abi, bulkParams.address);

  if (bulkParams.royalty < 0 || bulkParams.fee < 0) return 'error: royalty or fee is negative';

  let estGas = 0;
  await web3NftContract.methods
    .mintBulk(bulkParams.quantity, bulkParams.skuPrefix, percentageToBigNumber(bulkParams.royalty), percentageToBigNumber(bulkParams.fee))
    .estimateGas({ from: adminAddress })
    .then((gas: number) => {
      estGas = gas;
    });
  console.log('estimation gas: ', estGas);

  const safeAmount = Math.round(gasMaxAllowance / (estGas * 1.1));
  console.log(`safe gas amt ${safeAmount}`);
  const transaction = await nftContract.mintBulk(
    bulkParams.quantity,
    bulkParams.skuPrefix,
    percentageToBigNumber(bulkParams.royalty),
    percentageToBigNumber(bulkParams.fee),
    { gasPrice: 60000000000, gasLimit: gasMaxAllowance },
  );
  const receipt = await transaction.wait();
  return 'success';
};

const setBaseUri = async (address: string, uri: string): Promise<void> => {
  const nftContract = getNftContract(address);
  const transaction = await nftContract.setBaseURI(uri);
  const receipt = await transaction.wait();
};

const getLastTokenId = async (address: string): Promise<number> => {
  // const web3NftContract = getWeb3Contract((<any>contractNftAbi).abi, address);
  // const tokenId = await web3NftContract.totalSupply();
  const nftContract = getNftContract(address);
  const total = await nftContract.totalSupply();
  console.log('getLastTokenId', total.toNumber());
  return total.toNumber();
};

export const NftContract = { createERC721, createNftContract, mintBulk, mintNftBulk, setBaseUri, getLastTokenId };
