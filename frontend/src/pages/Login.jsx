import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = await login(form);
      push("Welcome back", "success");
      navigate(user.role === "VIEWER" ? "/dashboard" : "/dashboard");
    } catch (error) {
      push(error.response?.data?.message || error.message || "Invalid credentials", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Access your finance dashboard securely.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <div>
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="mt-2 text-xs text-slate-500 hover:text-ink"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          No account yet?{" "}
          <Link className="font-semibold text-ink" to="/register">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
