import { z } from "zod";

const schema = z.object({
  name: z.string(),
});

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const { user } = session;

  const body = await readValidatedBody(event, schema.parse);

  // upsert current view for the user with the new tab name
  const updateView = await prisma.currentView.upsert({
    where: {
      userId: user.id,
    },
    update: {
      tabName: body.name,
    },
    create: {
      userId: user.id,
      tabName: body.name,
    },
  });

  if (!updateView) {
    throw createError({
      statusCode: 500,
      message: "Failed to update current view",
    });
  }

  return updateView;
});
