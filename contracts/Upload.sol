// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Upload {
   struct Ride {
       address driver;
       string startLocation;
       string destination;
       uint256 availableSeats;
       uint256 pricePerSeat;
       bool verified;
       address[] bookedPassengers;
       uint256 deposit;
   }


   Ride[] public rides;


   // mapping(address => uint256) public driverDeposits;


   event RideCreated(uint256 indexed rideId, address indexed driver, string startLocation, string destination, uint256 availableSeats, uint256 pricePerSeat);
   event RideBooked(uint256 indexed rideId, address indexed passenger, uint256 numSeats);
   event DriverVerified(uint256 indexed rideId);


   modifier onlyDriver(uint256 _rideId) {
       require(_rideId < rides.length, "Invalid ride ID");
       require(msg.sender == rides[_rideId].driver, "Only ride owner can call this function");
       _;
   }

   function createRide(
       string memory _startLocation,
       string memory _destination,
       uint256 _availableSeats,
       uint256 _pricePerSeat
   ) public payable {
       // Driver needs to deposit 1 ether to get verified
       require(msg.value == 1 ether, "Incorrect deposit amount");


       address[] memory emptyArray = new address[](0);
       // _pricePerSeat = _pricePerSeat * 10 **
       rides.push(Ride({
           driver: msg.sender,
           startLocation: _startLocation,
           destination: _destination,
           availableSeats: _availableSeats,
           pricePerSeat: _pricePerSeat * 10**18,
           verified: true,
           bookedPassengers: emptyArray,
           deposit: msg.value
       }));
       emit RideCreated(rides.length - 1, msg.sender, _startLocation, _destination, _availableSeats, _pricePerSeat);
   }

   function completeTheRide(uint256 _rideId) onlyDriver(_rideId) public {
       Ride storage ride = rides[_rideId];

       // Transfer the amount to the driver
       address payable driver = payable(msg.sender);
       driver.transfer(ride.deposit);
       ride.verified = false;
       ride.deposit = 0;
   }


   function bookRide(uint256 _rideId, uint256 _numberOfSeats) public payable {
       require(_rideId < rides.length, "Invalid ride ID");
       Ride storage ride = rides[_rideId];

       require(ride.verified, "Driver is not verified");
       require(ride.driver != msg.sender, "Driver can not book ride");
       require(ride.availableSeats >= _numberOfSeats, "Seats is not available");
       uint256 amount = ride.pricePerSeat * _numberOfSeats;
       require(msg.value >= amount, "Insuffient amount");


       address payable recipient = payable(rides[_rideId].driver);
       recipient.transfer(amount);


       ride.availableSeats -= _numberOfSeats;
       for (uint256 i = 0; i < _numberOfSeats; i++) {
           ride.bookedPassengers.push(msg.sender);
       }


       address payable sender = payable(msg.sender);
       sender.transfer(msg.value - amount);
       emit RideBooked(_rideId, msg.sender, _numberOfSeats);
   }


   function getRide(uint256 _rideId) public view returns (
       address driver,
       string memory startLocation,
       string memory destination,
       uint256 availableSeats,
       uint256 pricePerSeat,
       bool verified,
       address[] memory bookedPassengers
   ) {
       require(_rideId < rides.length, "Invalid ride ID");
       Ride storage ride = rides[_rideId];
       return (
           ride.driver,
           ride.startLocation,
           ride.destination,
           ride.availableSeats,
           ride.pricePerSeat,
           ride.verified,
           ride.bookedPassengers
       );
   }

   function getRides() public view returns(Ride[] memory _rides) {
       return rides;
   }
}
