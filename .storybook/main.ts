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
      if (Array.isArray(plugin)) {
        // Fileter rsc plugin
        const [first] = plugin;

        if (first && "name" in first && first.name.includes("rsc")) {
          return false;
        }
      }

      return plugin;
    });
    console.log(plugins);

    // Disabled Environment API and rsc plugins
    config.environments = {};
    config.plugins = plugins;

    return config;
  },
} satisfies StorybookConfig;
