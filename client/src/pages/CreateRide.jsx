import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { alertContext } from '../context/AlertState';
import { ethers } from 'ethers';

const CreateRide = ({ contract }) => {
    // for alert
    const context = useContext(alertContext);
    const { showAlert } = context;
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [availableSeats, setAvailableSeats] = useState(0);
    const [pricePerSeat, setPricePerSeat] = useState(0);

    const navigate = useNavigate();

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
        console.log(startLocation, destination, availableSeats, pricePerSeat);
        if (valid) {
            try {
                const pricePerSeatInWei = ethers.utils.parseEther(pricePerSeat.toString());
                await contract.createRide(
                    startLocation,
                    destination,
                    availableSeats,
                    pricePerSeatInWei,
                    {value: ethers.utils.parseEther('1')}
                );
                showAlert('Ride created successfully', 'success');
            } catch (error) {
                console.error('Error creating ride', error);
                showAlert('Error creating ride. Check the console for details.', 'danger');
            }
        }
    }

    return (
        <div style={{ maxWidth: '50vw', margin: 'auto' }}>
            <h1 style={{ marginBottom: '10px' }}>Create Ride</h1>
            <form className="row g-3" noValidate onSubmit={handleSubmit}>
                <div className="col-12">
                    <label htmlFor="startLocation" className="form-label">Start Location</label>
                    <input type="text" className="form-control" value={startLocation} name="Start Location"
                           onChange={(e) => setStartLocation(e.target.value)} required />
                    <div className="invalid-feedback">
                        Please provide a start Location
                    </div>
                </div>
                <div className="col-12">
                    <label htmlFor="destination" className="form-label">Destination</label>
                    <input type="text" className="form-control" value={destination} name="Destination"
                           onChange={(e) => setDestination(e.target.value)} required />
                    <div className="invalid-feedback">
                        Please provide a destination
                    </div>
                </div>
                <div className="col-12">
                    <label htmlFor="availableSeats" className="form-label">Available Seats</label>
                    <input type="number" className="form-control" value={availableSeats} name="availableSeats"
                           onChange={(e) => setAvailableSeats(e.target.value)} min="1" required />
                    <div className="invalid-feedback">
                        Must be greater than zero.
                    </div>
                </div>
                <div className="col-12">
                    <label htmlFor="pricePerSeat" className="form-label">Price Per Seat(ETH)</label>
                    <input type="number" className="form-control" value={pricePerSeat} name="pricePerSeat"
                           onChange={(e) => setPricePerSeat(e.target.value)} min="0.000000000000000001" step="any" required />
                    <div className="invalid-feedback">
                        Must be greater than zero.
                    </div>
                </div>
                <div className="col-6">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
};

export default CreateRide;