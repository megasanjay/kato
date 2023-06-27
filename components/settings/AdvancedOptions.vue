<template>
  <section class="px-6">
    <h1>Advanced Options</h1>
    <p class="pt-1">
      These options are not recommended to be changed unless you know what you
      are doing.
    </p>

    <n-divider />

    <div class="flex flex-col justify-start space-y-10 text-white">
      <div class="settings-option">
        <div class="flex flex-row items-center">
          <Icon name="mingcute:cookie-man-fill" size="25" />
          <p class="ml-2 text-xl font-semibold">Cookies</p>
        </div>

        <div class="flex flex-col space-y-2 pt-1">
          <p class="text-base">
            Use this page to clear all cookies stored on your device. This will
            log you out of your account and delete any data you have stored on
            your device.
          </p>

          <div class="py-3">
            <n-button
              color="#07518d"
              size="large"
              strong
              round
              @click="clearCookies"
            >
              <Icon name="material-symbols:cookie-off" size="20" class="mr-2" />
              Clear cookies
            </n-button>
          </div>
        </div>
      </div>

      <n-divider />

      <div class="settings-option">
        <div class="flex flex-row items-center">
          <Icon name="carbon:block-storage-alt" size="25" />
          <p class="ml-2 text-xl font-semibold">Local Storage</p>
        </div>

        <div class="flex flex-col space-y-2 pt-1">
          <p class="text-base">
            Kato stores some data on your device using your browsers local
            storage. This data is not synced with the cloud and is only stored
            on your device. Use this page to clear all data stored on your
            device.
          </p>

          <div class="py-3">
            <n-button
              color="#07518d"
              size="large"
              strong
              round
              @click="clearLocalStorage"
            >
              <Icon
                name="material-symbols:layers-clear"
                size="20"
                class="mr-2"
              />
              Clear local storage
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";

const message = useMessage();

const clearCookies = () => {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  message.success("Cookies have been cleared.");

  navigateTo("/");
};

const clearLocalStorage = () => {
  window.localStorage.clear();

  message.success("Local storage has been cleared.");

  navigateTo("/");
};
</script>
