import { useState } from "react";

export default function ViewCapsuleModal({
  isOpen,
  onClose,
  capsule,
  onDelete,
}) {
  if (!isOpen || capsule.status != "Unlocked") return null;

  const handleDelete = () => {
    onDelete(capsule.id);
    onClose();
  };

  const handleDownload = () => {
    console.log(`Downloading memories for capsule: ${capsule.title}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] text-black z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] border border-gray-300">
        <h2 className="text-2xl font-courier text-center mb-4">View Capsule</h2>

        {/* Capsule Information */}
        <div className="space-y-3">
          {/* Capsule Name */}
          <div>
            <label className="block font-bold text-lg font-courier">
              Capsule Name:
            </label>
            <p className="p-2 border border-gray-300 rounded-lg bg-gray-100">
              {capsule.title}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-lg font-courier">
              Message:
            </label>
            <div className="p-2 border border-gray-300 rounded-lg bg-gray-100 h-28 overflow-y-auto resize-y">
              {capsule.description}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block font-bold text-lg font-courier">
              Date:
            </label>
            <p className="p-2 border border-gray-300 rounded-lg bg-gray-100">
              {capsule.date}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-lg font-bold font-courier bg-gray-300 text-gray-800 rounded-xl shadow-sm cursor-pointer"
          >
            Download Memories
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-lg font-bold font-courier bg-red-500 text-white rounded-xl shadow-sm cursor-pointer"
          >
            Delete
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-lg font-bold font-courier bg-gray-300 text-gray-800 rounded-xl shadow-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
