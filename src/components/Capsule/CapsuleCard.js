import { useState } from "react";
import ViewCapsuleModal from "./ViewCapsuleModal";

export default function CapsuleCard({ capsule, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-[#D9D9D9] p-10 rounded-lg relative shadow-md">
      {/* Delete Button */}
      <button
        onClick={() => onDelete(capsule.capsule_id)}
        className="cursor-pointer absolute top-2 right-2 text-xl font-bold text-black"
      >
        ✖
      </button>

      {/* Capsule Content */}
      <h3 className="font-bold text-lg mb-2">{capsule.capsule_title}</h3>
      <p className="text-xl font-bold">
        Open Date:{" "}
        <span
          className={
            new Date(capsule.capsule_date).getFullYear() - new Date().getFullYear() <= 0
              ? "text-amber-600"
              : new Date(capsule.capsule_date).getFullYear() -
                  new Date().getFullYear() <=
                1
              ? "text-blue-500"
              : "text-purple-800"
          }
        >
          {capsule.capsule_date}{" "}
          {
            new Date(capsule.capsule_date).getFullYear() - new Date().getFullYear() <= 0
              ? ""
              : new Date(capsule.capsule_date).getFullYear() -
                  new Date().getFullYear() <=
                1
              ? "⏳"
              : "⌛⌛"
          }
        </span>
      </p>
      <p className="text-xl font-bold">
        Status:{" "}
        <span
          className={
            capsule.capsule_status === "Unlocked" ? "text-green-600" : "text-red-600"
          }
        >
          {capsule.capsule_status}
        </span>
      </p>

      {/* View Button */}
      <button
        className={
          "absolute bottom-2 right-2 bg-black text-white font-semibold px-4 py-2 mt-4 rounded-4xl " +
          (capsule.capsule_status === "Unlocked" ? "cursor-pointer" : "")
        }
        onClick={openModal}
      >
        View
      </button>

      {/* View Capsule Modal */}
      <ViewCapsuleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        capsule={capsule}
        onDelete={onDelete}
      />
    </div>
  );
}
