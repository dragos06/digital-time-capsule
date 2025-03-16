import Link from "next/link";

export default function CreateButton() {
  return (
    <div>
      <Link href="/create">
        <button class="cursor-pointer px-4 py-2 text-xl font-bold bg-[#D9D9D9] text-black rounded-4xl drop-shadow-lg">
          + Create New Capsule
        </button>
      </Link>
    </div>
  );
}
