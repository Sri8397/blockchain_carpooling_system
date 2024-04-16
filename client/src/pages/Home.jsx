import { useNavigate } from "react-router-dom";
import {useContext, useState} from 'react';
import { alertContext } from '../context/AlertState';

// const storedData = JSON.parse(localStorage.getItem("entry"));

const Home = ({contract, rides}) => {
    // for alert
    const context = useContext(alertContext);
    const { showAlert } = context;

    const [openStates, setOpenStates] = useState(new Array(rides.length).fill(false));

    const toggleOpenState = (index) => {
        const updatedOpenStates = [...openStates];
        updatedOpenStates[index] = !updatedOpenStates[index];
        setOpenStates(updatedOpenStates);
    };

    const navigate = useNavigate();
    return (
        <div className="mx-2 shadow-md mt-2">
            <div className="flex flex-col">
                <div className="overflow-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <table className="min-w-full text-left text-sm font-light">
                                <thead className="border-b font-medium dark:border-neutral-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">
                                            RideId
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Source Address
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Destination Address
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Price Per Seat(ETH)
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Available Seats
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                            Details
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {rides.length ? rides.map((ride, index) => {
                                            return (
                                                <tr key={index} className={`border-b transition duration-300 ease-in-out hover:bg-neutral-100 alert alert-${alert}`}>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {ride.rideId.toString()}

                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {ride.startLocation}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {ride.destination}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {(ride.pricePerSeat / 10 ** 18).toString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {ride.availableSeats.toString()}
                                                    </td>

                                                    <td style={{
                                                        width: '100%',
                                                        padding: '10px',
                                                        display: 'flex',
                                                        flexDirection: 'column'
                                                    }}>
                                                        <p>{`driver: ${ride.driver} .`}</p>
                                                        {openStates[index] && (<>
                                                            {ride?.bookedPassengers.map((item, index) => {
                                                                return (
                                                                    <p key={index}> {`passenger${index + 1}: ${ride.driver} .`}</p>
                                                                )
                                                            })}
                                                        </>)
                                                        }
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <button className="bg-green-500 text-amber-50 p-1 m-1"
                                                                onClick={() => toggleOpenState(index)}>
                                                            Details
                                                        </button>
                                                        <button className="bg-red-700 text-amber-50 p-1 m-1"
                                                                onClick={async () => {
                                                                    try {
                                                                        await contract.completeTheRide(ride.rideId);
                                                                        showAlert('Ride completed successfully', 'success');
                                                                    } catch (error) {
                                                                        console.error('Error completing ride', error);
                                                                        showAlert('Error booking ride. Check the console for details.', 'danger');
                                                                    }
                                                                }}>
                                                            Complete Ride
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }) :
                                        <div className="text-2xl"> No Available rides </div>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;
