const Reservation = require("../models/reservation.model");
const User = require("../models/user.model");
const { sendReservationConfirmation, sendReservationCompletionEmail, sendReservationConfirmedByAdmin } = require("../utils/email.service");

// Generate unique confirmation code
const generateConfirmationCode = () => {
  return 'RES-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
};

exports.bookTable = async (req, res) => {
  try {
    const { tableNumber, date, timeSlot, guests, specialRequest, occasion, seatingPreference, preOrderItems } = req.body;

    // Validate table capacity
    const tableCapacity = {
      1: 2, 2: 4, 3: 6, 4: 2, 5: 4, 6: 6, 7: 2, 8: 4, 9: 6, 10: 8
    };
    
    if (guests > (tableCapacity[tableNumber] || 4)) {
      return res.status(400).json({ 
        success: false, 
        message: `Table ${tableNumber} only has ${tableCapacity[tableNumber]} seats. You requested ${guests} guests.` 
      });
    }

    // Check if table already booked
    const existing = await Reservation.findOne({ tableNumber, date, timeSlot, status: { $in: ['Reserved', 'Booked', 'Confirmed'] } });
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: `Table ${tableNumber} is already ${existing.status} for this time` 
      });
    }

    const confirmationCode = generateConfirmationCode();

    const newReservation = await Reservation.create({
      userId: req.user.userId,
      tableNumber,
      date,
      timeSlot,
      guests,
      specialRequest: specialRequest || "",
      occasion: occasion || "None",
      seatingPreference: seatingPreference || "No Preference",
      preOrderItems: preOrderItems || [],
      status: "Reserved",
      confirmationCode
    });

    // Get user email and send confirmation
    const user = await User.findById(req.user.userId);
    if (user && user.email) {
      const reservationData = {
        tableNumber,
        date,
        timeSlot,
        guests,
        confirmationCode,
        occasion: occasion || "None",
        seatingPreference: seatingPreference || "No Preference",
        specialRequest: specialRequest || ""
      };
      
      // Send confirmation to user
      await sendReservationConfirmation(user.email, reservationData);
      
      // Send notification to admin/restaurant
      const { sendReservationNotificationToAdmin } = require("../utils/email.service");
      await sendReservationNotificationToAdmin(
        reservationData,
        {
          name: user.name || "Guest",
          email: user.email || "",
          phone: user.phone || ""
        }
      );
    }

    res.json({ 
      success: true, 
      message: "Reservation confirmed! Check your email for details.", 
      reservation: newReservation,
      confirmationCode 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

exports.getTableStatus = async (req, res) => {
  try {
    const { date, timeSlot } = req.query;

    // Get all bookings for this specific time from DB
    const busyTables = await Reservation.find({ 
      date, 
      timeSlot,
      status: { $in: ['Reserved', 'Booked', 'Confirmed'] }
    });
    const allTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const result = allTables.map(tableNum => {
      const found = busyTables.find(b => b.tableNumber === tableNum);
      
      return {
        tableNumber: tableNum,
        status: found ? found.status : "Available",
        seats: [1,4,7].includes(tableNum) ? 2 : [2,5,8].includes(tableNum) ? 4 : 6
      };
    });

    res.json({ success: true, data: result });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching status" });
  }
};

// Get user's reservations
exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.userId })
      .sort({ date: -1, timeSlot: -1 });
    
    res.json({ success: true, reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reservations" });
  }
};

// Get all reservations (Admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("userId", "name email phone")
      .sort({ date: -1, createdAt: -1 });
    
    res.json({ success: true, reservations });
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    res.status(500).json({ success: false, message: "Error fetching reservations" });
  }
};

// Update reservation status (Admin only)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const reservation = await Reservation.findById(id).populate("userId", "name email");
    
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }
    
    reservation.status = status;
    await reservation.save();
    
    // Send email notifications based on status change
    if (reservation.userId && reservation.userId.email) {
      const reservationData = {
        tableNumber: reservation.tableNumber,
        date: reservation.date,
        timeSlot: reservation.timeSlot,
        guests: reservation.guests,
        confirmationCode: reservation.confirmationCode,
        occasion: reservation.occasion || "None"
      };
      
      // Send confirmation email when status is set to "Confirmed"
      if (status === "Confirmed") {
        await sendReservationConfirmedByAdmin(reservation.userId.email, reservationData);
        console.log(`✅ Confirmation email sent to ${reservation.userId.email}`);
      }
      
      // Send completion email when status is set to "Completed"
      if (status === "Completed") {
        await sendReservationCompletionEmail(reservation.userId.email, reservationData);
        console.log(`✅ Completion email sent to ${reservation.userId.email}`);
      }
    }
    
    res.json({ success: true, message: "Reservation status updated", reservation });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

// Cancel reservation
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reservation = await Reservation.findOne({ _id: id, userId: req.user.userId });
    
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }
    
    if (reservation.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: "Already cancelled" });
    }
    
    reservation.status = 'Cancelled';
    await reservation.save();
    
    res.json({ success: true, message: "Reservation cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error cancelling reservation" });
  }
};

// Get available time slots for a specific date
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }
    
    // All possible time slots
    const allTimeSlots = [
      { value: "12:00", label: "12:00 PM - Lunch" },
      { value: "13:00", label: "01:00 PM - Lunch" },
      { value: "14:00", label: "02:00 PM - Afternoon" },
      { value: "19:00", label: "07:00 PM - Dinner" },
      { value: "20:00", label: "08:00 PM - Dinner" },
      { value: "21:00", label: "09:00 PM - Late Dinner" }
    ];
    
    // Get all reservations for the given date
    const reservations = await Reservation.find({ 
      date, 
      status: { $in: ['Reserved', 'Booked', 'Confirmed'] }
    });
    
    // Count how many tables are booked per time slot
    const timeSlotBookings = {};
    reservations.forEach(res => {
      if (!timeSlotBookings[res.timeSlot]) {
        timeSlotBookings[res.timeSlot] = 0;
      }
      timeSlotBookings[res.timeSlot]++;
    });
    
    // Total tables available
    const totalTables = 10;
    
    // Filter out fully booked time slots
    const availableTimeSlots = allTimeSlots.filter(slot => {
      const bookedCount = timeSlotBookings[slot.value] || 0;
      return bookedCount < totalTables; // If less than all tables are booked, slot is available
    });
    
    res.json({ 
      success: true, 
      availableSlots: availableTimeSlots,
      allSlots: allTimeSlots
    });
    
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    res.status(500).json({ success: false, message: "Error fetching available time slots" });
  }
};