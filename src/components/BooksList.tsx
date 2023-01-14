import type { Author, Book } from "@prisma/client";
import { useSession } from "next-auth/react";

type BookWithState = Book & {
  authors: Author[];
  inReadingList: boolean;
};

type BooksListPros = {
  books?: BookWithState[] | null;
  onBookAdd?: (id: Book["id"]) => void;
  onBookRemove?: (id: Book["id"]) => void;
};

export const BooksList = ({
  books,
  onBookAdd = () => undefined,
  onBookRemove = () => undefined,
}: BooksListPros): JSX.Element => {
  const session = useSession();
  if (!books || books.length === 0)
    return (
      <>
        {books && books.length === 0 && (
          <p>No books in your reading list yet</p>
        )}
      </>
    );

  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <li key={book.id}>
          <div className="aspect-[3/4] bg-slate-100 p-6">
            <h2 className="mb-3 text-xl font-extrabold capitalize leading-tight">
              {book.title}
            </h2>
            <h3 className="mb-3 font-serif italic text-slate-600">
              {book.subtitle}
            </h3>
          </div>
          <section className="p-6">
            <p>By {book.authors.map(({ name }) => name).join(", ")}</p>
            {book.isbn10 && (
              <small className="mt-4 block text-slate-400">
                ISBN 10: {book.isbn10}
              </small>
            )}
            <small className="text-slate-400">ISBN 13: {book.isbn13}</small>
          </section>
          {session.data?.user && (
            <button
              className="inline-block aspect-square h-10 w-10 rounded-full bg-black font-semibold text-white no-underline transition hover:bg-black/80"
              onClick={() =>
                book.inReadingList ? onBookRemove(book.id) : onBookAdd(book.id)
              }
            >
              {book.inReadingList ? "-" : "+"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};
