<template>
  <section class="px-6">
    <h1>About</h1>
    <p class="pt-1"></p>

    <n-divider />

    <div class="flex flex-col justify-start space-y-10 text-white">
      <div class="settings-option">
        <div class="flex flex-col space-y-2 pt-1">
          <p class="text-base">
            Kato is a simple dashboard for you. It is designed to be minimal and
            easy to use. The best way to use this app is to set it up as your
            default new tab page in your browser.
          </p>

          <div>
            <n-divider />
          </div>

          <p>
            The following extensions are recommended to switch to Kato as your
            default new tab page.
          </p>

          <div class="flex items-center space-x-4 py-3">
            <a
              href="https://chromewebstore.google.com/detail/icpgjfneehieebagbmdbhnlpiopdcmna?hl=en-US"
              target="_blank"
              rel="noopener"
            >
              <n-button color="#07518d" size="large" strong round>
                <template #icon>
                  <Icon name="ri:chrome-fill" />
                </template>
                New Tab Redirect on Chromium-based browsers
              </n-button>
            </a>

            <a
              href="https://addons.mozilla.org/en-US/firefox/addon/custom-new-tab-page/"
              target="_blank"
              rel="noopener"
            >
              <n-button color="#07518d" size="large" strong round>
                <template #icon>
                  <Icon name="ri:firefox-fill" />
                </template>
                Custom New Tab Page for Firefox based browsers
              </n-button>
            </a>
          </div>
        </div>
      </div>

      <n-divider />

      <div class="settings-option">
        <div class="flex flex-row items-center">
          <Icon name="simple-icons:github" size="25" />
          <p class="ml-2 text-xl font-semibold">GitHub</p>
        </div>

        <div class="flex flex-col space-y-2 pt-1">
          <p class="text-base">
            This website is built with ❤️ by
            <NuxtLink
              to="https://sanjaysoundarajan.dev"
              target="_blank"
              class="cursor-pointer"
              >Sanjay Soundararajan</NuxtLink
            >. You can find the source code on GitHub.
          </p>

          <div class="flex items-center space-x-4 py-3">
            <a
              href="https://github.com/megasanjay/kato"
              target="_blank"
              rel="noopener"
            >
              <n-button color="#07518d" size="large" strong round>
                <template #icon>
                  <Icon name="simple-icons:github" />
                </template>
                View on GitHub
              </n-button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
