import prisma from "../prisma";

export default eventHandler(async (event) => {
  const { id } = getQuery(event) as { id : string};
  console.log(`-${id}-`);
  try {
    await prisma.task.delete({ where: { id } });
    return { success: true, error: "" };
  } catch (e : any) {
    return { success: false, error: e.toString() as string};
  }
});
