import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Section from './components/Section';
import Product from './components/Product';

// ABIs
import MarketABI from './abis/Web3Market.json';

// Config
import config from './config.json';

function App() {
  //state hooks
  const [provider, setProvider] = useState(null);
  const [instance, setInstance] = useState(null);
  const [account, setAccount] = useState(null);

  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  //toggles item pop ups
  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  }

  //Loading items from blockchain
  const loadChainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    //Connect to smart contract
    const contract = new ethers.Contract(
      config[network.chainId].web3market.address, 
      MarketABI, 
      provider
    );

    setInstance(contract);
    
    //Load items
    const items = [];

    for (let i = 0; i < 9; i++) {
      const item = await contract.items(i + 1);
      items.push(item);
    };

    //set categories
    const electronics = items.filter((item) => item.category === "electronics");
    const clothing = items.filter((item) => item.category === "clothing");
    const toys = items.filter((item) => item.category === "toys");

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);
  };

  //useEffect calls loading of items
  useEffect(() => {
    loadChainData()
  }, []);

  //Main page
  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <h2>Best Sellers</h2>

      {electronics && clothing && toys && (
        <>
          <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
          <Section title={"Electronics"} items={electronics} togglePop={togglePop} />
          <Section title={"Games & Toys"} items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product item={item} provider={provider} account={account} instance={instance} togglePop={togglePop}/>
      )}

    </div>
  );
}

export default App;