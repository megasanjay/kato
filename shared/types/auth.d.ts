// Session type augmentation for nuxt-auth-utils user and session payloads.
declare module "#auth-utils" {
  interface User {
    id: string;

    firstName: string;
    lastName: string;
    username: string;
  }

  interface UserSession {
    userSessionField: string;
  }

  interface SecureSessionData {
    secureSessionField: string;
  }
}

export {};
