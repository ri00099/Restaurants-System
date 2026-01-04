const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const { bookTable, getTableStatus, getMyReservations, cancelReservation, getAllReservations, updateReservationStatus, getAvailableTimeSlots } = require("../controllers/reservation.controller");
const { reservationValidation } = require("../middleware/validators");
const validateRequest = require("../middleware/validate.middleware");

// Book table
router.post("/book", verifyToken, reservationValidation, validateRequest, bookTable);

// Check table availability
router.get("/table-status", getTableStatus);

// Get available time slots for a specific date
router.get("/available-time-slots", getAvailableTimeSlots);

// Get user's reservations
router.get("/my-reservations", verifyToken, getMyReservations);

// Cancel a reservation
router.put("/cancel/:id", verifyToken, cancelReservation);

// Admin routes
router.get("/all-reservations", verifyToken, getAllReservations);
router.put("/update-status/:id", verifyToken, updateReservationStatus);

module.exports = router;