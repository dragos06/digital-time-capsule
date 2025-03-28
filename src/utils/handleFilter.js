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

    console.log("Filtered capsules:", filteredCapsules);

    setTimeCapsules(filteredCapsules);
    return newFilter;
  });
};
