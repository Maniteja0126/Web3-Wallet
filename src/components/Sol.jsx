import { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Buffer } from "buffer";
import { derivePath } from "ed25519-hd-key";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
window.Buffer = Buffer;

const Sol = () => {
    const [mnemonic, setMnemonic] = useState("");
    const [wallets, setWallets] = useState([]);
    const [showMnemonic, setShowMnemonic] = useState(true);
    const [walletsGenerated, setWalletsGenerated] = useState(false);
    const [balances, setBalances] = useState({});

    const handleGenerateMnemonic = () => {
        const newMnemonic = generateMnemonic();
        setMnemonic(newMnemonic);
        setShowMnemonic(true);
        setWalletsGenerated(true);
    };

    const handleGenerateWallets = async () => {
        const newWallets = wallets.slice();
        const size = newWallets.length + 1;
        const newWallet = generateSolanaWallet(size);
        newWallets.push(newWallet);
        setWallets(newWallets);
        setShowMnemonic(false);

        // Fetch and set balance
        const solBalance = await getSolBalance(newWallet.publicKey);
        setBalances({
            ...balances,
            [newWallet.publicKey]: solBalance,
        });
        console.log(solBalance);
    };

    const generateSolanaWallet = (index) => {
        const seed = mnemonicToSeedSync(mnemonic);
        const path = `m/44'/501'/${index}'/0'`;
        const derivedSeed = derivePath(path, seed.toString("hex")).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const keypair = Keypair.fromSecretKey(secret);
        return {
            publicKey: keypair.publicKey.toBase58(),
            secretKey: keypair.secretKey,
        };
    };

    const getSolBalance = async (solPublicKey) => {
        const url = new Connection("https://api.testnet.solana.com");
        const publicKey = new PublicKey(solPublicKey);
        const balance = await url.getBalance(publicKey);
        return balance / 1e9;
    };

    const handleAddNewAccount = () => {
        handleGenerateWallets();
    };

    return (
        <div className="app-container">
            <h1>Create Solana Wallets</h1>
            {!walletsGenerated && (
                <button onClick={handleGenerateMnemonic}>Generate Mnemonic</button>
            )}
            {mnemonic && showMnemonic && (
                <div className="mnemonic-section">
                    <h3>Mnemonic- {mnemonic}</h3>
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
                                <img src="/solana.png" alt="Solana Logo" className="solana-logo" />
                                <div>
                                    <strong>Wallet {index + 1}:</strong> {wallet.publicKey}
                                </div>
                            </div>
                            <div>Balance: {balances[wallet.publicKey]}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Sol;
