import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const orderStatusOptions = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "SHIPPED",
  "DELIVERED",
];
const paymentStatusOptions = ["PENDING", "COLLECTED"];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [paymentUpdating, setPaymentUpdating] = useState(false);
  const [addressUpdating, setAddressUpdating] = useState(false);

  // Fetch order
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Admin access required");

      const res = await axios.get(
        `http://localhost:3000/api/admin-orders/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const fetchedOrder = res.data?.data || res.data?.order || res.data;
      if (!fetchedOrder) throw new Error("Order not found");

      // Update product details for each item
      const updatedItems = await Promise.all(
        (fetchedOrder.items || []).map(async (item) => {
          if (!item.productId) return item;
          try {
            const { data } = await axios.get(
              `http://localhost:3000/api/products/${item.productId}`
            );
            console.log(data.product);
            return { ...item, product: data.product };
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}:`, err);
            return item; // keep original if product fetch fails
          }
        })
      );

      setOrder({ ...fetchedOrder, items: updatedItems });
    } catch (err) {
      console.error("fetchOrder failed:", err);
      setError(
        err.response?.product?.message || err.message || "Failed to fetch order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // --- Functions for status, payment, address remain unchanged ---
  const handleStatusChange = async (newStatus) => {
    if (!order) return;
    try {
      setStatusUpdating(true);
      const token = localStorage.getItem("userToken");
      await axios.patch(
        `http://localhost:3000/api/admin-orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handlePaymentChange = async (newPayment) => {
    if (!order) return;
    try {
      setPaymentUpdating(true);
      const token = localStorage.getItem("userToken");
      await axios.patch(
        `http://localhost:3000/api/admin-orders/${id}/payment/collect`,
        { paymentStatus: newPayment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder({ ...order, payment: { ...order.payment, status: newPayment } });
    } catch (err) {
      console.error(err);
      alert("Failed to update payment status");
    } finally {
      setPaymentUpdating(false);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    if (!order) return;
    try {
      setAddressUpdating(true);
      const token = localStorage.getItem("userToken");
      await axios.patch(
        `http://localhost:3000/api/admin-orders/${id}/address`,
        { shippingAddress: order.shippingAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Shipping address updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update address");
    } finally {
      setAddressUpdating(false);
    }
  };

  if (loading) return <div>Loading order...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>No order found</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Order Details - {order.orderCode || "ORDXXXX"}
        </h2>
        <button
          onClick={() => navigate("/admin/orders")}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back to Orders
        </button>
      </div>

      {/* Order Info */}
      <div className="bg-white shadow rounded p-4 space-y-2">
        <h3 className="font-semibold text-lg">Order Info</h3>
        <p>
          Created At:{" "}
          {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
        </p>
        <p>
          Last Updated:{" "}
          {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "-"}
        </p>
        <div className="flex gap-4">
          <div>
            <label className="font-medium">Order Status:</label>
            <select
              value={order.status || "PENDING"}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusUpdating}
              className="ml-2 border border-border rounded px-2 py-1"
            >
              {orderStatusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-medium">Payment Status:</label>
            <select
              value={order.payment?.status || "PENDING"}
              onChange={(e) => handlePaymentChange(e.target.value)}
              disabled={paymentUpdating}
              className="ml-2 border border-border rounded px-2 py-1"
            >
              {paymentStatusOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold text-lg">User Info</h3>
        <p>
          <span className="font-medium">Name: </span>
          {order.user?.fullName || "N/A"}
        </p>
        <p>
          <span className="font-medium">Email: </span>
          {order.user?.email || "N/A"}
        </p>
      </div>

      {/* Shipping Address */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold text-lg">Shipping Address</h3>
        <form className="space-y-2" onSubmit={handleAddressUpdate}>
          {[
            "fullName",
            "phone",
            "division",
            "district",
            "thana",
            "postalCode",
            "streetAddress",
          ].map((field) => (
            <input
              key={field}
              type="text"
              value={order.shippingAddress?.[field] || ""}
              onChange={(e) =>
                setOrder({
                  ...order,
                  shippingAddress: {
                    ...order.shippingAddress,
                    [field]: e.target.value,
                  },
                })
              }
              placeholder={field}
              className="border border-border rounded px-2 py-1 w-full"
            />
          ))}
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={addressUpdating}
          >
            Save Address
          </button>
        </form>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <h3 className="font-semibold text-lg">Order Items</h3>
        <table className="min-w-full border border-border mt-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-border text-left">#</th>
              <th className="p-2 border border-border text-left">Product</th>
              <th className="p-2 border border-border text-left">Quantity</th>
              <th className="p-2 border border-border text-left">Price</th>
              <th className="p-2 border border-border text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => {
              const quantity = item.quantity ?? 0;
              const priceAmount = item.product?.price?.amount ?? 0;
              const priceCurrency = item.product?.price?.currency ?? "BDT";
              return (
                <tr key={item._id || idx} className="hover:bg-gray-50">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2 flex items-center gap-2">
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span>{item.product?.title || "Unknown Product"}</span>
                  </td>
                  <td className="p-2">{quantity}</td>
                  <td className="p-2">
                    {priceAmount} {priceCurrency === "BDT" && "৳"}
                  </td>
                  <td className="p-2">
                    {quantity * priceAmount} {priceCurrency === "BDT" && "৳"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold text-lg">Order Summary</h3>
        <p>
          Total Items:{" "}
          {order.items?.reduce((sum, i) => sum + (i.quantity ?? 0), 0)}
        </p>
        <p>
          Total Price:{" "}
          {order.items?.reduce(
            (sum, i) =>
              sum + (i.quantity ?? 0) * (i.product?.price?.amount ?? 0),
            0
          )}{" "}
          ৳
        </p>
        <p>Payment Method: {order.payment?.method ?? "N/A"}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
