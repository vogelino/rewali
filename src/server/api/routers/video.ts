import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const videoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        authors: z
          .array(
            z.union([
              z.string(),
              z.object({
                name: z.string(),
                image: z.string().optional(),
              }),
            ])
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authors = [];
      for (const author of input.authors || []) {
        if (typeof author === "string") {
          const authorObj = await ctx.prisma.author.findUnique({
            where: { id: author },
          });
          if (authorObj) authors.push(authorObj);
        } else if (author !== null && "name" in author) {
          authors.push(author);
        }
      }
      return ctx.prisma.video.create({
        data: {
          ...input,
          authors: {
            create: authors,
          },
        },
      });
    }),
});
