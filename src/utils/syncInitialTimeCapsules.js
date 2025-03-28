export const syncInitialTimeCapsules = (newCapsules, initialTimeCapsules) => {
    initialTimeCapsules.length = 0; // Clear the original data
    initialTimeCapsules.push(...newCapsules); // Add the updated data
  };