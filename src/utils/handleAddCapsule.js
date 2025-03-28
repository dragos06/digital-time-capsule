import { syncInitialTimeCapsules } from "./syncInitialTimeCapsules";

export const handleAddCapsule = (
    title,
    date,
    description,
    timeCapsules,
    setTimeCapsules,
    initialTimeCapsules
  ) => {
    if (!title.trim() || !date.trim() || !description.trim()) return;
  
    const newCapsule = {
      id: initialTimeCapsules.length + 1, // Ensure unique IDs
      title,
      date,
      description,
      status: "Locked",
    };
  
    const updatedCapsules = [...timeCapsules, newCapsule];
    setTimeCapsules(updatedCapsules);
    syncInitialTimeCapsules(updatedCapsules, initialTimeCapsules); // Sync after adding
  };