export default defineEventHandler(async (event) => {
  const {
    public: { limits },
  } = useRuntimeConfig(event);
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
      todos: { current: user._count.todos, max: limits.itemLimit },
      notes: { current: user._count.notes, max: limits.itemLimit },
      countdowns: { current: user._count.countdowns, max: limits.itemLimit },
    },
  }));
});
