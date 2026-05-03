<script setup lang="ts">
interface Todo {
  id: string;
  content: string;
  isCompleted: boolean;
}

const { loggedIn } = useUserSession();

const { data, error } = await useFetch<Todo[]>("/api/todo");

const todos = ref<Todo[]>(data.value ?? []);

if (error.value) {
  console.error("Error fetching todos:", error.value);
}

const TODO_MAX_LENGTH = 500;

const newContent = ref("");
const isAdding = ref(false);
const isClearingCompleted = ref(false);

const todoCharCount = computed(() => newContent.value.length);
const todoAtLimit = computed(() => todoCharCount.value >= TODO_MAX_LENGTH);

const addTodo = async () => {
  const content = newContent.value.trim();

  if (!content) return;

  isAdding.value = true;

  try {
    const created = await $fetch<Todo>("/api/todo", {
      method: "POST",
      body: { content },
    });

    todos.value.push(created);
    newContent.value = "";
  } catch (e) {
    console.error("Failed to add todo:", e);
  } finally {
    isAdding.value = false;
  }
};

const toggleTodo = async (todo: Todo) => {
  const previous = todo.isCompleted;
  todo.isCompleted = !previous;

  try {
    const response = await fetch(`/api/todo/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isCompleted: todo.isCompleted }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (e) {
    todo.isCompleted = previous;
    console.error("Failed to toggle todo:", e);
  }
};

const deleteTodo = async (id: string) => {
  const index = todos.value.findIndex((t) => t.id === id);

  if (index === -1) return;

  const removed = todos.value[index]!;
  todos.value.splice(index, 1);

  try {
    await $fetch(`/api/todo/${id}`, { method: "DELETE" });
  } catch (e) {
    todos.value.splice(index, 0, removed);
    console.error("Failed to delete todo:", e);
  }
};

const completedTasksCount = computed(
  () => todos.value.filter((t) => t.isCompleted).length,
);

const clearCompletedTodos = async () => {
  if (isClearingCompleted.value) return;

  const previousTodos = [...todos.value];
  const removedTodos = todos.value.filter((todo) => todo.isCompleted);

  if (removedTodos.length === 0) return;

  isClearingCompleted.value = true;

  todos.value = todos.value.filter((todo) => !todo.isCompleted);

  try {
    await $fetch("/api/todo/completed", {
      method: "DELETE",
    });
  } catch (e) {
    todos.value = previousTodos;
    console.error("Failed to clear completed todos:", e);
  } finally {
    isClearingCompleted.value = false;
  }
};

const onInputKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") addTodo();
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
      <div class="flex items-center gap-2">
        <input
          v-model="newContent"
          type="text"
          placeholder="Add a task..."
          :maxlength="TODO_MAX_LENGTH"
          class="flex-1 bg-transparent text-sm text-white/70 placeholder-white/50 outline-none disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="isAdding"
          @keydown="onInputKeydown"
        />

        <span
          v-if="newContent.length > 0"
          class="text-xs transition-colors"
          :class="todoAtLimit ? 'text-red-400/70' : 'text-white/25'"
          >{{ todoCharCount }}/{{ TODO_MAX_LENGTH }}</span
        >

        <button
          type="button"
          class="cursor-pointer text-white/30 transition-colors hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-30"
          :disabled="isAdding || !newContent.trim()"
          @click="addTodo"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
        </button>

        <UTooltip
          v-if="completedTasksCount > 0"
          text="Delete all completed tasks"
        >
          <button
            type="button"
            class="cursor-pointer text-white/30 transition-colors hover:text-white/60 disabled:cursor-not-allowed disabled:opacity-30"
            :disabled="
              isClearingCompleted || !todos.some((todo) => todo.isCompleted)
            "
            @click="clearCompletedTodos"
          >
            <UIcon name="i-lucide-trash" class="size-4" />
          </button>
        </UTooltip>
      </div>

      <TransitionGroup
        name="todo-item"
        tag="ul"
        class="relative flex flex-col gap-1"
      >
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="group/item flex items-center gap-3"
        >
          <button
            type="button"
            class="flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors"
            :class="
              todo.isCompleted
                ? 'border-white/40 bg-white/20'
                : 'border-white/20 hover:border-white/40'
            "
            @click="toggleTodo(todo)"
          >
            <UIcon
              v-if="todo.isCompleted"
              name="i-lucide-check"
              class="size-2.5 text-white/60"
            />
          </button>

          <span
            class="flex-1 text-sm transition-colors"
            :class="
              todo.isCompleted ? 'text-white/25 line-through' : 'text-white/60'
            "
          >
            {{ todo.content }}
          </span>

          <button
            type="button"
            class="text-white/0 transition-colors group-hover/item:text-white/25 hover:!text-white/50"
            @click="deleteTodo(todo.id)"
          >
            <UIcon name="material-symbols:delete" class="size-3.5" />
          </button>
        </li>
      </TransitionGroup>

      <p v-if="todos.length === 0" class="text-sm text-white/25">
        You've caught up with all your tasks!
      </p>
    </div>
  </div>
</template>

<style scoped>
.todo-item-move,
.todo-item-enter-active,
.todo-item-leave-active {
  transition: all 0.25s ease;
}

.todo-item-enter-from,
.todo-item-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.todo-item-leave-active {
  position: absolute;
  width: 100%;
}
</style>
