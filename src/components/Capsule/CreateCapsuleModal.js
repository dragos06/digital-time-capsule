import { useState } from "react";

export default function CreateCapsuleModal({ isOpen, onClose, onAdd }) {
  const [capsule, setCapsule] = useState({
    title: "",
    description: "",
    date: "",
  });

  const [error, setError] = useState(""); // Validation state

  const handleChange = (e) => {
    setCapsule({ ...capsule, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!capsule.title || !capsule.date || !capsule.description) {
      setError("All fields are required!"); // Show error if any field is empty
      return;
    }
    onAdd(capsule.title, capsule.date, capsule.description);
    setCapsule({ title: "", description: "", date: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] text-black">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] border border-gray-300">
        <h2 className="text-2xl font-courier text-center mb-4">
          Create Capsule
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Capsule Name */}
          <label className="block font-bold text-lg font-courier">
            Capsule Title:
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={capsule.title}
            onChange={handleChange}
            placeholder="Please enter capsule title..."
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />

          {/* Message */}
          <label className="block font-bold text-lg font-courier">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={capsule.description}
            onChange={handleChange}
            placeholder="Please enter capsule description..."
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 h-28"
          ></textarea>

          {/* Date */}
          <label className="block font-bold text-lg font-courier">Date:</label>
          <input
            id="date"
            type="date"
            name="date"
            value={capsule.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />

          {/* Error Message */}
          {error && <p className="text-red-500 font-bold">{error}</p>}

          {/* Upload Button */}
          <button
            type="button"
            className="mt-2 px-4 py-2 text-lg font-bold font-courier bg-gray-300 text-gray-800 rounded-xl shadow-sm"
          >
            Upload
          </button>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-lg font-bold font-courier bg-gray-300 text-gray-800 rounded-xl shadow-sm cursor-pointer"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-lg font-bold font-courier bg-gray-300 text-gray-800 rounded-xl shadow-sm cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
