import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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
      const user = await register(form);
      push("Account created", "success");
      navigate(user.role === "VIEWER" ? "/dashboard" : "/dashboard");
    } catch (error) {
      push(error.response?.data?.message || error.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-ink">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">Get started with your finance workspace.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
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
            {loading ? "Creating..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-semibold text-ink" to="/login">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
