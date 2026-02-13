import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function Landing() {
  const { user, accessToken, login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading,setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md mt-12 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{isRegister ? "Register" : "Login"}</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {isRegister && (
          <div>
            <label className="block font-medium">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
        )}
        <div>
          <label className="block font-medium">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={isLoading} 
          className={clsx(
            "text-white px-4 py-2 rounded w-full transition-colors flex items-center justify-center",
            isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          )}>
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
              Processing...
            </>
          ) : (
            isRegister ? "Create account" : "Login"
          )}
        </button>
      </form>

      <button
        className="text-sm text-blue-600 mt-4 hover:underline"
        onClick={() => setIsRegister((v) => !v)}
      >
        {isRegister ? "Already have an account? Login" : "No account? Register"}
      </button>
    </div>
  );
}