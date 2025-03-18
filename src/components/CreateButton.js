import { useState } from "react";
import CreateCapsuleModal from "./CreateCapsuleModal";

export default function CreateButton({ onAdd }) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleAdd = (name, date, message) => {
    onAdd(name, date, message);
    setShowModal(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)} // Show modal when button is clicked
        className="cursor-pointer px-4 py-2 text-xl font-bold bg-[#D9D9D9] text-black rounded-4xl drop-shadow-lg"
      >
        + Create New Capsule
      </button>

      {/* Render the CreateCapsuleModal */}
      <CreateCapsuleModal
        isOpen={showModal} // Modal visibility controlled by showModal state
        onClose={handleClose} // Pass handleClose to close modal
        onAdd={handleAdd} // Pass handleAdd to add new capsule
      />
    </div>
  );
}
