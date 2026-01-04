import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../style/reservationPage/Reservation.css";
import {
  Armchair,
  Clock,
  Calendar,
  User,
  Cake,
  Heart,
  Briefcase,
  Gem,
  Star,
  UtensilsCrossed,
  X
} from "lucide-react";
import { useToast } from "../../components/ToastContainer";

const Reservation = () => {
  const { addToast } = useToast();

  // STATE MANAGEMENT
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myReservations, setMyReservations] = useState([]);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Form States
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState("");
  const [occasion, setOccasion] = useState("None");
  const [seatingPreference, setSeatingPreference] = useState("No Preference");

  const getMinDate = () => new Date().toISOString().split("T")[0];

  // FETCH AVAILABLE TIME SLOTS
  const fetchAvailableTimeSlots = async (selectedDate) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/reservation/available-time-slots`,
        { params: { date: selectedDate } }
      );

      if (response.data.success) {
        setAvailableTimeSlots(response.data.availableSlots);

        const isCurrentSlotAvailable = response.data.availableSlots.some(
          (slot) => slot.value === timeSlot
        );

        if (!isCurrentSlotAvailable && response.data.availableSlots.length > 0) {
          setTimeSlot(response.data.availableSlots[0].value);
        }
      }
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      addToast("Failed to load available time slots", "error");
    }
  };

  // FETCH TABLE STATUS
  const fetchTableStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/reservation/table-status`,
        { params: { date, timeSlot } }
      );

      if (response.data.success) {
        setTables(
          response.data.data.map((t) => ({
            id: t.tableNumber,
            name: `T${t.tableNumber}`,
            seats: t.seats,
            status: t.status.toLowerCase(),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      addToast("Failed to load table status", "error");
    } finally {
      setLoading(false);
    }
  };

  // FETCH MY RESERVATIONS
  const fetchMyReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:3000/api/reservation/my-reservations",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMyReservations(response.data.reservations);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // CANCEL RESERVATION
  const cancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/reservation/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        addToast("Reservation cancelled successfully", "success");
        fetchMyReservations();
        fetchTableStatus();
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to cancel", "error");
    }
  };

  useEffect(() => {
    fetchAvailableTimeSlots(date);
  }, [date]);

  useEffect(() => {
    fetchTableStatus();
    fetchMyReservations();
    setSelectedTable(null);
  }, [date, timeSlot]);

  // HANDLE BOOKING
  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        addToast("Please login to book a table!", "error");
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
          occasion,
          seatingPreference,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        addToast(
          `Table Reserved! Code: ${response.data.confirmationCode}`,
          "success"
        );
        setSelectedTable(null);
        setSpecialRequest("");
        setOccasion("None");
        setSeatingPreference("No Preference");
        fetchTableStatus();
        fetchMyReservations();
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Booking failed";
      addToast(msg, "error");
    }
  };

  const occasionIcons = {
    None: null,
    Birthday: <Cake size={16} />,
    Anniversary: <Heart size={16} />,
    "Business Meeting": <Briefcase size={16} />,
    Proposal: <Gem size={16} />,
    Other: <Star size={16} />,
  };

  return (
    <>
      <div className="reservation-page">
        <div className="reservation-wrapper">
          {/* HEADER */}
          <header className="page-header">
            <h1 className="page-title">Table Reservation</h1>
            <p className="page-description">
              Select a date, time, and available table to complete your reservation
            </p>
            <button
              className="view-toggle-btn"
              onClick={() => setShowMyBookings(!showMyBookings)}
              type="button"
            >
              {showMyBookings ? "Make New Reservation" : "View My Reservations"}
            </button>
          </header>

          {showMyBookings ? (
            /* MY RESERVATIONS VIEW */
            <section className="reservations-section">
              <h2 className="section-title">My Reservations</h2>

              {myReservations.length === 0 ? (
                <div className="empty-message">
                  <UtensilsCrossed size={40} />
                  <p>You have no reservations</p>
                </div>
              ) : (
                <div className="reservations-list">
                  {myReservations.map((res) => (
                    <article key={res._id} className="reservation-item">
                      <div className="reservation-details">
                        <div className="reservation-header">
                          <h3 className="reservation-table">
                            Table {res.tableNumber}
                          </h3>
                          <span
                            className={`reservation-status status-${res.status.toLowerCase()}`}
                          >
                            {res.status}
                          </span>
                        </div>

                        <div className="reservation-info">
                          <div className="info-row">
                            <Calendar size={16} />
                            <span>{res.date}</span>
                          </div>
                          <div className="info-row">
                            <Clock size={16} />
                            <span>{res.timeSlot}</span>
                          </div>
                          <div className="info-row">
                            <User size={16} />
                            <span>
                              {res.guests} {res.guests === 1 ? "Guest" : "Guests"}
                            </span>
                          </div>
                        </div>

                        <div className="confirmation-info">
                          <strong>Confirmation Code:</strong> {res.confirmationCode}
                        </div>

                        {res.occasion !== "None" && (
                          <div className="occasion-info">
                            {occasionIcons[res.occasion]}
                            <span>{res.occasion}</span>
                          </div>
                        )}

                        {res.seatingPreference !== "No Preference" && (
                          <div className="seating-info">
                            Seating: {res.seatingPreference}
                          </div>
                        )}

                        {res.specialRequest && (
                          <div className="special-request">
                            Special Request: {res.specialRequest}
                          </div>
                        )}
                      </div>

                      {res.status !== "Cancelled" && res.status !== "Completed" && (
                        <div className="reservation-actions">
                          <button
                            onClick={() => cancelReservation(res._id)}
                            className="cancel-reservation-btn"
                            type="button"
                          >
                            Cancel Reservation
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          ) : (
            /* BOOKING VIEW */
            <>
              {/* DATE & TIME */}
              <section className="datetime-section">
                <h2 className="section-title">Select Date and Time</h2>
                <form className="datetime-form">
                  <div className="form-group">
                    <label htmlFor="reservation-date" className="form-label">
                      <Calendar size={16} /> Date
                    </label>
                    <input
                      type="date"
                      id="reservation-date"
                      className="form-input"
                      value={date}
                      min={getMinDate()}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reservation-time" className="form-label">
                      <Clock size={16} /> Time
                    </label>
                    <select
                      id="reservation-time"
                      className="form-select"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                    >
                      {availableTimeSlots.length === 0 ? (
                        <option value="">No available time slots</option>
                      ) : (
                        availableTimeSlots.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </form>
              </section>

              {/* TABLES */}
              <section className="tables-section">
                <div className="section-header">
                  <h2 className="section-title">
                    {loading ? "Loading availability..." : "Available Tables"}
                  </h2>
                  {!loading && (
                    <p className="section-subtitle">Selected time: {timeSlot}</p>
                  )}
                </div>

                <div className="tables-grid">
                  {tables.map((table) => (
                    <div
                      key={table.id}
                      className={`table-item ${table.status}`}
                      onClick={() => {
                        console.log("Table clicked:", table);
                        if (table.status === "available") {
                          setSelectedTable(table);
                        }
                      }}
                    >
                      <div className="table-icon">
                        <Armchair size={24} />
                      </div>
                      <div className="table-info">
                        <h3 className="table-name">{table.name}</h3>
                        <p className="table-capacity">
                          <User size={14} />
                          {table.seats} Seats
                        </p>
                      </div>
                      <span className={`table-status ${table.status}`}>
                        {table.status === "available"
                          ? "Available"
                          : table.status === "booked"
                          ? "Booked"
                          : "Reserved"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* FOOTER NOTE */}
              <footer className="page-footer">
                <p>
                  Reservations are confirmed immediately. You will receive a
                  confirmation code upon successful booking.
                </p>
              </footer>
            </>
          )}
        </div>
      </div>

      {/* BOOKING MODAL - OUTSIDE MAIN CONTAINER */}
      {selectedTable && (
        <div 
          className="reservation-modal-overlay"
          onClick={() => {
            console.log("Overlay clicked");
            setSelectedTable(null);
          }}
        >
          <div 
            className="reservation-modal"
            onClick={(e) => {
              console.log("Modal clicked");
              e.stopPropagation();
            }}
          >
            <button
              className="reservation-modal-close"
              onClick={() => {
                console.log("Close button clicked");
                setSelectedTable(null);
              }}
              type="button"
            >
              <X size={20} />
            </button>

            <h2 className="reservation-modal-title">Complete Reservation</h2>
            <p className="reservation-modal-subtitle">
              Table {selectedTable.name} · Maximum {selectedTable.seats} guests
            </p>

            <div className="reservation-modal-summary">
              <div className="reservation-modal-summary-item">
                <Calendar size={16} />
                <span>{date}</span>
              </div>
              <div className="reservation-modal-summary-item">
                <Clock size={16} />
                <span>{timeSlot}</span>
              </div>
            </div>

            <div className="reservation-modal-form">
              <div className="form-group">
                <label htmlFor="modal-guests" className="form-label">
                  <User size={16} />
                  Number of Guests
                </label>
                <input
                  type="number"
                  id="modal-guests"
                  min="1"
                  max={selectedTable.seats}
                  className="form-input"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-occasion" className="form-label">
                  Special Occasion
                </label>
                <select
                  id="modal-occasion"
                  className="form-select"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                >
                  <option value="None">Regular Dining</option>
                  <option value="Birthday">Birthday Celebration</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Business Meeting">Business Meeting</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Other">Other Special Event</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modal-seating" className="form-label">
                  Seating Preference
                </label>
                <select
                  id="modal-seating"
                  className="form-select"
                  value={seatingPreference}
                  onChange={(e) => setSeatingPreference(e.target.value)}
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Window">Window View</option>
                  <option value="Corner">Corner Table</option>
                  <option value="Outdoor">Outdoor Seating</option>
                  <option value="Private">Private Area</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modal-request" className="form-label">
                  Special Requests
                </label>
                <textarea
                  id="modal-request"
                  className="form-textarea"
                  placeholder="Allergies, dietary restrictions, accessibility needs..."
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                />
              </div>

              {occasion !== "None" && (
                <div className="reservation-modal-package">
                  <h4 className="reservation-modal-package-title">
                    Special Occasion Package Includes:
                  </h4>
                  <ul className="reservation-modal-package-list">
                    <li>Complimentary cake or dessert</li>
                    <li>Table decoration</li>
                    <li>Special occasion card</li>
                    <li>Priority service</li>
                  </ul>
                </div>
              )}

              <button
                type="button"
                className="reservation-modal-submit"
                onClick={handleBooking}
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reservation;