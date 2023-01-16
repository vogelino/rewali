import type { Book, Video } from "@prisma/client";
import { z } from "zod";
import type { ReWaListItemType } from "../../../components/ReWaList";
import { createTRPCRouter, protectedProcedure } from "../trpc";

function rawBookToReWaLiItem(rawBook: Book): ReWaListItemType {
  const additionalInfos = {} as Record<string, string>;
  if (rawBook.isbn10) additionalInfos["ISBN 10"] = rawBook.isbn10;
  if (rawBook.isbn13) additionalInfos["ISBN 13"] = rawBook.isbn13;

  return {
    type: "book",
    id: rawBook.id,
    title: rawBook.title,
    subtitle: rawBook.subtitle || undefined,
    thumbnail: rawBook.cover || undefined,
    year: String(rawBook.releaseYear) || undefined,
    additionalInfos,
    entitiesInfo: `${rawBook.authors.join(", ")}`,
  };
}

function rawVideoToReWaLiItem(rawVideo: Video): ReWaListItemType {
  return {
    id: rawVideo.id,
    title: rawVideo.title,
    year: String(rawVideo.releaseYear) || undefined,
    subtitle: rawVideo.description || undefined,
    thumbnail: rawVideo.image || undefined,
    type: "video",
    additionalInfos: {
      Genres: rawVideo.genres.join(", "),
    },
    entitiesInfo: `${rawVideo.castMembers.join(", ")}`,
  };
}

export const reWaListRouter = createTRPCRouter({
  getReWaList: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input) return [];
      const params = {
        where: {
          inListOf: {
            some: {
              id: input,
            },
          },
        },
      };
      const [rawVideos, rawBooks] = await Promise.all([
        ctx.prisma.video.findMany(params),
        ctx.prisma.book.findMany(params),
      ]);
      const videos = rawVideos.map(rawVideoToReWaLiItem);
      const books = rawBooks.map(rawBookToReWaLiItem);
      return [...videos, ...books];
    }),
  addToReWaList: protectedProcedure
    .input(
      z.object({
        type: z.enum(["video", "book"]),
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const key = input.type === "video" ? "videosToWatch" : "booksToRead";
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          [key]: {
            connect: {
              id: input.id,
            },
          },
        },
      });
    }),
  removeFromReWaList: protectedProcedure
    .input(
      z.object({
        type: z.enum(["video", "book"]),
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const key = input.type === "video" ? "videosToWatch" : "booksToRead";
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          [key]: {
            disconnect: {
              id: input.id,
            },
          },
        },
      });
    }),
});
