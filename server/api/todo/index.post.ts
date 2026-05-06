import { z } from "zod";

export default defineEventHandler(async (event) => {
  const {
    public: { limits },
  } = useRuntimeConfig(event);
  const schema = z.object({
    content: z.string().min(1).max(limits.text.todoMaxLength),
  });
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, schema.parse);

  const count = await prisma.todo.count({ where: { userId: user.id } });

  if (count >= limits.itemLimit) {
    throw createError({
      statusCode: 429,
      statusMessage: "Todo limit reached",
    });
  }

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
