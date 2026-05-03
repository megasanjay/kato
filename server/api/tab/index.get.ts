export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const { user } = session;

  const currentView = await prisma.currentView.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!currentView) {
    throw createError({
      statusCode: 404,
      message: "Current view not found",
    });
  }

  console.log("Current view for user", user.id, currentView);

  return {
    currentTab: currentView.tabName,
  };
});
