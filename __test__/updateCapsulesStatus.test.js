import { updateCapsulesStatus } from "@/utils/updateCapsulesStatus";

describe("updateCapsulesStatus", () => {
  let setTimeCapsules;

  beforeEach(() => {
    setTimeCapsules = jest.fn();
  });

  it("should unlock capsules with past dates", () => {
    const currentDate = new Date();
    const pastDate = new Date(currentDate);
    pastDate.setDate(currentDate.getDate() - 1);

    const timeCapsules = [
      { id: 1, title: "Capsule 1", date: pastDate.toISOString(), status: "Locked" },
      { id: 2, title: "Capsule 2", date: pastDate.toISOString(), status: "Locked" },
    ];

    updateCapsulesStatus(timeCapsules, setTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([
      { id: 1, title: "Capsule 1", date: pastDate.toISOString(), status: "Unlocked" },
      { id: 2, title: "Capsule 2", date: pastDate.toISOString(), status: "Unlocked" },
    ]);
  });

  it("should not change capsules with future dates", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const timeCapsules = [
      { id: 1, title: "Capsule 1", date: futureDate.toISOString(), status: "Locked" },
    ];

    updateCapsulesStatus(timeCapsules, setTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([
      { id: 1, title: "Capsule 1", date: futureDate.toISOString(), status: "Locked" },
    ]);
  });

  it("should not change already unlocked capsules", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const timeCapsules = [
      { id: 1, title: "Capsule 1", date: pastDate.toISOString(), status: "Unlocked" },
    ];

    updateCapsulesStatus(timeCapsules, setTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([
      { id: 1, title: "Capsule 1", date: pastDate.toISOString(), status: "Unlocked" },
    ]);
  });

  it("should handle an empty list correctly", () => {
    updateCapsulesStatus([], setTimeCapsules);

    expect(setTimeCapsules).toHaveBeenCalledWith([]);
  });
});
