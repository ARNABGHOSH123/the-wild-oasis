import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./hooks/useLogin";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, isLoggingIn } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;

    loginUser(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard", { replace: true });
        },
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          disabled={isLoggingIn}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          disabled={isLoggingIn}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button $size="large" disabled={isLoggingIn}>
          {isLoggingIn && <SpinnerMini />}
          <span>{isLoggingIn ? "Logging in..." : "Login"}</span>
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
