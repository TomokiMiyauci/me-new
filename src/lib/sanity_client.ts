import { createClient } from "@sanity/client";
import { CONTENT_ENDPOINT } from "~env";

export type SanityEndpointDescriptor = {
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
};

class SanityURL {
  static parseGraphqlEndpoint(input: string | URL): SanityEndpointDescriptor {
    const url = typeof input === "string" ? new URL(input) : input;

    const hostname = url.hostname;

    const cdn = hostname.endsWith(".apicdn.sanity.io");
    const api = hostname.endsWith(".api.sanity.io");

    if (!cdn && !api) {
      throw new Error("Not a Sanity API URL");
    }

    const projectId = hostname.split(".")[0];

    if (!projectId) {
      throw new Error("Invalid project ID");
    }

    const segments = url.pathname.split("/").filter(Boolean);
    // expected: [v2024-01-01, graphql, dataset]
    const [version, _graphql, dataset] = segments;

    if (
      !version?.startsWith("v") ||
      !dataset
    ) {
      throw new Error("Invalid Sanity query URL structure");
    }

    return {
      projectId,
      dataset,
      apiVersion: version.slice(1),
      useCdn: cdn,
    };
  }
}

const parsed = SanityURL.parseGraphqlEndpoint(CONTENT_ENDPOINT);

export default createClient(parsed);
