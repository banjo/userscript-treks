import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        monkey({
            entry: "src/main.ts",
            userscript: {
                namespace: "treks",
                match: ["https://*.treks.se/time"],
                author: "Anton",
            },
        }),
    ],
});
