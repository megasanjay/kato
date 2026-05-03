import { z } from "zod";

const recurrenceUnitSchema = z.enum(["day", "week", "month", "year"]);

const schema = z
  .object({
    title: z.string().trim().min(1).max(120),
    targetDate: z.coerce.date(),
    recurring: z.boolean().default(false),
    recurrenceUnit: recurrenceUnitSchema.nullish(),
    recurrenceValue: z.number().int().min(1).max(365).nullish(),
  })
  .superRefine((value, context) => {
    if (!value.recurring) {
      return;
    }

    if (!value.recurrenceUnit) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurrenceUnit"],
        message: "Recurrence unit is required for recurring countdowns",
      });
    }

    if (!value.recurrenceValue) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurrenceValue"],
        message: "Recurrence value is required for recurring countdowns",
      });
    }
  });

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readValidatedBody(event, schema.parse);

  const count = await prisma.countdown.count({ where: { userId: user.id } });

  if (count >= 100) {
    throw createError({
      statusCode: 429,
      statusMessage: "Countdown limit reached",
    });
  }

  return prisma.countdown.create({
    data: {
      userId: user.id,
      title: body.title,
      targetDate: body.targetDate,
      recurring: body.recurring,
      recurrenceUnit: body.recurring ? body.recurrenceUnit : null,
      recurrenceValue: body.recurring ? body.recurrenceValue : null,
    },
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
