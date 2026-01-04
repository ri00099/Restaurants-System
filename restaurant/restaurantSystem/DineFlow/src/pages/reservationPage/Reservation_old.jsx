import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/reservationPage/Reservation.css";
import { FaChair, FaClock, FaCalendarAlt } from "react-icons/fa";

const Reservation = () => {
  // STATE MANAGEMENT
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState("12:00");
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState("");

  // Helper: Seat capacity logic
  const getSeatsForTable = (num) => {
    if ([1, 4, 7].includes(num)) return 2;
    if ([2, 5, 8].includes(num)) return 4;
    return 6; // Large tables
  };

  // FETCH TABLE STATUS
  const fetchTableStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/reservation/status`, {
        params: { date, timeSlot }
      });

      if (response.data.success) {
        const formattedTables = response.data.data.map(t => ({
          id: t.tableNumber,
          name: `T${t.tableNumber}`,
          seats: getSeatsForTable(t.tableNumber),
          status: t.status.toLowerCase()
        }));
        setTables(formattedTables);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever Date or Time changes
  useEffect(() => {
    fetchTableStatus();
    setSelectedTable(null);
  }, [date, timeSlot]);

  // HANDLE BOOKING
  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to book a table!");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/reservation/book",
        {
          tableNumber: selectedTable.id,
          date,
          timeSlot,
          guests: parseInt(guests),
          specialRequest,
          occasion: "None",
          seatingPreference: "No Preference"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Table Reserved Successfully!");
        setSelectedTable(null);
        fetchTableStatus();
      }
    } catch (error) {
      console.error("Booking Error:", error);
      const msg = error.response?.data?.message || "Booking failed";
      alert(msg);
    }
  };

  return (
    <div className="res-container">
      {/* HEADER */}
      <div className="res-header">
        <h1>Reservations</h1>
        <p>Book your table in advance for a seamless dining experience.</p>
      </div>

      <div className="res-content">
        {/* DATE & TIME CONTROLS */}
        <div className="controls-section" style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Date</label>
            <div className="input-box">
              <FaCalendarAlt /> 
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Time</label>
            <div className="input-box">
              <FaClock />
              <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="19:00">07:00 PM</option>
                <option value="20:00">08:00 PM</option>
                <option value="21:00">09:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE GRID */}
        <div className="table-section">
          <h2 className="section-title">
            {loading ? "Checking Availability..." : `Tables for ${timeSlot}`}
          </h2>

          <div className="res-table-grid">
            {tables.map((t) => (
              <div
                key={t.id}
                onClick={() => t.status === "available" && setSelectedTable(t)}
                className={`res-table-card ${t.status} ${selectedTable?.id === t.id ? "active" : ""}`}
              >
                <div className="table-icon">
                  <FaChair />
                </div>

                <div className="table-info">
                  <h4>{t.name}</h4>
                  <p>{t.seats} Seats</p>
                </div>

                <span className={`status ${t.status}`}>
                  {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING PANEL */}
        {selectedTable && (
          <div className="booking-panel">
            <div className="panel-header">
              <h3>Confirm Booking</h3>
              <p>Table {selectedTable.name} • {selectedTable.seats} Seats</p>
            </div>

            <div className="summary-row">
              <strong>Date:</strong> {date} <br/>
              <strong>Time:</strong> {timeSlot}
            </div>
            <br/>

            <label>Guests</label>
            <input 
              type="number" 
              min="1" 
              max="10" 
              className="plain-input" 
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />

            <label>Special Notes</label>
            <textarea 
              placeholder="Birthday, window seat..." 
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
            />

            <button className="reserve-btn" onClick={handleBooking}>
              Confirm Reservation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;
