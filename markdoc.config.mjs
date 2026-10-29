import { defineMarkdocConfig, nodes, component } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  tags: {
    youtube: {
      render: component("./src/components/YouTubeEmbed.astro"),
      attributes: {
        url: { type: String, required: true },
        label: { type: String, required: true },
      },
    },
    tweet: {
      render: component("./src/components/TweetEmbed.astro"),
      attributes: {
        url: { type: String, required: true },
      },
    },
    codepen: {
      render: component("./src/components/CodePenEmbed.astro"),
      attributes: {
        url: { type: String, required: true },
        title: { type: String, required: true },
      },
    },
    githubgist: {
      render: component("./src/components/GitHubGistEmbed.astro"),
      attributes: {
        id: { type: String, required: true },
      },
    },
    details: {
      render: "details",
    },
    summary: {
      render: "summary",
    },
    sup: {
      render: "sup",
    },
    sub: {
      render: "sub",
    },
    abbr: {
      render: "abbr",
      attributes: {
        title: { type: String },
      },
    },
    kbd: {
      render: "kbd",
    },
    mark: {
      render: "mark",
    },
  },
  nodes: {
    heading: {
      ...nodes.heading,
      render: component("./src/components/Heading.astro"),
    },
    fence: {
      render: component("./src/components/CodeBlock.astro"),
      attributes: {
        language: { type: String, default: "typescript" },
        content: { type: String, required: true },
      },
    },
  },
});
