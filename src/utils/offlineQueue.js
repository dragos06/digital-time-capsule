const offlineQueueKey = "offlineQueue";

export function enqueueOfflineData(data) {
  if (typeof window === "undefined") return;
  const existing = JSON.parse(localStorage.getItem(offlineQueueKey)) || [];
  existing.push(data);
  localStorage.setItem(offlineQueueKey, JSON.stringify(existing));
}

export function getOfflineQueue() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(offlineQueueKey)) || [];
}

export function clearOfflineQueue() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(offlineQueueKey);
}

export async function syncOfflineQueue(apiUrl) {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  for (const item of queue) {
    const { type, data } = item;
    try {
      let res;
      switch (type) {
        case "CREATE":
          res = await fetch(`${apiUrl}/capsules`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          break;
        case "DELETE":
          res = await fetch(`${apiUrl}/capsules/${data.id}`, {
            method: "DELETE",
          });
          break;
        default:
          throw new Error("Unknown operation type");
      }

      if (!res.ok) throw new Error("Failed to sync one item");
    } catch (error) {
      console.error("Sync error:", error);
      localStorage.clear();
      return; // Stop syncing if one fails
    }
  }

  clearOfflineQueue();
}
