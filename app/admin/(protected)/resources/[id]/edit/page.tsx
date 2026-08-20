import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateResource } from "@/lib/actions/resources";
import { ResourceForm } from "../../ResourceForm";

export default async function EditResourcePage(props: PageProps<"/admin/resources/[id]/edit">) {
  const { id } = await props.params;
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) notFound();

  const action = updateResource.bind(null, resource.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Resource</h1>
      <ResourceForm
        action={action}
        submitLabel="Save changes"
        defaults={{
          title: resource.title,
          body: resource.body,
          category: resource.category,
          pinned: resource.pinned,
          published: Boolean(resource.publishedAt),
        }}
      />
    </div>
  );
}
