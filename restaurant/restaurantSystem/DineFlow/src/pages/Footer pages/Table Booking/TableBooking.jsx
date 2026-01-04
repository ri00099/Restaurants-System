import React, { useState } from "react";
import "./TableBooking.css";

const TABLES = [
  { id: 1, number: "T1", seats: 2, status: "Available" },
  { id: 2, number: "T2", seats: 4, status: "Booked" },
  { id: 3, number: "T3", seats: 6, status: "Reserved" },
  { id: 4, number: "T4", seats: 4, status: "Available" },
];

export default function TableBooking() {
  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableSelect = (table) => {
    if (table.status === "Available") {
      setSelectedTable(table);
    }
  };

  const handleClose = () => {
    setSelectedTable(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reservation confirmed successfully!");
    setSelectedTable(null);
  };

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <header className="reservation-header">
          <h1>Reservations</h1>
          <p>Book your table in advance for a seamless dining experience.</p>
        </header>

        <div className="reservation-content">
          {/* LEFT PANEL - Table List */}
          <div className="tables-panel">
            <h2>Available Tables</h2>
            <div className="tables-list">
              {TABLES.map((table) => (
                <div
                  key={table.id}
                  className={`table-card ${
                    selectedTable?.id === table.id ? "selected" : ""
                  } ${table.status !== "Available" ? "disabled" : ""}`}
                  onClick={() => handleTableSelect(table)}
                >
                  <div className="table-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 9h18M3 15h18M5 3v18M19 3v18" />
                    </svg>
                  </div>
                  <div className="table-info">
                    <h3>{table.number}</h3>
                    <p>{table.seats} SEATS</p>
                  </div>
                  <span className={`status-badge status-${table.status.toLowerCase()}`}>
                    {table.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL - Booking Form */}
          {selectedTable && (
            <div className="booking-panel">
              <div className="booking-header">
                <div className="booking-title">
                  <h2>Table {selectedTable.number}</h2>
                  <p>{selectedTable.seats} Seats</p>
                </div>
                {/* CLOSE BUTTON - EXPLICITLY STYLED */}
                <button
                  className="close-btn-custom"
                  onClick={handleClose}
                  type="button"
                  title="Close"
                >
                  ✕
                </button>
              </div>

              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Time Slot</label>
                  <select required defaultValue="">
                    <option value="" disabled>
                      Select time
                    </option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="19:00">07:00 PM</option>
                    <option value="20:00">08:00 PM</option>
                    <option value="21:00">09:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Guests</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTable.seats}
                    required
                    placeholder="Number of guests"
                  />
                </div>

                <div className="form-group">
                  <label>Special Notes</label>
                  <textarea
                    rows="4"
                    placeholder="Birthday, window seat, extra plates..."
                  />
                </div>

                <button type="submit" className="confirm-button">
                  Confirm Reservation
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}