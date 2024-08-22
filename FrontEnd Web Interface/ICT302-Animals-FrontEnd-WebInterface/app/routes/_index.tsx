import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "ICT302 Animals" },
    { name: "description", content: "Welcome to ICT302 Animals" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to ICT302 Animals</h1>
      <p className="mt-4">
        This is a simple web interface for the ICT302 Animals frontend.
      </p>
    </div>
  );
}