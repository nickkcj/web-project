import { Sidebar } from "../../components/Feed/Sidebar";
import Feed from "../../components/Feed/Feed";

export default function FeedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <main className="flex flex-1 gap-6 px-4 md:px-8 py-6 mx-auto w-full max-w-7xl">
        <section className="flex-1">
          <Feed />
        </section>
        <aside className="hidden lg:block w-80">
          <Sidebar />
        </aside>
      </main>
    </div>
  );
}
