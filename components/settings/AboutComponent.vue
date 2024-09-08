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
            easy to use. The best way to use this app is to set it up as your default new tab page in your browser. <br><br>
            The following extensions are recommended to switch to Kato as your default new tab page.
          </p>

          <div class="flex items-center space-x-4 py-3">
            <a href="https://chromewebstore.google.com/detail/icpgjfneehieebagbmdbhnlpiopdcmna?hl=en-US" target="_blank" rel="noopener">
              <n-button color="#07518d" size="large" strong round>
                <template #icon>
                  <Icon name="ri:chrome-fill" />
                </template>
                New Tab Redirect on Google Chrome
              </n-button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
