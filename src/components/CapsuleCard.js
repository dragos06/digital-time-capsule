export default function CapsuleCard({capsule}) {
  return (
    <div class="bg-[#D9D9D9] p-4 rounded-lg relative shadow-md">
      {/* Close Button */}
      <button class="cursor-pointer absolute top-2 right-2 text-xl font-bold text-black">
        ✖
      </button>

      {/* Capsule Content */}
      <h3 class="font-bold text-lg mb-2">Title: {capsule.title}</h3>
      <p class="text-xl">Open Date: {capsule.date}</p>
      <p class="text-xl">
        Status:{" "}
        <span
          class={
            capsule.status === "Locked" ? "text-red-600" : "text-green-600"
          }
        >
          {capsule.status}
        </span>
      </p>

      {/* View Button */}
      <button class="cursor-pointer absolute bottom-2 right-2 bg-black text-white font-semibold px-4 py-2 mt-4 rounded-4xl">
        View
      </button>
    </div>
  );
}
