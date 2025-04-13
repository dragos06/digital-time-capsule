export const updateCapsulesStatus = (timeCapsules, setTimeCapsules) => {
    const currentDate = new Date();
    const updatedCapsules = timeCapsules.map((capsule) => {
      if (new Date(capsule.capsule_date) < currentDate && capsule.capsule_status === "Locked") {
        return { ...capsule, status: "Unlocked" };
      }
      return capsule;
    });
    setTimeCapsules(updatedCapsules);
  };