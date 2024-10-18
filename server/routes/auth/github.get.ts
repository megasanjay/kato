export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }) {
    const githubUserId = user.id;
    const name = user.name.split(" ")[0] || "";
    let userId = "";

    const userExists = await prisma.user.findFirst({
      where: {
        oauthProvider: "github",
        oauthId: githubUserId.toString(),
        name,
      },
    });

    if (!userExists) {
      const u = await prisma.user.create({
        data: {
          oauthProvider: "github",
          oauthId: githubUserId.toString(),
          name,
        },
      });

      userId = u.id;
    } else {
      userId = userExists.id;
    }

    const userSession = {
      id: userId,
      name: user.name.split(" ")[0] || "",
    };

    await setUserSession(event, {
      user: userSession,
    });
    return sendRedirect(event, "/profile");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
