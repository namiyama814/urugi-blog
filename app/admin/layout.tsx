import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Defense-in-depth only — the real gate is a Cloudflare Access application
  // configured for /admin* in the Cloudflare Zero Trust dashboard (outside this
  // repo). Access injects this header once a request has passed its policy; its
  // mere presence here is not itself a signature check, just a guard against
  // /admin serving data at all if Access is ever misconfigured or removed.
  // (A root proxy.ts would be the more standard place for this, but Next.js 16's
  // proxy defaults to the Node.js runtime with no way to opt into Edge, and
  // @opennextjs/cloudflare doesn't support Node.js proxy/middleware yet — so the
  // check lives here, in the layout shared by every /admin/* page, instead.)
  if (!(await headers()).get("Cf-Access-Jwt-Assertion")) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">管理画面</h1>
      <AdminNav />
      {children}
    </div>
  );
}
