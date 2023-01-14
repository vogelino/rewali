import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.string().optional())
    .query(({ ctx, input }) => {
      if (!input) return null;
      return ctx.prisma.user.findUnique({
        where: { id: input },
      });
    }),
});
