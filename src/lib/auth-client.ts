import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
  plugins: [organizationClient()],
});

export default authClient;
