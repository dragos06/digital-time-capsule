import CapsuleCard from "./CapsuleCard";

export default function CapsulesGrid({ capsules, onDelete }) {
  return (
    <div className="grid grid-cols-3 gap-6 px-5 py-8 text-black">
      {capsules.map((capsule) => (
        <CapsuleCard key={capsule.capsule_id} capsule={capsule} onDelete={onDelete}/>
      ))}
    </div>
  );
}
