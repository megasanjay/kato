import { z } from "zod";

const recurrenceUnitSchema = z.enum(["day", "week", "month", "year"]);

const schema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    targetDate: z.coerce.date().optional(),
    recurring: z.boolean().optional(),
    recurrenceUnit: recurrenceUnitSchema.nullish(),
    recurrenceValue: z.number().int().min(1).max(365).nullish(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "No changes submitted",
  })
  .superRefine((value, context) => {
    if (value.recurring !== true) {
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
  const { id } = event.context.params as { id: string };
  const body = await readValidatedBody(event, schema.parse);

  const countdown = await prisma.countdown.findUnique({ where: { id } });

  if (!countdown || countdown.userId !== user.id) {
    throw createError({ statusCode: 404, message: "Countdown not found" });
  }

  const recurring = body.recurring ?? countdown.recurring;
  const recurrenceUnit =
    body.recurrenceUnit === undefined
      ? countdown.recurrenceUnit
      : body.recurrenceUnit;
  const recurrenceValue =
    body.recurrenceValue === undefined
      ? countdown.recurrenceValue
      : body.recurrenceValue;

  if (recurring && (!recurrenceUnit || !recurrenceValue)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Recurring countdowns need a unit and value",
    });
  }

  return prisma.countdown.update({
    where: { id },
    data: {
      title: body.title,
      targetDate: body.targetDate,
      recurring,
      recurrenceUnit: recurring ? recurrenceUnit : null,
      recurrenceValue: recurring ? recurrenceValue : null,
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
