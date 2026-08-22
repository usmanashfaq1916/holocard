import { CardEditor } from "@/components/cards/card-editor";

export default function NewCardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Card</h1>
      </div>
      <CardEditor />
    </div>
  );
}
