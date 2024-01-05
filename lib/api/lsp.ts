import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import { getDefaultProvider, Contract } from 'ethers';

const newLSP7Contract = (address: string): Contract => {
  return new Contract(
    address,
    LSP7DigitalAsset.abi,
    getDefaultProvider('http://'),
  );
};

export const getLSP7TokenData = async(address: string) => {
  const lsp7contract = newLSP7Contract(address);
  const totalSupply: number = await lsp7contract.totalSupply();

  return totalSupply;
};
