import SignOutButton from "@/components/SignOutButton";

export default function NotAuthorizedPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 text-center">
      <h1 className="text-xl font-bold text-neutral-900">Not Authorized</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Your account is signed in but does not have admin access. Contact an
        existing administrator if you believe this is a mistake.
      </p>
      <div className="mt-4 flex justify-center">
        <SignOutButton />
      </div>
    </div>
  );
}