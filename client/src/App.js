import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar';
import './tailwind.css';
import Home from "./pages/Home";
import CreateRide from "./pages/CreateRide";
import BookRide from "./pages/BookRide";
import {AlertState} from "./context/AlertState";
import {VehicleState} from "./context/VehicleState";
import Carpooling from "./artifacts/contracts/Carpooling.sol/Carpooling.json";

function App() {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [rides, setRides] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (contract) {
                    console.log(contract)
                    // const rides = await contract.rides(0);
                    const rides = await contract.getRides();
                    console.log(rides);
                    const filteredRides = rides.filter(ride => ride.active);

                    setRides(filteredRides);
                }
            } catch (error) {
                console.error("Error fetching rides:", error);
            }
        };

        fetchData();
    }, [contract]);

    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const address = await signer.getAddress();
                    setAccount(address);

                    window.ethereum.on("chainChanged", () => {
                        window.location.reload();
                    });

                    window.ethereum.on("accountsChanged", () => {
                        window.location.reload();
                    });

                    await window.ethereum.request({ method: 'eth_requestAccounts' });

                    let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
                    const contract = new ethers.Contract(
                        contractAddress,
                        Carpooling.abi,
                        signer
                    );
                    setContract(contract);
                    setProvider(provider);
                } else {
                    console.error("Metamask is not installed");
                }
            } catch (error) {
                console.error("Error initializing Ethereum provider:", error);
            }
        };

        init();
    }, []);

    return (
        <AlertState>
            <VehicleState>
                <Router>
                    <Navbar account={account} />
                    <div className="container my-3">
                        <Routes>
                            <Route path="/" element={<Home contract={contract} rides={rides} />} />
                            <Route path="/create" element={<CreateRide contract={contract}  />} />
                            <Route path="/book" element={<BookRide contract={contract} rides={rides} />} />
                        </Routes>
                    </div>
                </Router>
            </VehicleState>
        </AlertState>
    );
}

export default App;
