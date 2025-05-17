import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store JWT
        onLogin(true); // Set logged-in state in parent component
        router.push("/"); // Redirect to home page
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 text-black">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-4">
        <label htmlFor="email" className="block">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
