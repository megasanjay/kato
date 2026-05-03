const ITEM_LIMIT = 100;

export default defineEventHandler(async (event) => {
  await isAdmin(event);

  const today = new Date().toISOString().slice(0, 10);

  const [
    usersCount,
    adminUsersCount,
    wallpapersCount,
    todosCount,
    notesCount,
    countdownsCount,
    upcomingWallpapersCount,
    todayWallpapersCount,
    outlinedWallpapersCount,
    users,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.count({ where: { admin: true } }),
    prisma.background.count(),
    prisma.todo.count(),
    prisma.note.count(),
    prisma.countdown.count(),
    prisma.background.count({ where: { date: { gt: today } } }),
    prisma.background.count({ where: { date: today } }),
    prisma.background.count({ where: { addTextStroke: true } }),
    prisma.user.findMany({
      select: {
        id: true,
        _count: {
          select: {
            todos: true,
            notes: true,
            countdowns: true,
          },
        },
      },
    }),
  ]);

  const userCount = users.length || 1;

  let todosAtOrOverLimit = 0;
  let notesAtOrOverLimit = 0;
  let countdownsAtOrOverLimit = 0;
  let maxTodosUsagePercent = 0;
  let maxNotesUsagePercent = 0;
  let maxCountdownsUsagePercent = 0;

  for (const user of users) {
    const todosUsage = Math.round((user._count.todos / ITEM_LIMIT) * 100);
    const notesUsage = Math.round((user._count.notes / ITEM_LIMIT) * 100);
    const countdownsUsage = Math.round(
      (user._count.countdowns / ITEM_LIMIT) * 100,
    );

    maxTodosUsagePercent = Math.max(maxTodosUsagePercent, todosUsage);
    maxNotesUsagePercent = Math.max(maxNotesUsagePercent, notesUsage);
    maxCountdownsUsagePercent = Math.max(
      maxCountdownsUsagePercent,
      countdownsUsage,
    );

    if (user._count.todos >= ITEM_LIMIT) {
      todosAtOrOverLimit += 1;
    }

    if (user._count.notes >= ITEM_LIMIT) {
      notesAtOrOverLimit += 1;
    }

    if (user._count.countdowns >= ITEM_LIMIT) {
      countdownsAtOrOverLimit += 1;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      users: usersCount,
      adminUsers: adminUsersCount,
      wallpapers: wallpapersCount,
      todos: todosCount,
      notes: notesCount,
      countdowns: countdownsCount,
    },
    wallpapers: {
      today: todayWallpapersCount,
      upcoming: upcomingWallpapersCount,
      outlined: outlinedWallpapersCount,
    },
    limits: {
      itemLimit: ITEM_LIMIT,
      usersAtOrOverLimit: {
        todos: todosAtOrOverLimit,
        notes: notesAtOrOverLimit,
        countdowns: countdownsAtOrOverLimit,
      },
      maxUsagePercent: {
        todos: maxTodosUsagePercent,
        notes: maxNotesUsagePercent,
        countdowns: maxCountdownsUsagePercent,
      },
      averagePerUser: {
        todos: Number((todosCount / userCount).toFixed(2)),
        notes: Number((notesCount / userCount).toFixed(2)),
        countdowns: Number((countdownsCount / userCount).toFixed(2)),
      },
    },
  };
});
