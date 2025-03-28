export const handleSort = (timeCapsules, setTimeCapsules, sortOrder) => {
    setTimeCapsules((prevCapsules) =>
      [...prevCapsules].sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      )
    );
  };