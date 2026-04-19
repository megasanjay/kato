// Server middleware that rejects requests without an authenticated session user.
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
});
