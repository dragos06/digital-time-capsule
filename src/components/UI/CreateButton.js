import { useState } from "react";
import CreateCapsuleModal from "../Capsule/CreateCapsuleModal";

export default function CreateButton({ onAdd }) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleAdd = (name, date, message) => {
    const createdCapsule = onAdd(name, date, message);
    return createdCapsule;
  }

  return (
    <div className="relative">
      <button
        aria-label="createButton"
        onClick={() => setShowModal(true)} // Show modal when button is clicked
        className="cursor-pointer px-4 py-2 text-xl font-bold bg-[rgba(229,231,235,0.9)] border-2 text-black rounded-4xl drop-shadow-lg"
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
