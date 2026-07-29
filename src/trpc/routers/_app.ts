import { baseProcedure, createTRPCRouter } from '../init';
 
export const appRouter = createTRPCRouter({
  health: baseProcedure.query(async () => {
  
    return { status: "ok", code: 5677}
  })
});
 
// export type definition of API
export type AppRouter = typeof appRouter;