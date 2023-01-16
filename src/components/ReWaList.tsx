import { useSession } from "next-auth/react";
import Image from "next/image";

export interface ReWaListItemType {
  id: string;
  title: string;
  thumbnail?: string;
  subtitle?: string;
  entitiesInfo?: string;
  additionalInfos?: Record<string, string>;
  year?: string;
  type: "book" | "video";
}

interface ItemsListPros {
  items?: ReWaListItemType[] | null;
  onItemRemove?: (id: string, type: "book" | "video") => void;
}

export const ReWaList = ({
  items,
  onItemRemove = () => undefined,
}: ItemsListPros): JSX.Element => {
  const session = useSession();
  if (!items || items.length === 0)
    return (
      <>
        {items && items.length === 0 && (
          <p>No items in your reading list yet</p>
        )}
      </>
    );

  return (
    <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="grid grid-cols-[100px,1fr,auto] gap-6">
          <div className="relative aspect-[10/15] bg-slate-100">
            {item.thumbnail && (
              <>
                <Image
                  src={item.thumbnail}
                  alt={`Thumbnail of "${item.title}"`}
                  fill
                  className="absolute top-0 left-0 object-cover"
                />
                <div className="border-slate-900/8 absolute inset-0 border" />
              </>
            )}
          </div>
          <section>
            <h2 className="mb-1 text-xl font-extrabold capitalize leading-tight">
              {item.title}
            </h2>
            <h3 className="mb-2 font-serif italic text-slate-600">
              {item.subtitle}
            </h3>
            {item.entitiesInfo && <p>{item.entitiesInfo}</p>}
            {item.additionalInfos &&
              Object.values(item.additionalInfos).length > 0 && (
                <div className="mt-4">
                  {Object.keys(item.additionalInfos).map((key) => (
                    <small className="block text-slate-400" key={key}>
                      {key}: {item.additionalInfos![key]}
                    </small>
                  ))}
                </div>
              )}
          </section>
          <div className="flex flex-col justify-between">
            {item.year && <span>{item.year}</span>}
            {session.data?.user && (
              <button
                className="inline-block aspect-square h-10 w-10 rounded-full bg-black font-semibold text-white no-underline transition hover:bg-black/80"
                onClick={() => onItemRemove(item.id, item.type)}
              >
                –
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
