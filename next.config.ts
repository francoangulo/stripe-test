// next.config.mjs
import autoCert from "anchor-pki/auto-cert/integrations/next";

const withAutoCert = autoCert({
  enabledEnv: "development",
  images: {
    remotePatterns: [
      {
        protocol: "*",
        hostname: "*",
        port: "*",
        pathname: "*",
      },
    ],
  },
});

const nextConfig = {};

export default withAutoCert(nextConfig);
