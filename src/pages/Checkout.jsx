// src/pages/Checkout.jsx
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";

const API_BASE = "https://digitalhat-server.onrender.com";
const CHECKOUT_KEY = "app_checkout_state";
const divisions = [
  "Select Division",
  "Dhaka",
  "Chittagong",
  "Khulna",
  "Rajshahi",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

/**
 * Helper: small axios instance with credentials + optional Authorization from localStorage
 */
function getApi() {
  const instance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  });
  const token = localStorage.getItem("userToken");
  if (token) {
    instance.defaults.headers.common = instance.defaults.headers.common || {};
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return instance;
}

export default function Checkout() {
  const {
    getCheckoutState,
    clearCheckoutState,
    cart,
    fetchCart,
    formatCurrency,
    user,
    clearCart,
  } = useContext(GlobalContext);

  const { state } = useLocation();
  const navigate = useNavigate();

  const [checkoutData, setCheckoutData] = useState(state ?? null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("cod");

  // react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      division: divisions[0],
      district: "",
      thana: "",
      postalCode: "",
      streetAddress: "",
    },
    mode: "onBlur",
  });

  const calcTotals = useCallback((items = [], shippingFee = 0) => {
    const subtotal = items.reduce(
      (acc, it) => acc + Number(it.price ?? 0) * Number(it.quantity ?? 0),
      0
    );
    const shipping = Number(shippingFee ?? 0);
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, []);

  // Fetch logged-in user (GET /api/auth/me) to prefill address when available
  const fetchMe = async () => {
    try {
      const api = getApi();
      const res = await api.get("/api/auth/me");
      // support both shapes: res.data.user or res.data
      const me = res.data?.user ?? res.data;
      return me;
    } catch (err) {
      // ignore if not logged in / no address — context's user may already hold data
      console.warn(
        "fetchMe failed:",
        err?.response?.data?.message || err.message
      );
      return null;
    }
  };

  // Build checkout payload from cart (fetch product details)
  const buildFromCart = async () => {
    // ensure cart loaded
    if (!cart?.items?.length) {
      await fetchCart().catch(() => {});
    }
    if (!cart?.items?.length) return null;

    setLoading(true);
    try {
      const api = getApi();
      const results = await Promise.all(
        (cart.items || []).map(async (ci) => {
          const res = await api.get(`/api/products/${ci.productId}`);
          const p = res.data.product ?? res.data;
          const price = Number(p?.price?.amount ?? p?.price ?? 0);
          const currency = p?.price?.currency ?? "USD";
          const image =
            (p?.images &&
              p.images.length &&
              (p.images[0].url ?? p.images[0])) ||
            "/placeholder.png";

          return {
            productId: ci.productId,
            quantity: ci.quantity,
            title: p.title || "Untitled Product",
            price,
            currency,
            stock: p.stock ?? 0,
            image,
            _id: p._id || ci.productId,
          };
        })
      );

      if (!results.length) return null;

      const shippingFee = 80; // default
      const totals = calcTotals(results, shippingFee);

      const payload = {
        items: results,
        totals,
        currency: results[0]?.currency ?? "USD",
        itemCount: results.reduce((a, i) => a + (i.quantity || 0), 0),
      };

      sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(payload));
      return payload;
    } catch (err) {
      console.error("buildFromCart failed:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 1️⃣ Try location.state only if it exists (SPA navigation)
        if (state) {
          sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(state));
          if (mounted) setCheckoutData(state);
        } else {
          // 2️⃣ Fallback to sessionStorage
          const fromSession = getCheckoutState();
          if (fromSession && mounted) setCheckoutData(fromSession);
          else {
            // 3️⃣ Build from cart if sessionStorage empty
            const built = await buildFromCart();
            if (built && mounted) setCheckoutData(built);
            else navigate("/cart"); // no data at all
          }
        }
      } catch (err) {
        console.error("Checkout initialization error:", err);
        navigate("/cart");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [state]);

  // update form defaults if user becomes available later
  useEffect(() => {
    if (user) {
      reset((vals) => ({
        ...vals,
        fullName: user.fullName ?? vals.fullName,
        phone: user.phone ?? vals.phone,
      }));
    }
  }, [user, reset]);

  if (loading)
    return <p className="text-center mt-20">Preparing checkout...</p>;
  if (!checkoutData) return null;

  const { items, totals, currency, itemCount } = checkoutData;
  const shippingFee = totals?.shipping ?? 80;

  // small UI helper components (same as before)
  const FormInput = ({
    id,
    placeholder,
    size = "full",
    registerProps,
    error,
  }) => (
    <div
      className={
        size === "half" ? "w-1/2" : size === "third" ? "w-1/3" : "w-full"
      }
    >
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        {...registerProps}
        className={`mt-1 block w-full border  rounded  shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500 text-sm ${
          error ? "border-red-500" : "border-border"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );

  const FormSelect = ({ id, options, control, error }) => (
    <div className="w-1/3">
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            id={id}
            className={`mt-1 block w-full border rounded  shadow-sm p-3 focus:ring-orange-500 focus:border-orange-500 text-sm appearance-none bg-white ${
              error ? "border-red-500" : "border-border"
            }`}
          >
            {options.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
        rules={{
          validate: (value) =>
            value !== divisions[0] || "Please select a valid division.",
        }}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );

  const RadioOption = ({
    id,
    name,
    label,
    details,
    price,
    selectedValue,
    onChange,
    icon,
  }) => (
    <div
      className={`flex justify-between items-center p-4 border   cursor-pointer ${
        selectedValue === id
          ? "border-orange-500 ring-1 ring-orange-500"
          : "border-border"
      }`}
      onClick={() => onChange(id)}
    >
      <div className="flex items-center">
        <input
          id={id}
          name={name}
          type="radio"
          checked={selectedValue === id}
          onChange={() => onChange(id)}
          className="h-4 w-4 text-orange-600 border-border focus:ring-orange-500 mr-3"
        />
        <div className="flex flex-col">
          <label
            htmlFor={id}
            className="text-sm font-medium text-text flex items-center"
          >
            {icon && <span className="mr-2">{icon}</span>}
            {label}
          </label>
          {details && <p className="text-xs text-text">{details}</p>}
        </div>
      </div>
      {price !== undefined && (
        <span className="text-sm font-medium">
          {formatCurrency(price, currency)}
        </span>
      )}
    </div>
  );

  // Submit: POST /api/orders
  const onFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      const finalOrderData = {
        shippingAddress: data,
        deliveryType: selectedDelivery,
        paymentMethod: selectedPayment,
        items,
        totals,
        currency,
      };

      const api = getApi();
      const res = await api.post("/api/orders", finalOrderData);

      // assume server returns created order in res.data.order or res.data
      const order = res.data.order ?? res.data;
      // clear checkout state and cart
      clearCheckoutState();
      await (clearCart ? clearCart() : Promise.resolve());

      toast.success("Order placed successfully!");

      // navigate to success page with order id if available
      const orderId = order?._id ?? order?.id ?? null;
      if (orderId) {
        navigate("/order-success", { state: { orderId } });
      } else {
        navigate("/order-success");
      }
    } catch (err) {
      console.error(
        "Order creation failed:",
        err?.response?.data || err.message
      );
      alert(
        err?.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = handleSubmit(onFormSubmit);

  return (
    <div className="mx-auto p-5 md:p-10 lg:p-20 w-full">
      <div className="flex flex-col lg:flex-row gap-8 bg-white">
        <div className="lg:w-2/3 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-border pb-2">
              Shipping Address
            </h2>

            <form onSubmit={handleCheckout} className="space-y-3 md:space-y-4">
              <div className="flex space-x-3 md:space-x-4">
                <FormInput
                  id="fullName"
                  placeholder="Full Name"
                  size="half"
                  registerProps={register("fullName", {
                    required: "Full Name is required.",
                  })}
                  error={errors.fullName}
                />
                <FormInput
                  id="phone"
                  placeholder="Phone Number"
                  size="half"
                  registerProps={register("phone", {
                    required: "Phone number is required.",
                    pattern: {
                      value: /^\d{7,14}$/,
                      message: "Invalid phone number format.",
                    },
                  })}
                  error={errors.phone}
                />
              </div>

              <div className="flex space-x-4">
                <FormSelect
                  id="division"
                  options={divisions}
                  control={control}
                  error={errors.division}
                />
                <FormInput
                  id="district"
                  placeholder="District"
                  size="third"
                  registerProps={register("district", {
                    required: "District is required.",
                  })}
                  error={errors.district}
                />
                <FormInput
                  id="thana"
                  placeholder="Thana/Area"
                  size="third"
                  registerProps={register("thana", {
                    required: "Thana/Area is required.",
                  })}
                  error={errors.thana}
                />
              </div>

              <div className="flex space-x-4">
                <FormInput
                  id="streetAddress"
                  placeholder="House 12, Road 4, etc."
                  size="full"
                  registerProps={register("streetAddress", {
                    required: "Street Address is required.",
                  })}
                  error={errors.streetAddress}
                />
              </div>

              <div className="flex space-x-4">
                <FormInput
                  id="postalCode"
                  placeholder="Postal Code (e.g., 1207)"
                  size="half"
                  registerProps={register("postalCode", {
                    required: "Postal Code is required.",
                  })}
                  error={errors.postalCode}
                />
                <div className="w-1/2" />
              </div>

              <div className="space-y-4 mt-4">
                <h2 className="text-xl font-semibold border-b border-border pb-2">
                  Delivery Options
                </h2>
                <RadioOption
                  id="standard"
                  name="delivery"
                  label="Standard Delivery"
                  details="5-7 business days"
                  price={shippingFee}
                  selectedValue={selectedDelivery}
                  onChange={setSelectedDelivery}
                />
              </div>
            </form>
          </div>
        </div>

        <div className="lg:w-2/5 bg-white p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 pb-4 border-b border-border">
            {items.map((it) => (
              <div
                key={it.productId || it._id}
                className="flex items-start justify-between"
              >
                <div className="flex">
                  <img
                    src={it.image || "/placeholder.png"}
                    alt={it.title}
                    className="w-12 h-12 object-cover    mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium">{it.title}</p>
                    <p className="text-xs text-text">Qty: {it.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-medium">
                  {formatCurrency(it.price * it.quantity, currency)}
                </p>
              </div>
            ))}
          </div>

          <div className="py-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <p className="text-text">Subtotal</p>
              <p className="font-medium">
                {formatCurrency(totals.subtotal, currency)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-text">Delivery Fee</p>
              <p className="font-medium">
                {formatCurrency(totals.shipping, currency)}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-dashed flex justify-between items-center text-lg font-bold">
            <p>Total</p>
            <p className="text-orange-600">
              {formatCurrency(totals.total, currency)}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <RadioOption
              id="cod"
              name="payment"
              label="Cash on Delivery"
              selectedValue={selectedPayment}
              onChange={setSelectedPayment}
              icon={
                <span role="img" aria-label="cash">
                  💵
                </span>
              }
            />
          </div>

          <button
            onClick={handleCheckout}
            disabled={submitting}
            className={`mt-6 w-full px-6 py-3 ${
              submitting
                ? "bg-gray-400"
                : " bg-green-600 hover:scale-103  hover:bg-green-700"
            } text-white font-semibold  rounded-full transition duration-200`}
          >
            {submitting ? "Placing order..." : "Confirm Order"}
          </button>

          <p className="text-center text-xs text-text mt-2 flex items-center justify-center">
            <span className="mr-1">🔒</span> Your information is secure and
            encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
