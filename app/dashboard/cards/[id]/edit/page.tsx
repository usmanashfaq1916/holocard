import { CardEditor } from "@/components/cards/card-editor";

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Card</h1>
      </div>
      <CardEditor cardId={id} />
    </div>
  );
}
