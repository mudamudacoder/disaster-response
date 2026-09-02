import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold text-neutral-900">
        Register a Donation Center
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Submit your organization or initiative for admin verification. It
        will not appear publicly until it has been reviewed and approved.
      </p>

      <div className="mt-6">
        <RegisterForm />
      </div>
    </div>
  );
}