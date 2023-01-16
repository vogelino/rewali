import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { ReWaList } from "../components/ReWaList";
import { ReWaListLoadingSkeleton } from "../components/ReWaListLoadingSkeleton";
import Search from "../components/Search/Search";

const Home: NextPage = () => {
  const ctx = api.useContext();
  const session = useSession();
  const { data: reWaList, isLoading: reWaListLoading } =
    api.reWaList.getReWaList.useQuery(session.data?.user?.id);
  const reWaListRemoveMutation = api.reWaList.removeFromReWaList.useMutation({
    async onSuccess() {
      await ctx.reWaList.getReWaList.invalidate();
    },
  });

  const removeBookFromReWaList = (id: string, type: "book" | "video") => {
    reWaListRemoveMutation.mutate({ id, type });
  };

  return (
    <>
      <Head>
        <title>Rewali – Reading and Watching List</title>
        <meta name="description" content="All books" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto p-8">
        <header className="flex-gap mb-12 flex items-center justify-between gap-8 border-b border-slate-200 pb-8">
          <span className="text-2xl font-extrabold">Rewali</span>
          <AuthArea />
        </header>
        <Search />
        {session.data && (
          <section>
            <h1 className="mb-8 text-5xl font-extrabold">
              Reading and Watching List
            </h1>
            {reWaListLoading || reWaListRemoveMutation.isLoading ? (
              <ReWaListLoadingSkeleton
                itemsCount={(reWaList || []).length || 2}
              />
            ) : (
              <ReWaList
                items={reWaList}
                onItemRemove={removeBookFromReWaList}
              />
            )}
          </section>
        )}
      </main>
    </>
  );
};

export default Home;

const AuthArea: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center gap-4">
      <p>{sessionData && <span>Logged in as {sessionData.user?.name}</span>}</p>
      <button
        className="rounded-full bg-black px-6 py-3 font-semibold text-white no-underline transition hover:bg-black/80"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
