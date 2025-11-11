import { SignInButton } from '@/components/auth/SignInButton'

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use your Google account to access AI Photo Editor
          </p>
        </div>
        <div className="flex justify-center">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}