import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditProduct() {
  const { id } = useParams(); // optional product id for edit
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: { amount: "", currency: "BDT" },
    stock: 0,
    specification: [{ key: "", value: "" }],
    images: [], // new uploaded files
    existingImages: [], // existing images from server
  });

  // Fetch product for edit
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await axios.get(
          `  https://digitalhat-server.onrender.com/api/products/${id}`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
          }
        );
        if (!mounted) return;
        const p = res.data?.product || res.data || {};
        setForm({
          title: p.title || "",
          description: p.description || "",
          category: p.category || "",
          price: {
            amount:
              p.price?.amount ?? (typeof p.price === "number" ? p.price : ""),
            currency: p.price?.currency ?? "BDT",
          },
          stock: p.stock ?? 0,
          specification:
            p.specification && typeof p.specification === "object"
              ? Object.entries(p.specification).map(([k, v]) => ({
                  key: k,
                  value: String(v),
                }))
              : [{ key: "", value: "" }],
          existingImages: p.images || [],
          images: [],
        });
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to load product"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  function setField(path, value) {
    setForm((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let cur = clone;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return clone;
    });
  }

  function handleAddSpec() {
    setForm((s) => ({
      ...s,
      specification: [...s.specification, { key: "", value: "" }],
    }));
  }
  function handleRemoveSpec(i) {
    setForm((s) => ({
      ...s,
      specification: s.specification.filter((_, idx) => idx !== i),
    }));
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files || []);
    const allowed =
      5 - (form.existingImages?.length || 0) - (form.images?.length || 0);
    const selected = files.slice(0, allowed);
    setForm((s) => ({ ...s, images: [...s.images, ...selected] }));
  }

  function removeNewImage(i) {
    setForm((s) => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }));
  }
  function removeExistingImage(i) {
    setForm((s) => ({
      ...s,
      existingImages: s.existingImages.filter((_, idx) => idx !== i),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!form.title.trim()) return setError("Title is required");
    if (!form.price.amount || Number(form.price.amount) <= 0)
      return setError("Price must be > 0");
    if (form.images.length + form.existingImages.length > 5)
      return setError("Maximum 5 images allowed");

    try {
      setSaving(true);
      const token = localStorage.getItem("userToken");
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append(
        "price",
        JSON.stringify({
          amount: Number(form.price.amount),
          currency: form.price.currency,
        })
      );
      fd.append("stock", String(Number(form.stock)));

      const specObj = {};
      form.specification.forEach((s) => {
        if (s.key) specObj[s.key] = s.value;
      });
      fd.append("specification", JSON.stringify(specObj));
      fd.append("existingImages", JSON.stringify(form.existingImages || []));
      form.images.forEach((file) => fd.append("images", file));

      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      };
      const res = id
        ? await axios.put(
            `  https://digitalhat-server.onrender.com/api/products/${id}`,
            fd,
            config
          )
        : await axios.post(
            `  https://digitalhat-server.onrender.com/api/products/`,
            fd,
            config
          );

      setSuccess(
        res.data?.message || (id ? "Product updated" : "Product created")
      );
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("userToken");
      await axios.delete(
        `  https://digitalhat-server.onrender.com/api/products/${id}`,
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || "Failed to delete product"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {id ? "Edit Product" : "Create Product"}
        </h2>

        {loading ? (
          <div className="py-8 text-center text-gray-500">
            Loading product...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>
            )}
            {success && (
              <div className="text-green-600 bg-green-50 p-3 rounded">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <input
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stock</label>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setField("stock", Number(e.target.value))}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  min={0}
                  value={form.price.amount}
                  onChange={(e) => setField("price.amount", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Currency
                </label>
                <select
                  value={form.price.currency}
                  onChange={(e) => setField("price.currency", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Specification
                </label>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-sm text-[#ff6a00]"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {form.specification.map((s, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 items-center">
                    <input
                      value={s.key}
                      onChange={(e) =>
                        setField(`specification.${i}.key`, e.target.value)
                      }
                      placeholder="Key"
                      className="col-span-1 rounded-lg border px-3 py-2"
                    />
                    <input
                      value={s.value}
                      onChange={(e) =>
                        setField(`specification.${i}.value`, e.target.value)
                      }
                      placeholder="Value"
                      className="col-span-1 rounded-lg border px-3 py-2"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(i)}
                        className="text-sm text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Images (max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <div className="mt-3 flex flex-wrap gap-3">
                {form.existingImages.map((img, i) => (
                  <div
                    key={i}
                    className="w-24 h-24 rounded-md overflow-hidden relative border"
                  >
                    <img
                      src={img.url || img}
                      alt={`img-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {form.images.map((f, i) => (
                  <div
                    key={i}
                    className="w-24 h-24 rounded-md overflow-hidden relative border"
                  >
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              {id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg border text-red-600"
                >
                  {deleting ? "Deleting..." : "Delete Product"}
                </button>
              )}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#ff6a00] text-white"
                >
                  {saving
                    ? "Saving..."
                    : id
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
