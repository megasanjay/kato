// Server middleware that rejects requests without an admin user.
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session) {
    throw createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  // Get the user from the session
  const { user } = session;

  if (!user) {
    throw createError({
      message: "Unauthorized",
      statusCode: 401,
    });
  }

  // Check if the user is an admin
  if (!user.admin) {
    throw createError({
      message: "Forbidden",
      statusCode: 403,
    });
  }
});
