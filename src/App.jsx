import { useState } from 'react'
import Sol from './components/Sol'
import Eth from './components/Eth'
import './App.css'

function App() {

  const [selectedWallet , setSelectedWallet] = useState('');

  const handleSelect = (event) =>{
    setSelectedWallet(event.target.value);
  }

  return (
    <div className="App">
      <h1>Create Wallet</h1>
      <div className='wallet-selection'>
        <label>
          <input type="radio" value="solana" checked={selectedWallet === 'solana'} onChange={handleSelect} 
          />
          Solana
        </label>
        <label>
          <input type="radio"
          value="ethereum"
          checked={selectedWallet === 'ethereum'}
          onChange={handleSelect}
          />
          Ethereum
        </label>
      </div>
      {selectedWallet === 'solana' && <Sol />}
      {selectedWallet === 'ethereum' && <Eth />}
    </div>
  )
}

export default App
