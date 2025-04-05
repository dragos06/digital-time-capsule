import { handleAddCapsule } from "@/utils/handleAddCapsule";
import { syncInitialTimeCapsules } from "@/utils/syncInitialTimeCapsules";

jest.mock("@/utils/syncInitialTimeCapsules");

describe("handleAddCapsule", () => {
  let setTimeCapsules;

  beforeEach(() => {
    setTimeCapsules = jest.fn();
    syncInitialTimeCapsules.mockClear();
  });

  it("should not add a capsule if title, date, or description is empty", () => {
    const timeCapsules = [];
    const initialTimeCapsules = [];

    handleAddCapsule("", "2025-01-01", "Some description", timeCapsules, setTimeCapsules, initialTimeCapsules);
    handleAddCapsule("Title", "", "Some description", timeCapsules, setTimeCapsules, initialTimeCapsules);
    handleAddCapsule("Title", "2025-01-01", "", timeCapsules, setTimeCapsules, initialTimeCapsules);

    expect(setTimeCapsules).not.toHaveBeenCalled();
    expect(syncInitialTimeCapsules).not.toHaveBeenCalled();
  });

  it("should add a new capsule and update state when valid inputs are provided", () => {
    const timeCapsules = [{ id: 1, title: "Old", date: "2024-01-01", description: "Old desc", status: "Locked" }];
    const initialTimeCapsules = [{ id: 1, title: "Old", date: "2024-01-01", description: "Old desc", status: "Locked" }];

    handleAddCapsule("New Capsule", "2025-01-01", "New Description", timeCapsules, setTimeCapsules, initialTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([
      ...timeCapsules,
      {
        id: initialTimeCapsules.length + 1,
        title: "New Capsule",
        date: "2025-01-01",
        description: "New Description",
        status: "Locked",
      },
    ]);

    expect(syncInitialTimeCapsules).toHaveBeenCalledWith(
      [
        ...timeCapsules,
        {
          id: initialTimeCapsules.length + 1,
          title: "New Capsule",
          date: "2025-01-01",
          description: "New Description",
          status: "Locked",
        },
      ],
      initialTimeCapsules
    );
  });

  it("should correctly increment the ID for new capsules", () => {
    const timeCapsules = [{ id: 1, title: "Capsule1", date: "2024-01-01", description: "Desc1", status: "Locked" }];
    const initialTimeCapsules = [{ id: 1, title: "Capsule1", date: "2024-01-01", description: "Desc1", status: "Locked" }];

    handleAddCapsule("Capsule2", "2025-02-02", "Desc2", timeCapsules, setTimeCapsules, initialTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([
      ...timeCapsules,
      {
        id: 2,
        title: "Capsule2",
        date: "2025-02-02",
        description: "Desc2",
        status: "Locked",
      },
    ]);
  });
});
