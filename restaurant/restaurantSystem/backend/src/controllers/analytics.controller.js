const Order = require("../models/order.model");

exports.getDashboardStats = async (req, res) => {
  try {
    
    const orders = await Order.find();
    const totalOrders = orders.length;
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    
    const monthlyRevenue = new Array(12).fill(0); // [0, 0, 0, 0, ... 12 times]

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const month = date.getMonth(); // 0 = Jan, 1 = Feb, etc.
      monthlyRevenue[month] += (order.totalAmount || 0);
    });
    
    const dailyOrders = new Array(7).fill(0); 

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const day = date.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
      dailyOrders[day] += 1;
    });

    const graphData = {
        revenueByMonth: [
            { name: "Jan", value: monthlyRevenue[0] },
            { name: "Feb", value: monthlyRevenue[1] },
            { name: "Mar", value: monthlyRevenue[2] },
            { name: "Apr", value: monthlyRevenue[3] },
            { name: "May", value: monthlyRevenue[4] },
            { name: "Jun", value: monthlyRevenue[5] },
            { name: "Jul", value: monthlyRevenue[6] },
            { name: "Aug", value: monthlyRevenue[7] },
            { name: "Sep", value: monthlyRevenue[8] },
            { name: "Oct", value: monthlyRevenue[9] },
            { name: "Nov", value: monthlyRevenue[10] },
            { name: "Dec", value: monthlyRevenue[11] },
        ],
        ordersByDay: [
            { name: "Sun", value: dailyOrders[0] },
            { name: "Mon", value: dailyOrders[1] },
            { name: "Tue", value: dailyOrders[2] },
            { name: "Wed", value: dailyOrders[3] },
            { name: "Thu", value: dailyOrders[4] },
            { name: "Fri", value: dailyOrders[5] },
            { name: "Sat", value: dailyOrders[6] },
        ]
    };

    // 4. Send the Final Report
    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        charts: graphData
      }
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};