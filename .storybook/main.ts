import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["./public"],
  viteFinal: async (config) => {
    // Tailwind CSS と他の Vite 設定を確認・継承
    return config;
  },
};

export default config;
