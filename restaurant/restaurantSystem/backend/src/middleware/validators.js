const { body, param, query } = require('express-validator');

// Order validation rules
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Item price must be a positive number'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('tableNumber').notEmpty().withMessage('Table number is required')
];

// Payment validation rules
const paymentValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0')
];

// Payment verification validation
const verifyPaymentValidation = [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required')
];

// Reservation validation rules
const reservationValidation = [
  body('tableNumber').isInt({ min: 1, max: 10 }).withMessage('Valid table number (1-10) is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
  body('guests').isInt({ min: 1, max: 20 }).withMessage('Number of guests (1-20) is required'),
  body('specialRequest').optional().isString(),
  body('occasion').optional().isIn(['None', 'Birthday', 'Anniversary', 'Business Meeting', 'Proposal', 'Other']),
  body('seatingPreference').optional().isIn(['No Preference', 'Window', 'Corner', 'Outdoor', 'Private'])
];

// Auth validation rules
const signupValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const otpValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('otp').isLength({ min: 4, max: 6 }).withMessage('OTP must be 4-6 digits')
];

// Order status update validation
const statusUpdateValidation = [
  param('orderId').notEmpty().withMessage('Order ID is required'),
  body('status').isIn(['Pending', 'Preparing', 'Cooking', 'Ready', 'Completed', 'Cancelled']).withMessage('Invalid status')
];

module.exports = {
  orderValidation,
  paymentValidation,
  verifyPaymentValidation,
  reservationValidation,
  signupValidation,
  loginValidation,
  otpValidation,
  statusUpdateValidation
};
