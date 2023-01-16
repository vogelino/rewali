import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { bookRouter } from "./routers/book";
import { videoRouter } from "./routers/video";
import { reWaListRouter } from "./routers/reWaList";
import { searchRouter } from "./routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  book: bookRouter,
  user: userRouter,
  video: videoRouter,
  reWaList: reWaListRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
