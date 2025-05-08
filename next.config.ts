import { NextConfig } from "next";
import { Configuration as WebpackConfig, WebpackPluginInstance } from "webpack";
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config: WebpackConfig, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      // Make sure plugins exists before modifying it
      if (!config.plugins) {
        config.plugins = [];
      }

      // Explicitly cast PrismaPlugin as WebpackPluginInstance
      config.plugins.push(
        new PrismaPlugin() as unknown as WebpackPluginInstance
      );
    }
    return config;
  },
};

export default nextConfig;
