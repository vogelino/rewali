import type { Author } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const bookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        isbn13: z.number().optional(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        isbn10: z.number().optional(),
        cover: z.string().optional(),
        authors: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authors = [] as Author[];
      for (const author of input.authors || []) {
        const authorObj = await ctx.prisma.author.findUnique({
          where: { id: author },
        });
        if (authorObj) authors.push(authorObj);
      }
      return ctx.prisma.book.create({
        data: {
          ...input,
          isbn10: input.isbn10 ? String(input.isbn10) : undefined,
          isbn13: String(input.isbn13),
          authors: {
            create: authors,
          },
        },
      });
    }),
});
