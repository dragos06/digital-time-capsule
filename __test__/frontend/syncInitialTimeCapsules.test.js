import { syncInitialTimeCapsules } from "@/utils/syncInitialTimeCapsules";

describe("syncInitialTimeCapsules", () => {
  it("should clear and update initialTimeCapsules with newCapsules", () => {
    const initialTimeCapsules = [
      { id: 1, title: "Old Capsule", status: "Locked" },
    ];

    const newCapsules = [
      { id: 2, title: "New Capsule 1", status: "Unlocked" },
      { id: 3, title: "New Capsule 2", status: "Locked" },
    ];

    syncInitialTimeCapsules(newCapsules, initialTimeCapsules);

    expect(initialTimeCapsules).toEqual(newCapsules);
  });

  it("should clear initialTimeCapsules even if newCapsules is empty", () => {
    const initialTimeCapsules = [
      { id: 1, title: "Old Capsule", status: "Locked" },
    ];

    syncInitialTimeCapsules([], initialTimeCapsules);

    expect(initialTimeCapsules).toEqual([]);
  });

  it("should maintain reference to the original array", () => {
    const initialTimeCapsules = [
      { id: 1, title: "Original Capsule", status: "Locked" },
    ];
    const reference = initialTimeCapsules;

    const newCapsules = [
      { id: 2, title: "New Capsule", status: "Unlocked" },
    ];

    syncInitialTimeCapsules(newCapsules, initialTimeCapsules);

    expect(initialTimeCapsules).toBe(reference);
  });
});
