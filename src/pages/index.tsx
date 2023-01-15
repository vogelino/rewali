import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { faker } from "@faker-js/faker";

import { api } from "../utils/api";
import { BooksList } from "../components/BooksList";
import { BooksListLoadingSkeleton } from "../components/BooksListLoadingSkeleton";

const Home: NextPage = () => {
  const ctx = api.useContext();
  const session = useSession();
  const bookQuery = api.book.getAll.useQuery();
  const { data: readingList, isLoading: readingListLoading } =
    api.book.userReadingList.useQuery(session.data?.user?.id);
  const books = bookQuery.data;
  const bookMutation = api.book.create.useMutation({
    async onSuccess() {
      await ctx.book.getAll.invalidate();
    },
  });
  const readingListAddMutation = api.book.addToReadingList.useMutation({
    async onSuccess() {
      await ctx.book.userReadingList.invalidate();
    },
  });
  const readingListRemoveMutation = api.book.removeFromReadingList.useMutation({
    async onSuccess() {
      await ctx.book.getAll.invalidate();
      await ctx.book.userReadingList.invalidate();
    },
  });

  const addBookToReadingList = (id: string) => {
    readingListAddMutation.mutate(id);
  };

  const removeBookFromReadingList = (id: string) => {
    readingListRemoveMutation.mutate(id);
  };

  return (
    <>
      <Head>
        <title>Rewali – Books</title>
        <meta name="description" content="All books" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto p-8">
        <header className="flex-gap mb-12 flex items-center justify-between gap-8 border-b border-slate-200 pb-8">
          <span className="text-2xl font-extrabold">Rewali</span>
          <AuthArea />
        </header>
        <section>
          <h1 className="mb-8 text-5xl font-extrabold">My reading List</h1>
          {readingListAddMutation.isLoading ||
          readingListLoading ||
          readingListRemoveMutation.isLoading ? (
            <BooksListLoadingSkeleton
              itemsCount={(readingList || []).length || 2}
            />
          ) : (
            <BooksList
              books={readingList?.map((b) => ({ ...b, inReadingList: true }))}
              onBookAdd={addBookToReadingList}
              onBookRemove={removeBookFromReadingList}
            />
          )}
        </section>
        <section className="my-8 flex flex-wrap items-center justify-between gap-x-8">
          <h1 className="text-5xl font-extrabold">Books</h1>
          <button
            className="rounded-full bg-black px-6 py-3 font-semibold text-white no-underline transition hover:bg-black/80"
            onClick={() =>
              bookMutation.mutate({
                title: faker.random.words(5),
                subtitle: faker.random.words(10),
                description: faker.lorem.paragraph(),
                isbn13: `${faker.datatype.number({
                  min: 1000000000000,
                  max: 9999999999999,
                })}`,
                isbn10: `${faker.datatype.number({
                  min: 1000000000,
                  max: 9999999999,
                })}`,
                authors: [
                  {
                    name: faker.name.fullName(),
                    image: faker.internet.avatar(),
                  },
                  {
                    name: faker.name.fullName(),
                    image: faker.internet.avatar(),
                  },
                ],
              })
            }
          >
            Add random book
          </button>
        </section>
        <BooksList
          books={books?.map((b) => ({
            ...b,
            inReadingList: !!readingList?.find(({ id }) => id === b.id),
          }))}
          onBookAdd={addBookToReadingList}
          onBookRemove={removeBookFromReadingList}
        />
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
