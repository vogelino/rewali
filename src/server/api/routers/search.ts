import { z } from "zod";
import { searchGoogleBooks } from "../../../utils/googleUtil";
import { searchIMDBItems } from "../../../utils/imdbUtil";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  searchItem: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const [videos, books] = await Promise.all([
      searchIMDBItems(input),
      searchGoogleBooks(input),
    ]);
    return { videos, books };
  }),
});
