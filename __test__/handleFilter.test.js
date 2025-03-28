import { handleFilter } from "@/utils/handleFilter";

describe("handleFilter", () => {
  let setFilterCase, setTimeCapsules;

  beforeEach(() => {
    setFilterCase = jest.fn((callback) => {
      let prevFilter = "Unlocked";
      prevFilter = callback(prevFilter);
    });
    setTimeCapsules = jest.fn();
  });

  const initialTimeCapsules = [
    { id: 1, title: "Capsule 1", status: "Locked" },
    { id: 2, title: "Capsule 2", status: "Unlocked" },
    { id: 3, title: "Capsule 3", status: "Locked" },
  ];

  it("should switch filter state from 'Unlocked' → 'Locked' → 'All' → 'Unlocked'", () => {
    let currentFilter = "Unlocked";

    setFilterCase = jest.fn((callback) => {
      currentFilter = callback(currentFilter);
    });

    handleFilter(setFilterCase, setTimeCapsules, initialTimeCapsules);
    expect(currentFilter).toBe("Locked");

    handleFilter(setFilterCase, setTimeCapsules, initialTimeCapsules);
    expect(currentFilter).toBe("All");

    handleFilter(setFilterCase, setTimeCapsules, initialTimeCapsules);
    expect(currentFilter).toBe("Unlocked");
  });

  it("should filter 'Locked' capsules when switching to 'Locked'", () => {
    setFilterCase = jest.fn((callback) => callback("Unlocked"));

    handleFilter(setFilterCase, setTimeCapsules, initialTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([
      { id: 1, title: "Capsule 1", status: "Locked" },
      { id: 3, title: "Capsule 3", status: "Locked" },
    ]);
  });

  it("should filter 'Unlocked' capsules when switching to 'Unlocked'", () => {
    setFilterCase = jest.fn((callback) => callback("All"));

    handleFilter(setFilterCase, setTimeCapsules, initialTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([
      { id: 2, title: "Capsule 2", status: "Unlocked" },
    ]);
  });

  it("should show all capsules when switching to 'All'", () => {
    setFilterCase = jest.fn((callback) => callback("Locked"));

    handleFilter(setFilterCase, setTimeCapsules, initialTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith(initialTimeCapsules);
  });

  it("should handle an empty initialTimeCapsules list", () => {
    handleFilter(setFilterCase, setTimeCapsules, []);

    expect(setTimeCapsules).toHaveBeenCalledWith([]);
  });
});
