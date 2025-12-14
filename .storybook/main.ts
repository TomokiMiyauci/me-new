import type { StorybookConfig } from "@storybook/react-vite";

export default {
  stories: [
    "../src/**/*.stories.tsx",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/react-vite",
  viteFinal: (config) => {
    const plugins = config.plugins?.filter((plugin) => {
      // Fileter All array plugin. it is rsc plugins
      if (Array.isArray(plugin)) {
        return false;
      }

      return plugin;
    });

    // Disabled Environment API and rsc plugins
    config.environments = {};
    config.plugins = plugins;

    return config;
  },
} satisfies StorybookConfig;
