// Nuxt UI theme defaults shared across the application.
export default defineAppConfig({
  ui: {
    button: {
      defaultVariants: {
        size: "lg",
      },
      slots: {
        base: "cursor-pointer rounded-lg",
      },
    },
    colors: {
      neutral: "zinc",
      primary: "white",
    },
    input: {
      slots: {
        root: "w-full",
      },
    },
    progress: {
      slots: {
        base: "relative overflow-hidden rounded-full bg-white/10",
      },
      variants: {
        color: {
          neutral: {
            indicator: "bg-white/60",
          },
        },
      },
    },
    tabs: {
      slots: {
        list: "border-white/15",
        indicator: "bg-white/60",
        trigger:
          "data-[state=inactive]:text-white/30 hover:data-[state=inactive]:not-disabled:text-white/60 data-[state=active]:text-white/80 font-medium transition-colors",
        content: "focus:outline-none w-full",
      },
      variants: {
        variant: {
          link: {
            list: "border-white/15",
          },
        },
      },
      compoundVariants: [
        {
          color: "neutral",
          variant: "link",
          class: {
            indicator: "bg-white/60",
            trigger:
              "data-[state=active]:text-white/80 focus-visible:ring-white/20",
          },
        },
      ],
    },
    modal: {
      slots: {
        overlay: "fixed inset-0 !bg-black/50",
        content:
          "bg-zinc-900/90 backdrop-blur-md border border-white/10 divide-y divide-white/10 flex flex-col focus:outline-none",
        header:
          "flex items-center gap-1.5 px-5 py-4 min-h-(--ui-header-height)",
        body: "flex-1 px-5 py-4",
        footer: "flex items-center gap-1.5 px-5 py-4",
        title: "text-white/85 font-medium",
        description: "mt-1 text-white/50 text-sm",
        close:
          "absolute top-4 end-4 text-white/40 hover:text-white/70 transition-colors",
      },
      variants: {
        transition: {
          true: {
            overlay:
              "data-[state=open]:animate-[fade-in_150ms_ease-out] data-[state=closed]:animate-[fade-out_150ms_ease-in]",
            content:
              "data-[state=open]:animate-[scale-in_150ms_ease-out] data-[state=closed]:animate-[scale-out_150ms_ease-in]",
          },
        },
        fullscreen: {
          false: {
            content:
              "w-[calc(100vw-2rem)] max-w-lg rounded-xl shadow-xl ring-0",
          },
        },
      },
    },
  },
});
