import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center mb-8">Log in</h1>
      <LoginForm googleEnabled={googleEnabled} />
    </div>
  );
}
