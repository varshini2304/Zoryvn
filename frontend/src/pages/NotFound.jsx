import Button from "../components/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">The page you are looking for does not exist.</p>
        <Button className="mt-6" onClick={() => window.location.assign("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
