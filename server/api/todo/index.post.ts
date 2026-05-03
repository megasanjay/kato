import { z } from "zod";

const schema = z.object({
  content: z.string().min(1).max(500),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, schema.parse);

  return prisma.todo.create({
    data: {
      userId: user.id,
      content: body.content,
    },
    select: {
      id: true,
      content: true,
      isCompleted: true,
    },
  });
});
