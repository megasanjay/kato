<script setup>
const { loggedIn, user, session, fetch, clear } = useUserSession();
</script>

<template>
  <div v-if="loggedIn" class="h-full overflow-auto">
    <pre>
      {{ user }}
    </pre>
    <h1>Welcome {{ user.login }}!</h1>
    <p>Logged in since {{ session.loggedInAt }}</p>
    <button @click="clear">Logout</button>
  </div>
  <div v-else>
    <h1>Not logged in</h1>
    <a href="/auth/github">Login with GitHub</a>
  </div>
</template>
