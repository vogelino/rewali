import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const videoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        genres: z.array(z.string()).optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        castMembers: z.array(z.string()).optional(),
        releaseYear: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input: data }) => {
      return ctx.prisma.video.create({
        data,
      });
    }),
});
