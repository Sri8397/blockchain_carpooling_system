import { useNavigate } from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import { ethers } from 'ethers';
import StateOptions from "../utils/StateOptions";
import { alertContext } from '../context/AlertState';

const BookRide = ({ contract, rides }) => {
    // for alert
    const context = useContext(alertContext);
    const { showAlert } = context;
    const [rideId, setRideId] = useState(0);
    const [numberOfSeats, setNumberOfSeats] = useState(0);
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [filteredRides, setFilteredRides] = useState([]);

    const findRides = (e) => {
        e.preventDefault();
        let filteredRides1 = [];
        for (let i = 0; i < rides.length; i++) {
            if (rides[i].startLocation === startLocation && rides[i].destination === destination) {
                filteredRides1.push(rides[i]);
            }
        }
        setFilteredRides(filteredRides1);
        console.log(filteredRides1);
        console.log(filteredRides);
    }

    const navigate = useNavigate();

    const bookRide = async () => {
        try {
            const ride = await contract.rides(rideId);
            console.log(ride);
            const totalPrice = numberOfSeats * ride.pricePerSeat;
            // alert(totalPrice);
            await contract.bookRide(
                rideId,
                numberOfSeats,
                { value: ethers.utils.parseUnits(totalPrice.toString(), 'wei') }
            );
            showAlert('Ride booked successfully', 'success');
            navigate('/');
        } catch (error) {
            console.log('Error booking ride: ', error);
            showAlert('Error booking ride. Check the console for details.', 'danger');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        form.classList.add('was-validated');
        let valid = true;
        Array.from(form).forEach(ele => {
            if (!ele.checkValidity()) {
                valid = false;
            }
        });
        if (valid) {
            bookRide();
        }
    }

    return (
        <>
            <div style={{maxWidth: '50vw', margin: 'auto'}}>
                <h1 style={{marginBottom: '10px'}}>Book Ride</h1>
                <form className="row g-3" noValidate>
                    <div className="col-12">
                        <label htmlFor="startLocation" className="form-label">Start Location</label>
                        <input type="text" className="form-control" value={startLocation} name="startLocation"
                               onChange={(e) => setStartLocation(e.target.value)} required />
                        <div className="invalid-feedback">
                            Please provide a vehicle number eg.JH09BG0976.
                        </div>
                    </div>
                    <div className="col-12">
                        <label htmlFor="destination" className="form-label">Destination</label>
                        <input type="text" className="form-control" value={destination} name="destination"
                               onChange={(e) => setDestination(e.target.value)} required />
                        <div className="invalid-feedback">
                            Please provide a vehicle number eg.JH09BG0976.
                        </div>
                    </div>
                    <div className="col-12">
                        <label htmlFor="rideId" className="form-label">Ride Id</label>
                        <input type="number" className="form-control" value={rideId} name="rideId" readOnly required />
                        <div className="invalid-feedback">
                            Please provide a vehicle number eg.JH09BG0976.
                        </div>
                    </div>
                    <div className="col-12">
                        <label htmlFor="numberOfSeats" className="form-label">Number of seats</label>
                        <input type="number" className="form-control" value={numberOfSeats} name="numberOfSeats"
                               onChange={(e) => setNumberOfSeats(e.target.value)} pattern="[A-Za-z0-9]{10}" required />
                        <div className="invalid-feedback">
                            Please provide a vehicle number eg.JH09BG0976.
                        </div>
                    </div>
                    <div className="col-6">
                        <button onClick={findRides} className="btn btn-primary">Find Rides</button>
                    </div>
                    <div className="col-6">
                        <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
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
                                                Driver
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Price Per Seat(ETH)
                                            </th>
                                            <th scope="col" className="px-6 py-4">
                                                Available Seats
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRides.map((ride, index) => {
                                            return (
                                                <tr className={`border-b transition duration-300 ease-in-out hover:bg-neutral-100 alert alert-${alert}`}
                                                    style={{cursor: 'pointer'}} key={index}
                                                    onClick={() => setRideId(index)}>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {index}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {ride.startLocation}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {ride.destination}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {ride.driver}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {(ride.pricePerSeat / 10 ** 18).toString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        {ride.availableSeats.toString()}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookRide;