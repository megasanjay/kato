<template>
  <div class="mt-[8%] flex justify-center shadow-md">
    <div
      class="flex h-[60px] items-center justify-start rounded-[30px] bg-white/20 px-3 py-2 text-white backdrop-blur-sm transition-all"
    >
      <Icon name="tabler:world-search" size="30" />
      <input
        v-model="inputTerm"
        type="text"
        class="mx-2 w-[450px] border-transparent bg-transparent px-2 text-2xl focus:outline-none focus:ring-0"
        placeholder="Search"
        @keyup.enter="runSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const inputTerm = ref("");

const searchEngines = ["google", "bing", "yahoo", "duckduckgo"];

const searchEngine = ref(searchEngines[0]);

const runSearch = () => {
  const searchTerm = inputTerm.value;

  if (searchTerm !== "") {
    switch (searchEngine.value) {
      case "google":
        window.open(`https://www.google.com/search?q=${searchTerm}`);
        break;
      case "bing":
        window.open(`https://www.bing.com/search?q=${searchTerm}`);
        break;
      case "yahoo":
        window.open(`https://search.yahoo.com/search?p=${searchTerm}`);
        break;
      case "duckduckgo":
        window.open(`https://duckduckgo.com/?q=${searchTerm}`);
        break;
      default:
        window.open(`https://www.google.com/search?q=${searchTerm}`);
        break;
    }

    inputTerm.value = "";
  }
};
</script>
