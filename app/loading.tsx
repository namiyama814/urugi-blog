import { Spinner } from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl justify-center px-4 py-16">
      <Spinner />
    </div>
  );
}
