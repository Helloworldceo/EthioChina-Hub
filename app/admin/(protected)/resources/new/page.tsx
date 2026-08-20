import { createResource } from "@/lib/actions/resources";
import { ResourceForm } from "../ResourceForm";

export default function NewResourcePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Resource</h1>
      <ResourceForm action={createResource} submitLabel="Create resource" />
    </div>
  );
}
