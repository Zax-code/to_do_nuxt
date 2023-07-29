import prisma from "../prisma";

export default eventHandler(async (event) => {
  const { userId } = getQuery(event) as { userId: string };
  const tasks = await prisma.task.findMany({
    where: { userId },

  });
  return tasks.sort((a, b) => a.index - b.index);
});
