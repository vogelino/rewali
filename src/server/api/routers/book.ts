import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const bookRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        cover: z.string().optional(),
        authors: z.array(z.string()).optional(),
        isbn10: z.number().optional(),
        isbn13: z.number().optional(),
        releaseYear: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.book.create({
        data: {
          ...input,
          isbn10: input.isbn10 ? String(input.isbn10) : undefined,
          isbn13: String(input.isbn13),
        },
      });
    }),
});
