// Session type augmentation for nuxt-auth-utils user and session payloads.
declare module "#auth-utils" {
  interface User {
    id: string;

    givenName: string;
    familyName: string;
    emailAddress: string;

    emailVerified: boolean;
  }

  interface UserSession {
    userSessionField: string;
  }

  interface SecureSessionData {
    secureSessionField: string;
  }
}

export {};
