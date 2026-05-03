export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  return prisma.countdown.findMany({
    where: { userId: user.id },
    orderBy: [{ targetDate: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      targetDate: true,
      recurring: true,
      recurrenceUnit: true,
      recurrenceValue: true,
      createdAt: true,
      updatedAt: true,
    },
  });
});
