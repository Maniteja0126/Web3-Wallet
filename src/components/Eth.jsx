
import { useState } from 'react';
import { HDNodeWallet, Wallet, ethers , formatEther } from 'ethers';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

const Eth = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [wallets, setWallets] = useState([]);
  const [showMnemonic, setShowMnemonic] = useState(true);
  const [walletsGenerated, setWalletsGenerated] = useState(false);
  const [balances, setBalances] = useState({});

  const ETH_PRIVATE_KEY = import.meta.env.VITE_ETH_PRIVATE_KEY;

  const ethProvider = new ethers.JsonRpcProvider(ETH_PRIVATE_KEY)

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setShowMnemonic(true);
    setWalletsGenerated(true);
  };

  const handleGenerateWallets = async () => {
    const newWallets = wallets.slice();
    const size = newWallets.length + 1;

    const wallet = generateEthWallet(size);
    newWallets.push(wallet);

    setWallets(newWallets);
    setShowMnemonic(false);
    const ethBalance = await getEthBalance(wallet.address);
    setBalances({
      ...balances,
      [wallet.address]: ethBalance,
    });
  };

  const getEthBalance = async (address) => {
    const balance = await ethProvider.getBalance(address);
    console.log(balance);
    return formatEther(balance);
  }

  const deriveEthereumPrivateKey = (seed, derivationPath) => {
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    return child.privateKey;
  };

  const getEthereumWallet = (privateKey) => {
    let wallet;
    try {
      wallet = new Wallet(privateKey);
    } catch {
      throw new Error("Invalid Ethereum private key");
    }
    return wallet;
  };

  const generateEthWallet = (index) => {
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/60'/${index}'/0'`;
    const privateKey = deriveEthereumPrivateKey(seed, path);
    const wallet = getEthereumWallet(privateKey);

    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  };

  const handleAddNewAccount = () => {
    handleGenerateWallets();
  };

  return (
    <div className="app-container">
      <h1>Create Ethereum Wallets</h1>

      {!walletsGenerated && (
        <button onClick={handleGenerateMnemonic}>Generate Mnemonic</button>
      )}
      {mnemonic && showMnemonic && (
        <div className="mnemonic-section">
          <h3>Mnemonic:{mnemonic}</h3>
          <p></p>
          <div className="warning">
            <p><strong>Warning:</strong> Keep your mnemonic phrase safe and secure. It is crucial for accessing your wallet and funds. Do not share it with anyone.</p>
          </div>

          <button onClick={handleGenerateWallets}>Generate Wallet</button>
        </div>
      )}

      {wallets.length > 0 && (
        <div className="wallets-section">
          <button onClick={handleAddNewAccount} className="add-new-account">
            Add new Account+
          </button>
          {wallets.map((wallet, index) => (
            <div key={index}>
              <div className="wallet-box">
                <img src="/ethereum.png" alt="Ethereum Logo" className="ethereum-logo" />
                <div><strong>Wallet {index + 1}:</strong> {wallet.address}</div>
              </div>
              <div>Balance : {balances[wallet.address]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Eth;