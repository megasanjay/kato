<template>
  <section class="px-6">
    <h1>Changelog</h1>
    <p class="pt-1"></p>

    <n-divider />

    <div class="flex flex-col justify-start space-y-10 text-white">
      <div class="settings-option">
        <div class="flex flex-col space-y-2 pt-1">
          <p class="text-base">
            All changes to the dashboard are documented in the changelog. You
            can view the changelog by clicking the button below.
          </p>

          <div class="flex items-center space-x-4 py-3">
            <a href="https://changelog.kato.day" target="_blank" rel="noopener">
              <n-button color="#07518d" size="large" strong round>
                <template #icon>
                  <Icon name="simple-icons:keepachangelog" />
                </template>
                View Changelog
              </n-button>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
