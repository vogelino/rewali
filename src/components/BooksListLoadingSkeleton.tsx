type PropsType = {
  itemsCount?: number;
};

export function BooksListLoadingSkeleton({ itemsCount = 4 }: PropsType) {
  const arrayOfLength = new Array(itemsCount);
  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {arrayOfLength.map((_, idx) => (
        <li key={idx}>
          <div className="aspect-[3/4] animate-pulse bg-slate-100" />
          <section className="p-6">
            <small className="mb-6 inline-block h-6 w-3/4 animate-pulse bg-slate-100" />
            <small className="mb-2 inline-block h-4 w-3/4 animate-pulse bg-slate-100" />
            <small className="mb-2 inline-block h-4 w-3/4 animate-pulse bg-slate-100" />
          </section>
        </li>
      ))}
    </ul>
  );
}
