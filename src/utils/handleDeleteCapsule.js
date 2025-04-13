import { syncInitialTimeCapsules } from "./syncInitialTimeCapsules";

export const handleDeleteCapsule = (
  id,
  timeCapsules,
  setTimeCapsules,
  initialTimeCapsules
) => {
  const updatedCapsules = timeCapsules.filter((capsule) => capsule.capsule_id !== id);
  setTimeCapsules(updatedCapsules);
  syncInitialTimeCapsules(updatedCapsules, initialTimeCapsules); // Sync after deleting
};
