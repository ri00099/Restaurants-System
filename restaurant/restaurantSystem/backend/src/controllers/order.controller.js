// const orderModel = require("../models/order.model");

// // Create final order
// // exports.createFinalOrder = async (req, res) => {
// //   try {
// //     const order = await orderModel.create(req.body);
// //     res.json({ success: true, order });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).send("Error creating final order");
// //   }
// // };

// exports.createFinalOrder = async (req, res) => {
//   try {
//     const { items, totalAmount, tableNumber } = req.body;

//     const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

//     const newOrder = await orderModel.create({
//       userId: req.user.userId,     // Taken from the Auth Token (The ID Card)
//       orderId: generatedOrderId,   
//       totalAmount: totalAmount,
//       tableNumber: tableNumber || 0,
//       status: "Pending"
//     });

//     res.json({ success: true, order: newOrder });

//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ 
//         success: false, 
//         message: "Error creating final order", 
//         error: error.message 
//     });
//   }
// };
// // Get single order by ID
// exports.getOrderById = async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     const order = await orderModel.findOne({ 
//       $or: [
//         { orderId: orderId },
//         { _id: orderId }
//       ]
//     });

//     if (!order) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Order not found" 
//       });
//     }

//     res.json({ success: true, order });
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Error fetching order" 
//     });
//   }
// };

// // Get all orders
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await orderModel.find().sort({ createdAt: -1 });
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, message: "Error fetching orders" });
//   }
// };

// // Get user's orders
// exports.getUserOrders = async (req, res) => {
//   try {
//     // For now, return all orders sorted by newest first
//     // const orders = await orderModel.find().sort({ createdAt: -1 });

//     const orders = await orderModel.find({ userId: req.user.userId }).sort({ createdAt: -1 }); // show only the required users order
//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     res.status(500).json({ success: false, message: "Error fetching orders" });
//   }
// };

// // Update order status
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const order = await orderModel.findOneAndUpdate(
//       { orderId: orderId },
//       { status: status },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     res.json({ success: true, order });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     res.status(500).json({ success: false, message: "Error updating order" });
//   }
// };

const orderModel = require("../models/order.model");

// 1. Create Order 
exports.createFinalOrder = async (req, res) => {
  try {
    const { items, totalAmount, tableNumber } = req.body;

    const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = await orderModel.create({
      userId: req.user.userId,   
      orderId: generatedOrderId,
      items: items,
      totalAmount: totalAmount,
      tableNumber: tableNumber,
      status: "Pending"
    });

    // Send notification email to restaurant
    try {
      const User = require("../models/user.model");
      const user = await User.findById(req.user.userId).select("name email phone");
      const { sendNewOrderNotification } = require("../utils/email.service");
      
      await sendNewOrderNotification(
        {
          orderId: generatedOrderId,
          items: items,
          totalAmount: totalAmount,
          tableNumber: tableNumber,
          instructions: req.body.instructions || "",
          createdAt: newOrder.createdAt
        },
        {
          name: user?.name || "Guest",
          email: user?.email || "",
          phone: user?.phone || ""
        }
      );
    } catch (emailError) {
      console.error("Failed to send order notification email:", emailError);
      // Don't fail the order if email fails
    }

    res.json({ success: true, message: "Order placed successfully", order: newOrder });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

// 2. Get User's Own Orders
exports.getUserOrders = async (req, res) => {
  try {
    // Filter by the ID inside the Token and populate user details
    const orders = await orderModel.find({ userId: req.user.userId })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate("userId", "name phone") // This adds the customer Name & Phone to the order!
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // Get ID from URL
    const { status } = req.body;    // Get new status (e.g. "Cooking") from Body

    // Find and update
    const order = await orderModel.findOneAndUpdate(
      { orderId: orderId },
      { status: status },
      { new: true } // Return the updated version
    ).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Send feedback email when order is completed
    if (status === "Completed" && order.userId) {
      const { sendOrderCompletionFeedback } = require("../utils/email.service");
      
      const orderData = {
        orderId: order.orderId,
        items: order.items,
        totalAmount: order.totalAmount,
        tableNumber: order.tableNumber
      };

      try {
        await sendOrderCompletionFeedback(
          order.userId.email,
          order.userId.name,
          orderData
        );
        console.log(`✅ Feedback email sent to ${order.userId.email} for completed order ${orderId}`);
      } catch (emailError) {
        console.error("Failed to send feedback email:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({ success: true, message: `Order status updated to ${status}`, order });

  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

// 5. Get Single Order
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Search by Readable ID (ORD-123)
    const order = await orderModel.findOne({ orderId: orderId });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};