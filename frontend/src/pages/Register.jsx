import { useState } from "react";
import { registerUser } from "../api/auth";
import { setTokens } from "../utils/token";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setConfpassword] = useState("");
  const [tc, setTerms] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth()
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    if (!tc) {
      setError("You must accept the terms and conditions.");
      return;
    }

    const formData = {
      name,
      email,
      password,
      password2,
      tc,
    };

    try {
      const data = await registerUser(formData);
      if (data.token) {
        setTokens(data.token.access, data.token.refresh);
        login();
        navigate("/");
      } else {
        setError("Registration failed. Check credentials.");
      }
    } catch (err) {
      setError("Error while registering");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Enter your information to register</CardDescription>
        </CardHeader>

        <CardContent>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                type="text"
                placeholder="yourusername"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password2">Confirm Password</Label>
              <Input
                id="password2"
                type="password"
                value={password2}
                onChange={(e) => setConfpassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="tc"
                checked={tc}
                onChange={() => setTerms(!tc)}
                className="accent-primary"
              />
              <Label htmlFor="tc">I accept the Terms and Conditions</Label>
              <Button variant="link" onClick={() => navigate("/login")}>
                Already have an account? Login
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
