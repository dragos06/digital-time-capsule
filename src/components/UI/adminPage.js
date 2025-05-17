import { useEffect, useState } from "react";
import axios from "axios";

const MonitoredUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchMonitoredUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.API_URL}/admin/admin-data`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch monitored users", err);
      }
    };
    fetchMonitoredUsers();
  }, []);

  return (
    <div className="text-black">
      <h2>Monitored Users</h2>
      {users.length === 0 ? (
        <p>No suspicious activity found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.user_id}>
              {user.email} (flagged at{" "}
              {new Date(user.monitored_at).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MonitoredUsers;
