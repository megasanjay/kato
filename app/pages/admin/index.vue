<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

await navigateTo("/admin/wallpaper", { replace: true });
</script>
