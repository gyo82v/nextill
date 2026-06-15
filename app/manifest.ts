// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nextill",
    short_name: "Nextill",
    description: "Nextill is a management app for tills, food items, and stock.",

    id: "/",
    start_url: "/",
    scope: "/",

    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",

    icons: [
      // Regular icons
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },

      // Maskable icons (IMPORTANT)
      {
        src: "/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

/*

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nextill",
    short_name: "Nextill",
    description: "Nextill is a management app for tills, food items, and stock.",

    id: "/",
    start_url: "/",
    scope: "/",

    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",

    icons: [
      // Regular icons
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },

      // Maskable icons (IMPORTANT)
      {
        src: "/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
      {
        src: "/pwa-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/pwa-1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}


*/