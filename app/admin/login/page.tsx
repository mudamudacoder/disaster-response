import AdminLoginForm from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-xl font-bold text-neutral-900">Admin Sign In</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Restricted to authorized administrators.
      </p>
      <div className="mt-6">
        <AdminLoginForm />
      </div>
    </div>
  );
}