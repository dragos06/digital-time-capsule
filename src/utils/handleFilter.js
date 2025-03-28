export const handleFilter = (
  setFilterCase,
  setTimeCapsules,
  initialTimeCapsules
) => {
  setFilterCase((prevFilter) => {
    const newFilter =
      prevFilter === "Unlocked"
        ? "Locked"
        : prevFilter === "Locked"
        ? "All"
        : "Unlocked";

    const filteredCapsules =
      newFilter === "All"
        ? initialTimeCapsules
        : initialTimeCapsules.filter((capsule) => capsule.status === newFilter);
    setTimeCapsules(filteredCapsules);
    return newFilter;
  });
};
