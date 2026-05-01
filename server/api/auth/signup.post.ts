// Auth endpoint that registers a user and prepares optional email verification state.
import { z } from "zod";
import { hash } from "bcrypt";

const signupSchema = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string().optional(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if ("user" in session) {
    return sendRedirect(event, "/");
  }

  const body = await readValidatedBody(event, (b) => signupSchema.safeParse(b));

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing or invalid signup details",
    });
  }

  // Check if the user already exists
  const user = await prisma.user.findUnique({
    where: {
      username: body.data.username,
    },
  });

  if (user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User already exists",
    });
  }

  // Create a new user
  const hashedPassword = await hash(body.data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      username: body.data.username,
      firstName: body.data.firstName,
      lastName: body.data.lastName,
      password: hashedPassword,
    },
  });

  if (!newUser) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error creating user",
    });
  }

  return { message: "User created successfully" };
});
