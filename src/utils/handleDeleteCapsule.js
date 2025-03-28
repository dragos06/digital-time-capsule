import { syncInitialTimeCapsules } from "./syncInitialTimeCapsules";

export const handleDeleteCapsule = (
  id,
  timeCapsules,
  setTimeCapsules,
  initialTimeCapsules
) => {
  const updatedCapsules = timeCapsules.filter((capsule) => capsule.id !== id);
  setTimeCapsules(updatedCapsules);
  syncInitialTimeCapsules(updatedCapsules, initialTimeCapsules); // Sync after deleting
};
