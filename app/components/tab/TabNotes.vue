<script setup lang="ts">
import { faker } from "@faker-js/faker";

interface Note {
  id: string;
  title: string;
  content: string;
}

const { loggedIn } = useUserSession();
const toast = useToast();

const ITEM_LIMIT = 100;
const ITEM_WARN_THRESHOLD = 90;

const NOTE_MAX_LENGTH = 500;
const NOTE_TITLE_MAX_LENGTH = 120;

const { data, error } = await useFetch<Note[]>("/api/note");

const notes = ref<Note[]>(data.value ?? []);

if (error.value) {
  console.error("Error fetching notes:", error.value);
}

const newContent = ref("");
const newTitle = ref("");
const isAdding = ref(false);

const noteCharCount = computed(() => newContent.value.length);
const noteAtLimit = computed(() => noteCharCount.value >= NOTE_MAX_LENGTH);
const titleCharCount = computed(() => newTitle.value.length);
const titleAtLimit = computed(
  () => titleCharCount.value >= NOTE_TITLE_MAX_LENGTH,
);

const randomTitle = () =>
  `${faker.word.adjective()}-${faker.word.noun()}-${faker.word.verb()}`;

const getDisplayTitle = (note: Note) => {
  return note.title?.trim() || "Untitled note";
};

const getPreview = (note: Note) => {
  const normalized = note.content.replace(/\s+/g, " ").trim();

  return normalized.slice(0, 72);
};

const addNote = async () => {
  const content = newContent.value.trim();

  if (!content) return;

  if (notes.value.length >= ITEM_LIMIT) {
    toast.add({
      title: "Limit reached",
      description: `You've reached the ${ITEM_LIMIT} note limit. Delete some to add more.`,
      color: "error",
    });

    return;
  }

  const title = newTitle.value.trim() || randomTitle();

  isAdding.value = true;

  try {
    const created = await $fetch<Note>("/api/note", {
      method: "POST",
      body: { title, content },
    });

    notes.value.push(created);
    newTitle.value = "";
    newContent.value = "";

    const count = notes.value.length;

    if (count >= ITEM_LIMIT) {
      toast.add({
        title: "Limit reached",
        description: `You've reached the ${ITEM_LIMIT} note limit. Delete some to add more.`,
        color: "error",
      });
    } else if (count >= ITEM_WARN_THRESHOLD) {
      toast.add({
        title: "Approaching limit",
        description: `You have ${count}/${ITEM_LIMIT} notes.`,
        color: "warning",
      });
    }
  } catch (e) {
    toast.add({
      title: "Limit reached",
      description: `You've reached the ${ITEM_LIMIT} note limit. Delete some to add more.`,
      color: "error",
    });
    console.error("Failed to add note:", e);
  } finally {
    isAdding.value = false;
  }
};

const deleteNote = async (id: string) => {
  const index = notes.value.findIndex((n) => n.id === id);

  if (index === -1) return;

  const removed = notes.value[index]!;
  notes.value.splice(index, 1);

  try {
    await $fetch(`/api/note/${id}`, { method: "DELETE" });
  } catch (e) {
    notes.value.splice(index, 0, removed);
    console.error("Failed to delete note:", e);
  }
};

const selectedNote = ref<Note | null>(null);
const isModalOpen = ref(false);

const openNote = (note: Note) => {
  selectedNote.value = note;
  isModalOpen.value = true;
};

const copied = ref(false);

const copyContent = async () => {
  if (!selectedNote.value) return;
  await navigator.clipboard.writeText(selectedNote.value.content);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

const onInputKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addNote();
  }
};
</script>

<template>
  <div>
    <p v-if="!loggedIn" class="mt-2 ml-1 text-sm text-white/20">
      This feature is only available to logged-in users. <br />
      Please
      <NuxtLink
        to="/login"
        class="underline underline-offset-2 transition-colors hover:text-white/80"
        >log in</NuxtLink
      >
      or
      <NuxtLink
        to="/signup"
        class="underline underline-offset-2 transition-colors hover:text-white/80"
        >sign up</NuxtLink
      >
      for access to this feature!
    </p>

    <div v-else class="flex flex-col gap-1">
      <div class="flex items-start gap-2">
        <div class="flex-1 space-y-2">
          <div class="relative">
            <input
              v-model="newTitle"
              type="text"
              placeholder="Title (optional)"
              :maxlength="NOTE_TITLE_MAX_LENGTH"
              class="w-full bg-transparent text-sm text-white/70 placeholder-white/50 outline-none disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="isAdding"
            />

            <div class="absolute right-0 bottom-0 mt-1 flex justify-end">
              <span
                v-if="newTitle.length > 0"
                class="text-xs transition-colors"
                :class="titleAtLimit ? 'text-red-400/70' : 'text-white/25'"
                >{{ titleCharCount }}/{{ NOTE_TITLE_MAX_LENGTH }}</span
              >
            </div>
          </div>

          <div class="relative">
            <textarea
              v-model="newContent"
              placeholder="Add a note..."
              :maxlength="NOTE_MAX_LENGTH"
              rows="2"
              class="w-full resize-none bg-transparent text-sm text-white/70 placeholder-white/50 outline-none disabled:cursor-not-allowed disabled:opacity-30"
              :disabled="isAdding"
              @keydown="onInputKeydown"
            />

            <div class="absolute right-0 bottom-0 mt-1 flex justify-end">
              <span
                v-if="newContent.length > 0"
                class="text-xs transition-colors"
                :class="noteAtLimit ? 'text-red-400/70' : 'text-white/25'"
                >{{ noteCharCount }}/{{ NOTE_MAX_LENGTH }}</span
              >
            </div>
          </div>
        </div>

        <div class="mt-1 flex flex-col items-end gap-1">
          <button
            type="button"
            class="cursor-pointer text-white/30 transition-colors hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-30"
            :disabled="isAdding || !newContent.trim()"
            @click="addNote"
          >
            <UIcon name="i-lucide-plus" class="size-4" />
          </button>
        </div>
      </div>

      <UModal
        v-model:open="isModalOpen"
        :title="selectedNote ? getDisplayTitle(selectedNote) : ''"
      >
        <template #body>
          <p class="text-sm whitespace-pre-wrap text-white/70">
            {{ selectedNote?.content }}
          </p>
        </template>

        <template #footer>
          <button
            type="button"
            class="flex items-center gap-1.5 text-sm transition-colors"
            :class="
              copied ? 'text-white/60' : 'text-white/30 hover:text-white/60'
            "
            @click="copyContent"
          >
            <UIcon
              :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              class="size-3.5"
            />
            {{ copied ? "Copied" : "Copy" }}
          </button>
        </template>
      </UModal>

      <TransitionGroup
        name="note-item"
        tag="ul"
        class="relative mt-1 flex flex-col gap-2"
      >
        <li
          v-for="note in notes"
          :key="note.id"
          class="group/item flex items-center items-start gap-2"
        >
          <button
            type="button"
            class="min-w-0 flex-1 cursor-pointer text-left"
            @click="openNote(note)"
          >
            <p
              class="truncate text-sm text-white/60 transition-colors group-hover/item:text-white/80"
            >
              {{ getDisplayTitle(note) }}
            </p>

            <p
              class="truncate text-xs text-white/35 transition-colors group-hover/item:text-white/50"
            >
              {{ getPreview(note) }}
            </p>
          </button>

          <button
            type="button"
            class="mt-0.5 shrink-0 cursor-pointer text-white/0 transition-colors group-hover/item:text-white/25 hover:!text-white/50"
            @click="deleteNote(note.id)"
          >
            <UIcon name="material-symbols:delete" class="size-3.5" />
          </button>
        </li>
      </TransitionGroup>

      <p v-if="notes.length === 0" class="text-sm text-white/25">
        No notes yet. Add one above!
      </p>
    </div>
  </div>
</template>

<style scoped>
.note-item-move,
.note-item-enter-active,
.note-item-leave-active {
  transition: all 0.25s ease;
}

.note-item-enter-from,
.note-item-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.note-item-leave-active {
  position: absolute;
  width: 100%;
}
</style>
