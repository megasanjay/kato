// Refresh authenticated sessions on app/API requests by rolling the session timestamp forward.
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  if (
    path.startsWith("/_nuxt/") ||
    path.startsWith("/__nuxt_error") ||
    path.startsWith("/favicon") ||
    path.startsWith("/site.webmanifest")
  ) {
    return;
  }

  const session = await getUserSession(event);

  if (!session.user) {
    return;
  }

  const runtimeConfig = useRuntimeConfig(event);
  const sessionName = runtimeConfig.session.name || "nuxt-session";
  const activeSession = event.context.sessions?.[sessionName];

  if (!activeSession) {
    return;
  }

  activeSession.createdAt = Date.now();
  await setUserSession(event, {
    user: session.user,
    userSessionField: session.userSessionField ?? "",
  });
});
