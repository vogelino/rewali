import { z } from "zod";

// import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const bookRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.book.findUnique({
      where: { id: input },
    });
  }),
  getByName: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.book.findUnique({
      where: { title: input },
    });
  }),
  getByIsbn10: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.book.findUnique({
      where: { isbn10: input },
    });
  }),
  userReadingList: protectedProcedure
    .input(z.string().optional())
    .query(({ ctx, input }) => {
      if (!input) return [];
      return ctx.prisma.book.findMany({
        where: {
          inListOf: {
            some: {
              id: input,
            },
          },
        },
        include: {
          authors: true,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany({
      include: {
        authors: true,
      },
    });
  }),
  addToReadingList: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          booksToRead: {
            connect: {
              id: input,
            },
          },
        },
      });
    }),
  removeFromReadingList: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          booksToRead: {
            disconnect: {
              id: input,
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        isbn13: z.string(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        isbn10: z.string().optional(),
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
      return ctx.prisma.book.create({
        data: {
          ...input,
          authors: {
            create: authors,
          },
        },
      });
    }),
});
