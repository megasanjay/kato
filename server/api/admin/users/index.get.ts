const ITEM_LIMIT = 100;

export default defineEventHandler(async (event) => {
  await isAdmin(event);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      firstName: true,
      createdAt: true,
      _count: {
        select: {
          todos: true,
          notes: true,
          countdowns: true,
        },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    createdAt: user.createdAt,
    limits: {
      todos: { current: user._count.todos, max: ITEM_LIMIT },
      notes: { current: user._count.notes, max: ITEM_LIMIT },
      countdowns: { current: user._count.countdowns, max: ITEM_LIMIT },
    },
  }));
});
