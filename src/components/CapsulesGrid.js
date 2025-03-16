import CapsuleCard from "./CapsuleCard";

export default function CapsulesGrid({ capsules }) {
  return (
    <div class="grid grid-cols-3 gap-6 px-5 py-8 text-black">
      {capsules.map((capsule) => (
        <CapsuleCard key={capsule.id} capsule={capsule} />
      ))}
    </div>
  );
}
