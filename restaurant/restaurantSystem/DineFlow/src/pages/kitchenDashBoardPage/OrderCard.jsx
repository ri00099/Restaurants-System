// import React from "react";

// export default function OrderCard({ status, order, onAction }) {
//   return (
//     <div className={`order-card order-card-${status}`}>
//       <div className="order-card-top">
//         <h3 className="order-id">Order {order.id}</h3>
//         <span className="table-pill">Table {order.table}</span>
//       </div>

//       <ul className="order-items">
//         {order.items.map((item, idx) => (
//           <li key={idx}>
//             <span className="item-name">• {item.name}</span>
//             <span className="item-qty">x{item.qty}</span>
//           </li>
//         ))}
//       </ul>

//       <p className="order-time">{order.time}</p>

//       {onAction && (
//         <button
//           className={`order-action-btn btn-${status}`}
//           onClick={onAction}
//         >
//           {status === "pending" && "Start Cooking"}
//           {status === "inProgress" && "Mark Ready"}
//           {status === "ready" && "Mark Served"}
//         </button>
//       )}
//     </div>
//   );
// }

import React from "react";

export default function OrderCard({ status, order, onAction }) {
  
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hours ago`;
  };

  return (
    <div className={`order-card order-card-${status}`}>
      <div className="order-card-top">
        <h3 className="order-id">{order.orderId}</h3>
        <span className="table-pill">Table {order.tableNumber}</span>
      </div>

      {/* --- NEW SECTION: CUSTOMER INFO --- */}
      <div style={{ marginBottom: "10px", fontSize: "13px", color: "#555" }}>
        <strong>Customer: </strong> 
        {/* We use ?. to be safe in case userId is missing */}
        {order.userId?.name || "Guest User"} 
        <br />
        <span style={{ fontSize: "11px", color: "#888" }}>
           Ph: {order.userId?.phone || "N/A"}
        </span>
      </div>
      {/* ---------------------------------- */}

      <ul className="order-items">
        {(order.items || []).map((item, idx) => (
          <li key={idx}>
            <span className="item-name">• {item.name}</span>
            <span className="item-qty">x{item.quantity}</span>
          </li>
        ))}
      </ul>

      <p className="order-time">{getTimeAgo(order.createdAt)}</p>

      {onAction && (
        <button
          className={`order-action-btn btn-${status}`}
          onClick={onAction}
        >
          {status === "pending" && "Start Cooking"}
          {status === "inProgress" && "Mark Ready"}
          {status === "ready" && "Mark Served"}
        </button>
      )}
    </div>
  );
}