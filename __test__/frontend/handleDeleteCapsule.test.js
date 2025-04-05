import { handleDeleteCapsule } from "@/utils/handleDeleteCapsule";
import { syncInitialTimeCapsules } from "@/utils/syncInitialTimeCapsules";

jest.mock("@/utils/syncInitialTimeCapsules");

describe("handleDeleteCapsule", () => {
  let setTimeCapsules;

  beforeEach(() => {
    setTimeCapsules = jest.fn();
    syncInitialTimeCapsules.mockClear();
  });

  it("should delete a capsule correctly", () => {
    const timeCapsules = [
      { id: 1, title: "Capsule 1", date: "2025-01-01", description: "Desc 1", status: "Locked" },
      { id: 2, title: "Capsule 2", date: "2025-02-02", description: "Desc 2", status: "Locked" },
    ];
    const initialTimeCapsules = [...timeCapsules];

    handleDeleteCapsule(1, timeCapsules, setTimeCapsules, initialTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([
      { id: 2, title: "Capsule 2", date: "2025-02-02", description: "Desc 2", status: "Locked" },
    ]);
    expect(syncInitialTimeCapsules).toHaveBeenCalledWith(
      [{ id: 2, title: "Capsule 2", date: "2025-02-02", description: "Desc 2", status: "Locked" }],
      initialTimeCapsules
    );
  });

  it("should not modify state if ID is not found", () => {
    const timeCapsules = [
      { id: 1, title: "Capsule 1", date: "2025-01-01", description: "Desc 1", status: "Locked" },
    ];
    const initialTimeCapsules = [...timeCapsules];

    handleDeleteCapsule(99, timeCapsules, setTimeCapsules, initialTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith(timeCapsules);
    expect(syncInitialTimeCapsules).toHaveBeenCalledWith(timeCapsules, initialTimeCapsules);
  });

  it("should handle empty list correctly", () => {
    const timeCapsules = [];
    const initialTimeCapsules = [];

    handleDeleteCapsule(1, timeCapsules, setTimeCapsules, initialTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([]);
    expect(syncInitialTimeCapsules).toHaveBeenCalledWith([], initialTimeCapsules);
  });
});
