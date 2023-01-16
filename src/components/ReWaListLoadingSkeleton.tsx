type PropsType = {
  itemsCount?: number;
};

export function ReWaListLoadingSkeleton({ itemsCount = 4 }: PropsType) {
  const arrayOfLength = Array(itemsCount).fill(null);
  return (
    <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {arrayOfLength.map((_, idx) => (
        <li key={idx} className="grid grid-cols-[100px,1fr] gap-6">
          <div className="relative aspect-[10/15] animate-pulse bg-slate-100" />
          <section>
            <div className="mb-1 h-6 w-4/5 animate-pulse bg-slate-100" />
            <div className="mb-1 h-4 w-3/4 animate-pulse bg-slate-100" />
            <div className="mb-3 h-3 w-1/2 animate-pulse bg-slate-100" />
            <div className="mb-1 h-3 w-1/4 animate-pulse bg-slate-100" />
            <div className="mb-0 h-3 w-1/4 animate-pulse bg-slate-100" />
          </section>
        </li>
      ))}
    </ul>
  );
}
