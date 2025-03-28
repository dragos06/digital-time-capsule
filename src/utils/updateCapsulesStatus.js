export const updateCapsulesStatus = (timeCapsules, setTimeCapsules) => {
    const currentDate = new Date();
    const updatedCapsules = timeCapsules.map((capsule) => {
      if (new Date(capsule.date) < currentDate && capsule.status === "Locked") {
        return { ...capsule, status: "Unlocked" };
      }
      return capsule;
    });
    setTimeCapsules(updatedCapsules);
  };