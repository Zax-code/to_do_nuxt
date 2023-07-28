import prisma from "../prisma";

export default eventHandler(async () => {
  const tasks = await prisma.task.findMany();
  return tasks.sort((a, b) => a.index - b.index);
});
