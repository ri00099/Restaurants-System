const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send OTP Email
const sendEmailOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Restaurant App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP for login is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP Email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
};

// Send Contact/Feedback Email to Restaurant
const sendContactEmail = async (name, email, subject, message) => {
  try {
    const transporter = createTransporter();
    
    const restaurantEmail = process.env.RESTAURANT_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"Restaurant Contact Form" <${process.env.EMAIL_USER}>`,
      to: restaurantEmail,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #e74c3c; border-bottom: 3px solid #e74c3c; padding-bottom: 10px;">New Contact/Feedback Message</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #e74c3c; margin: 20px 0;">
              <p style="margin: 0;"><strong>Message:</strong></p>
              <p style="margin-top: 10px; line-height: 1.6;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px;">
              <p>This email was sent from the restaurant contact form.</p>
              <p>Reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact email sent to restaurant from ${email}`);
    return true;
  } catch (error) {
    console.error("Contact email send failed:", error);
    return false;
  }
};

// Send Reservation Confirmation Email to User
const sendReservationConfirmation = async (userEmail, reservationData) => {
  try {
    const transporter = createTransporter();
    
    const { tableNumber, date, timeSlot, guests, confirmationCode, occasion, seatingPreference } = reservationData;
    
    // Format date
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const mailOptions = {
      from: `"Restaurant Reservations" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Reservation Confirmed - Table ${tableNumber} | ${confirmationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Reservation Confirmed!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Dear Valued Guest,</p>
              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                Thank you for choosing our restaurant! Your table reservation has been successfully confirmed.
              </p>
              
              <!-- Reservation Details -->
              <div style="background-color: #f9f9f9; border-left: 4px solid #e74c3c; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <h3 style="color: #e74c3c; margin-top: 0;">Reservation Details</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Confirmation Code:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 18px; color: #e74c3c;">${confirmationCode}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Table Number:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold;">Table ${tableNumber}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Date:</td>
                    <td style="padding: 10px 0; color: #333;">${formattedDate}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Time:</td>
                    <td style="padding: 10px 0; color: #333;">${timeSlot}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Number of Guests:</td>
                    <td style="padding: 10px 0; color: #333;">${guests} ${guests > 1 ? 'people' : 'person'}</td>
                  </tr>
                  ${occasion && occasion !== 'None' ? `
                  <tr style="border-top: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Occasion:</td>
                    <td style="padding: 10px 0; color: #333;">${occasion}</td>
                  </tr>
                  ` : ''}
                  ${seatingPreference && seatingPreference !== 'No Preference' ? `
                  <tr style="border-top: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Seating Preference:</td>
                    <td style="padding: 10px 0; color: #333;">${seatingPreference}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <!-- Important Info -->
              <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;"><strong>📌 Important:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
                  <li>Please arrive 10 minutes before your scheduled time</li>
                  <li>Keep your confirmation code handy</li>
                  <li>For any changes, please contact us at least 2 hours in advance</li>
                </ul>
              </div>
              
              <!-- Contact Info -->
              <div style="margin-top: 30px; padding: 20px; background-color: #f0f0f0; border-radius: 5px; text-align: center;">
                <p style="margin: 5px 0; color: #666;">📞 <strong>Phone:</strong> +91-7378021327</p>
                <p style="margin: 5px 0; color: #666;">📧 <strong>Email:</strong> ${process.env.RESTAURANT_EMAIL || 'info@restaurant.com'}</p>
                <p style="margin: 5px 0; color: #666;">📍 <strong>Address:</strong> Graphura India Pvt Ltd, Pataudi, Gurgaon</p>
              </div>
              
              <p style="margin-top: 30px; color: #333; text-align: center;">
                We look forward to serving you!<br/>
                <strong style="color: #e74c3c;">The Restaurant Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0;">This is an automated confirmation email. Please do not reply.</p>
              <p style="margin: 5px 0;">© 2025 Restaurant. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reservation confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Reservation confirmation email send failed:", error);
    return false;
  }
};

// Send Reservation Notification to Admin/Restaurant
const sendReservationNotificationToAdmin = async (reservationData, userDetails) => {
  try {
    const transporter = createTransporter();
    
    const restaurantEmail = process.env.RESTAURANT_EMAIL || process.env.EMAIL_USER;
    const { tableNumber, date, timeSlot, guests, confirmationCode, occasion, seatingPreference, specialRequest } = reservationData;
    
    // Format date
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const mailOptions = {
      from: `"Restaurant Reservations" <${process.env.EMAIL_USER}>`,
      to: restaurantEmail,
      subject: `🎯 New Reservation - Table ${tableNumber} | ${confirmationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 700px; margin: 0 auto; background-color: white; padding: 0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎯 New Table Reservation</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <div style="background-color: #ddd6fe; border-left: 4px solid #8b5cf6; padding: 15px; margin-bottom: 25px; border-radius: 5px;">
                <p style="margin: 0; color: #5b21b6; font-size: 16px;"><strong>📅 New reservation confirmed - Table needs to be prepared</strong></p>
              </div>

              <!-- Reservation Details -->
              <div style="background-color: #f9f9f9; border-left: 4px solid #8b5cf6; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <h3 style="color: #8b5cf6; margin-top: 0;">Reservation Information</h3>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666; font-weight: bold; width: 180px;">Confirmation Code:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 18px; color: #8b5cf6;">${confirmationCode}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Table Number:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 16px;">Table ${tableNumber}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Date:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold;">${formattedDate}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Time Slot:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 16px;">${timeSlot}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Number of Guests:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold;">${guests} ${guests > 1 ? 'people' : 'person'}</td>
                  </tr>
                </table>
              </div>

              <!-- Customer Details -->
              <div style="background-color: #fff; border: 1px solid #d1d5db; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">👤 Customer Information</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666; width: 180px;">Customer Name:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold;">${userDetails.name || 'Guest'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Email:</td>
                    <td style="padding: 10px 0; color: #333;"><a href="mailto:${userDetails.email}" style="color: #8b5cf6; text-decoration: none;">${userDetails.email || 'N/A'}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Phone:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold;"><a href="tel:${userDetails.phone}" style="color: #8b5cf6; text-decoration: none;">${userDetails.phone || 'N/A'}</a></td>
                  </tr>
                </table>
              </div>

              ${occasion && occasion !== 'None' ? `
              <!-- Occasion -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #92400e;"><strong>🎉 Special Occasion:</strong> ${occasion}</p>
              </div>
              ` : ''}

              ${seatingPreference && seatingPreference !== 'No Preference' ? `
              <!-- Seating Preference -->
              <div style="background-color: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #075985;"><strong>💺 Seating Preference:</strong> ${seatingPreference}</p>
              </div>
              ` : ''}

              ${specialRequest ? `
              <!-- Special Request -->
              <div style="background-color: #fff; border: 1px solid #d1d5db; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">📝 Special Requests</h3>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${specialRequest}</p>
                </div>
              </div>
              ` : ''}

              <!-- Action Section -->
              <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: white; font-size: 16px; font-weight: bold;">
                  ✅ Please prepare Table ${tableNumber} for ${guests} ${guests > 1 ? 'guests' : 'guest'}
                </p>
                <p style="margin: 10px 0 0 0; color: white; font-size: 14px;">
                  ${formattedDate} at ${timeSlot}
                </p>
                ${userDetails.phone ? `
                <p style="margin: 10px 0 0 0; color: white; font-size: 14px;">
                  Contact: <a href="tel:${userDetails.phone}" style="color: white; text-decoration: underline;">${userDetails.phone}</a>
                </p>
                ` : ''}
              </div>

              <!-- View in Dashboard -->
              <div style="text-align: center; margin-top: 25px;">
                <p style="margin: 0; color: #666; font-size: 14px;">View this reservation in the Admin Dashboard to manage status</p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0;">This is an automated reservation notification from your restaurant management system.</p>
              <p style="margin: 5px 0;">© 2025 Restaurant. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Reservation notification sent to restaurant for ${confirmationCode}`);
    return true;
  } catch (error) {
    console.error("Reservation notification email send failed:", error);
    return false;
  }
};

// Send New Order Notification to Restaurant
const sendNewOrderNotification = async (orderData, userDetails) => {
  try {
    const transporter = createTransporter();
    
    const restaurantEmail = process.env.RESTAURANT_EMAIL || process.env.EMAIL_USER;
    const { orderId, items, totalAmount, tableNumber, instructions, createdAt } = orderData;
    
    // Format items list
    const itemsList = items.map(item => 
      `<tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 10px;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    const mailOptions = {
      from: `"Restaurant Orders" <${process.env.EMAIL_USER}>`,
      to: restaurantEmail,
      subject: `🔔 New Order ${orderId} - Table ${tableNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 700px; margin: 0 auto; background-color: white; padding: 0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔔 New Order Received!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 5px;">
                <p style="margin: 0; color: #92400e; font-size: 16px;"><strong>⚡ Action Required:</strong> New order needs preparation</p>
              </div>

              <!-- Order Details -->
              <div style="background-color: #f9f9f9; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <h3 style="color: #f59e0b; margin-top: 0;">Order Information</h3>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">Order ID:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 18px; color: #f59e0b;">${orderId}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Table Number:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold;">Table ${tableNumber}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Customer Name:</td>
                    <td style="padding: 10px 0; color: #333;">${userDetails.name || 'Guest'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Customer Email:</td>
                    <td style="padding: 10px 0; color: #333;">${userDetails.email || 'N/A'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666;">Customer Phone:</td>
                    <td style="padding: 10px 0; color: #333;">${userDetails.phone || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666;">Order Time:</td>
                    <td style="padding: 10px 0; color: #333;">${new Date(createdAt).toLocaleString('en-US', { 
                      weekday: 'short',
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                  </tr>
                </table>

                ${instructions ? `
                <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 5px; margin-top: 15px;">
                  <p style="margin: 0; color: #856404;"><strong>📝 Special Instructions:</strong></p>
                  <p style="margin: 5px 0 0 0; color: #856404;">${instructions}</p>
                </div>
                ` : ''}
              </div>

              <!-- Items Table -->
              <h3 style="color: #333; margin-bottom: 15px;">Order Items</h3>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                <thead>
                  <tr style="background-color: #f59e0b; color: white;">
                    <th style="padding: 12px; text-align: left;">Item</th>
                    <th style="padding: 12px; text-align: center;">Qty</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                    <th style="padding: 12px; text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                  <tr style="background-color: #fef3c7; font-weight: bold;">
                    <td colspan="3" style="padding: 15px; text-align: right; font-size: 18px;">Total Amount:</td>
                    <td style="padding: 15px; text-align: right; font-size: 20px; color: #f59e0b;">₹${totalAmount}</td>
                  </tr>
                </tbody>
              </table>

              <!-- Action Section -->
              <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: white; font-size: 16px; font-weight: bold;">
                  👨‍🍳 Please start preparing this order immediately
                </p>
                <p style="margin: 10px 0 0 0; color: white; font-size: 14px;">
                  Update order status in the kitchen dashboard
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0;">This is an automated order notification from your restaurant management system.</p>
              <p style="margin: 5px 0;">© 2025 Restaurant. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 New order notification sent to restaurant for order ${orderId}`);
    return true;
  } catch (error) {
    console.error("Order notification email send failed:", error);
    return false;
  }
};

// Send Online Order Inquiry Email to Restaurant
const sendOnlineOrderInquiry = async (name, email, phone, message) => {
  try {
    const transporter = createTransporter();
    
    const restaurantEmail = process.env.RESTAURANT_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"Restaurant Online Orders" <${process.env.EMAIL_USER}>`,
      to: restaurantEmail,
      replyTo: email,
      subject: `🛒 New Online Order Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🛒 New Order Inquiry</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
              <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin-bottom: 25px; border-radius: 5px;">
                <p style="margin: 0; color: #065f46; font-size: 16px;"><strong>📞 Customer wants to place an order</strong></p>
              </div>

              <!-- Customer Details -->
              <div style="background-color: #f9f9f9; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 5px;">
                <h3 style="color: #10b981; margin-top: 0;">Customer Information</h3>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">👤 Name:</td>
                    <td style="padding: 10px 0; color: #333; font-size: 16px;">${name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">📧 Email:</td>
                    <td style="padding: 10px 0; color: #333;"><a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #666; font-weight: bold;">📱 Phone:</td>
                    <td style="padding: 10px 0; color: #333; font-weight: bold; font-size: 16px;"><a href="tel:${phone}" style="color: #10b981; text-decoration: none;">${phone}</a></td>
                  </tr>
                </table>
              </div>

              <!-- Order Details -->
              <div style="background-color: #fff; border: 1px solid #d1d5db; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">📝 Order Details / Message</h3>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${message || 'No additional details provided.'}</p>
                </div>
              </div>

              <!-- Action Section -->
              <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: white; font-size: 16px; font-weight: bold;">
                  📞 Please contact the customer to confirm their order
                </p>
                <p style="margin: 10px 0 0 0; color: white; font-size: 14px;">
                  Call: <a href="tel:${phone}" style="color: white; text-decoration: underline;">${phone}</a> | Email: <a href="mailto:${email}" style="color: white; text-decoration: underline;">${email}</a>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #333; padding: 20px; text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from your restaurant online ordering system.</p>
              <p style="margin: 5px 0;">© 2025 Restaurant. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Online order inquiry email sent to restaurant from ${name}`);
    return true;
  } catch (error) {
    console.error("Online order inquiry email send failed:", error);
    return false;
  }
};

// Send Admin Confirmation Email to User
const sendReservationConfirmedByAdmin = async (userEmail, reservationData) => {
  try {
    const transporter = createTransporter();
    
    const { tableNumber, date, timeSlot, guests, confirmationCode, occasion } = reservationData;
    
    // Format date
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const mailOptions = {
      from: `"Restaurant Reservations" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Reservation Confirmed by Restaurant - ${confirmationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3498db; margin: 0;">✅ Reservation Confirmed!</h1>
              <p style="color: #555; font-size: 16px; margin-top: 10px;">Your reservation has been confirmed by our restaurant</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Confirmation Code</p>
              <h2 style="margin: 10px 0 0 0; font-size: 28px; letter-spacing: 2px;">${confirmationCode}</h2>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Reservation Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Table Number:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">Table ${tableNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Date:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Time Slot:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Number of Guests:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${guests}</td>
                </tr>
                ${occasion && occasion !== 'None' ? `
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Occasion:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${occasion}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
              <p style="margin: 0; color: #155724; line-height: 1.6;">
                <strong>✅ Great News!</strong><br>
                Your reservation has been confirmed by our restaurant staff. We're looking forward to welcoming you!
              </p>
            </div>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
              <p style="margin: 0; color: #856404;"><strong>📌 Reminder:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
                <li>Please arrive 10-15 minutes before your scheduled time</li>
                <li>Keep this confirmation code ready</li>
                <li>Contact us for any changes or cancellations</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #777; font-size: 14px; margin: 5px 0;">Thank you for choosing our restaurant!</p>
              <p style="color: #999; font-size: 12px; margin: 5px 0;">This is an automated confirmation email</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Admin confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Admin confirmation email send failed:", error);
    return false;
  }
};

// Send Reservation Completion Email to User
const sendReservationCompletionEmail = async (userEmail, reservationData) => {
  try {
    const transporter = createTransporter();
    
    const { tableNumber, date, timeSlot, guests, confirmationCode, occasion } = reservationData;
    
    // Format date
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const mailOptions = {
      from: `"Restaurant Reservations" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Thank You for Dining With Us! - Reservation ${confirmationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #27ae60; margin: 0;">✅ Reservation Completed</h1>
              <p style="color: #555; font-size: 16px; margin-top: 10px;">Thank you for dining with us!</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Confirmation Code</p>
              <h2 style="margin: 10px 0 0 0; font-size: 28px; letter-spacing: 2px;">${confirmationCode}</h2>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #27ae60; padding-bottom: 10px;">Reservation Details</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Table Number:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">Table ${tableNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Date:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Time Slot:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Number of Guests:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${guests}</td>
                </tr>
                ${occasion && occasion !== 'None' ? `
                <tr>
                  <td style="padding: 10px 0; color: #666;"><strong>Occasion:</strong></td>
                  <td style="padding: 10px 0; color: #333; text-align: right;">${occasion}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60; margin-bottom: 20px;">
              <p style="margin: 0; color: #333; line-height: 1.6;">
                <strong>We hope you enjoyed your dining experience!</strong><br>
                Your feedback is valuable to us. We look forward to serving you again soon.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #777; font-size: 14px; margin: 5px 0;">Thank you for choosing our restaurant</p>
              <p style="color: #999; font-size: 12px; margin: 5px 0;">This is an automated confirmation email</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Reservation completion email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Reservation completion email send failed:", error);
    return false;
  }
};

// Send Order Ready Notification to User
const sendOrderReadyNotification = async (userEmail, userName, orderData) => {
  try {
    const transporter = createTransporter();
    
    const { orderId, items, totalAmount, tableNumber } = orderData;

    // Build menu items list
    let menuItemsHTML = '';
    if (items && items.length > 0) {
      menuItemsHTML = items.map(item => `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px 8px; color: #333;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px; margin-right: 8px; vertical-align: middle;">` : ''}
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 12px 8px; color: #666; text-align: center;">×${item.quantity}</td>
          <td style="padding: 12px 8px; color: #333; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('');
    }

    const mailOptions = {
      from: `"Graphura Restaurant" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🍽️ Your Order is Ready! Order ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 650px; margin: 0 auto; background-color: white; padding: 0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 35px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 30px;">🍽️ Order Ready!</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Your delicious food is ready for pickup</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 35px 30px;">
              <p style="font-size: 17px; color: #333; margin-bottom: 25px;">Dear <strong>${userName || 'Valued Guest'}</strong>,</p>
              
              <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 25px;">
                Great news! Your order is now <strong style="color: #10b981;">ready for pickup</strong> at <strong>Graphura Restaurant</strong>. 🎉
              </p>

              <!-- Order Summary -->
              <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 20px; border-radius: 10px; margin: 25px 0; border: 2px solid #10b981;">
                <h3 style="color: #10b981; margin: 0 0 15px 0; font-size: 18px;">📋 Order Details</h3>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Order ID:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right; font-size: 15px;">${orderId}</td>
                  </tr>
                  ${tableNumber ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Pickup Location:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right; font-size: 15px;">Table ${tableNumber}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Ready Time:</td>
                    <td style="padding: 8px 0; color: #333; text-align: right; font-size: 14px;">${new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</td>
                  </tr>
                </table>
              </div>

              <!-- Menu Items -->
              ${items && items.length > 0 ? `
              <div style="background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; margin: 25px 0; overflow: hidden;">
                <div style="background-color: #f9f9f9; padding: 15px; border-bottom: 2px solid #10b981;">
                  <h3 style="color: #333; margin: 0; font-size: 18px;">🍽️ Your Order</h3>
                </div>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #fafafa; border-bottom: 2px solid #e0e0e0;">
                      <th style="padding: 12px 8px; color: #666; font-weight: 600; text-align: left; font-size: 13px;">ITEM</th>
                      <th style="padding: 12px 8px; color: #666; font-weight: 600; text-align: center; font-size: 13px;">QTY</th>
                      <th style="padding: 12px 8px; color: #666; font-weight: 600; text-align: right; font-size: 13px;">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${menuItemsHTML}
                  </tbody>
                  <tfoot>
                    <tr style="background-color: #f0f0f0; border-top: 2px solid #10b981;">
                      <td colspan="2" style="padding: 15px 8px; color: #333; font-weight: bold; font-size: 16px; text-align: right;">Total Amount:</td>
                      <td style="padding: 15px 8px; color: #10b981; font-weight: bold; font-size: 18px; text-align: right;">₹${totalAmount ? totalAmount.toFixed(2) : '0.00'}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              ` : ''}

              <!-- Pickup Instructions -->
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 25px 0;">
                <h3 style="color: #d97706; margin: 0 0 12px 0; font-size: 17px;">📍 Pickup Instructions</h3>
                <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.8;">
                  <li>Please come to the ${tableNumber ? `<strong>Table ${tableNumber}</strong>` : '<strong>pickup counter</strong>'}</li>
                  <li>Show this email or mention Order ID: <strong>${orderId}</strong></li>
                  <li>Enjoy your meal! 😊</li>
                </ul>
              </div>

              <!-- Contact Information -->
              <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; text-align: center; border: 1px solid #e0e0e0;">
                <h3 style="color: #333; margin: 0 0 12px 0; font-size: 16px;">📍 Graphura Restaurant</h3>
                <p style="margin: 6px 0; color: #666; font-size: 13px;">📞 <strong>Phone:</strong> +91-7378021327</p>
                <p style="margin: 6px 0; color: #666; font-size: 13px;">🏢 <strong>Address:</strong> Graphura India Pvt Ltd, Pataudi, Gurgaon</p>
              </div>

              <!-- Closing -->
              <p style="margin-top: 30px; color: #333; text-align: center; font-size: 15px; line-height: 1.6;">
                Thank you for choosing us!<br/>
                <strong style="color: #10b981; font-size: 16px;">The Graphura Restaurant Team 🍽️</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #2c3e50; padding: 20px; text-align: center; color: #bdc3c7;">
              <p style="margin: 0; font-size: 12px;">This is an automated notification for order ${orderId}.</p>
              <p style="margin: 8px 0; font-size: 11px;">© 2025 Graphura Restaurant. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Order ready notification sent to ${userEmail} for order ${orderId}`);
    return true;
  } catch (error) {
    console.error("Order ready notification email send failed:", error);
    return false;
  }
};

// Send Order Completion Feedback Request to User
const sendOrderCompletionFeedback = async (userEmail, userName, orderData) => {
  try {
    const transporter = createTransporter();
    
    const { orderId, items, totalAmount, tableNumber } = orderData;

    // Build menu items list
    let menuItemsHTML = '';
    if (items && items.length > 0) {
      menuItemsHTML = items.map(item => `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px 8px; color: #333;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px; vertical-align: middle;">` : ''}
            <strong>${item.name}</strong>
            ${item.instructions ? `<br><span style="color: #888; font-size: 12px;">Note: ${item.instructions}</span>` : ''}
          </td>
          <td style="padding: 12px 8px; color: #666; text-align: center;">×${item.quantity}</td>
          <td style="padding: 12px 8px; color: #333; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('');
    }

    const mailOptions = {
      from: `"Graphura Restaurant" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Thank You for Dining at Graphura Restaurant! 🍽️ Order ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 650px; margin: 0 auto; background-color: white; padding: 0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); padding: 35px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 30px;">✨ Thank You!</h1>
              <p style="color: #e8f5e9; margin: 10px 0 0 0; font-size: 16px;">We hope you enjoyed your meal at Graphura Restaurant</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 35px 30px;">
              <p style="font-size: 17px; color: #333; margin-bottom: 25px;">Dear <strong>${userName || 'Valued Guest'}</strong>,</p>
              
              <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 25px;">
                Thank you for dining with us at <strong>Graphura Restaurant</strong>! We hope you had a wonderful experience. 
                Your order has been completed, and we'd love to hear about your dining experience.
              </p>

              <!-- Order Summary -->
              <div style="background: linear-gradient(135deg, #e8f5e9 0%, #d5f4e6 100%); padding: 20px; border-radius: 10px; margin: 25px 0; border: 2px solid #27ae60;">
                <h3 style="color: #27ae60; margin: 0 0 15px 0; font-size: 18px;">📋 Your Order Summary</h3>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Order ID:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right; font-size: 15px;">${orderId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Table Number:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: bold; text-align: right; font-size: 15px;">Table ${tableNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Date:</td>
                    <td style="padding: 8px 0; color: #333; text-align: right; font-size: 14px;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                </table>
              </div>

              <!-- Menu Items Ordered -->
              ${items && items.length > 0 ? `
              <div style="background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; margin: 25px 0; overflow: hidden;">
                <div style="background-color: #f9f9f9; padding: 15px; border-bottom: 2px solid #27ae60;">
                  <h3 style="color: #333; margin: 0; font-size: 18px;">🍽️ Items You Ordered</h3>
                </div>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #fafafa; border-bottom: 2px solid #e0e0e0;">
                      <th style="padding: 12px 8px; color: #666; font-weight: 600; text-align: left; font-size: 13px;">ITEM</th>
                      <th style="padding: 12px 8px; color: #666; font-weight: 600; text-align: center; font-size: 13px;">QTY</th>
                      <th style="padding: 12px 8px; color: #666; font-weight: 600; text-align: right; font-size: 13px;">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${menuItemsHTML}
                  </tbody>
                  <tfoot>
                    <tr style="background-color: #f0f0f0; border-top: 2px solid #27ae60;">
                      <td colspan="2" style="padding: 15px 8px; color: #333; font-weight: bold; font-size: 16px; text-align: right;">Total Amount:</td>
                      <td style="padding: 15px 8px; color: #27ae60; font-weight: bold; font-size: 18px; text-align: right;">₹${totalAmount ? totalAmount.toFixed(2) : '0.00'}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              ` : ''}

              <!-- Feedback Request -->
              <div style="background: linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%); padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 5px solid #f39c12; text-align: center;">
                <h3 style="color: #d68910; margin: 0 0 15px 0; font-size: 20px;">💬 We Value Your Feedback!</h3>
                <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 15px 0;">
                  Your opinion matters to us! Please take a moment to share your dining experience. 
                  How was the food quality, service, and ambiance? Any suggestions to make your next visit even better?
                </p>
                <p style="color: #666; font-size: 14px; margin: 15px 0 20px 0;">
                  Reply to this email with your feedback and rating (1-5 stars ⭐)
                </p>
                <div style="margin-top: 20px;">
                  <a href="mailto:${process.env.RESTAURANT_EMAIL || process.env.EMAIL_USER}?subject=Feedback for Order ${orderId}" 
                     style="display: inline-block; background: linear-gradient(135deg, #f39c12 0%, #d68910 100%); 
                     color: white; padding: 14px 35px; text-decoration: none; border-radius: 25px; 
                     font-weight: bold; font-size: 15px; box-shadow: 0 3px 8px rgba(0,0,0,0.2);">
                    📝 Share Your Feedback
                  </a>
                </div>
              </div>

              <!-- Special Offer -->
              <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; border: 2px dashed #27ae60; text-align: center; margin: 25px 0;">
                <h3 style="color: #27ae60; margin: 0 0 10px 0; font-size: 18px;">🎁 Special Offer for You!</h3>
                <p style="color: #333; margin: 10px 0; font-size: 14px; line-height: 1.6;">
                  Visit us again and get <strong style="color: #27ae60; font-size: 16px;">10% OFF</strong> on your next order!<br>
                  <span style="color: #666; font-size: 13px;">Just mention this email at checkout. Valid for 30 days.</span>
                </p>
              </div>

              <!-- Contact Information -->
              <div style="margin-top: 35px; padding: 25px; background-color: #f9f9f9; border-radius: 8px; text-align: center; border: 1px solid #e0e0e0;">
                <h3 style="color: #333; margin: 0 0 15px 0; font-size: 17px;">📍 Graphura Restaurant</h3>
                <p style="margin: 8px 0; color: #666; font-size: 14px;">📞 <strong>Phone:</strong> +91-7378021327</p>
                <p style="margin: 8px 0; color: #666; font-size: 14px;">📧 <strong>Email:</strong> ${process.env.RESTAURANT_EMAIL || 'info@graphura.com'}</p>
                <p style="margin: 8px 0; color: #666; font-size: 14px;">🏢 <strong>Address:</strong> Graphura India Pvt Ltd, Pataudi, Gurgaon</p>
                <p style="margin: 15px 0 0 0; color: #888; font-size: 13px; font-style: italic;">
                  Follow us on social media for exclusive offers and updates!
                </p>
              </div>

              <!-- Closing -->
              <p style="margin-top: 35px; color: #333; text-align: center; font-size: 15px; line-height: 1.6;">
                We look forward to serving you again soon!<br/>
                <strong style="color: #27ae60; font-size: 16px;">The Graphura Restaurant Team 🍽️</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #2c3e50; padding: 25px; text-align: center; color: #bdc3c7;">
              <p style="margin: 0; font-size: 13px;">This is an automated email confirming your order completion.</p>
              <p style="margin: 8px 0; font-size: 12px;">© 2025 Graphura Restaurant. All rights reserved.</p>
              <p style="margin: 8px 0; font-size: 11px; color: #95a5a6;">
                You're receiving this email because you placed an order at our restaurant.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Order completion feedback email sent to ${userEmail} for order ${orderId}`);
    return true;
  } catch (error) {
    console.error("Order completion feedback email send failed:", error);
    return false;
  }
};

module.exports = {
  sendEmailOTP,
  sendContactEmail,
  sendReservationConfirmation,
  sendReservationNotificationToAdmin,
  sendNewOrderNotification,
  sendOnlineOrderInquiry,
  sendReservationCompletionEmail,
  sendReservationConfirmedByAdmin,
  sendOrderCompletionFeedback
};