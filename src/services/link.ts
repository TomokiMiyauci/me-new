import { EntryResolver } from "route-kit";
import routes from "@/routes/routes.tsx";

export default new EntryResolver(routes);
export { Entry } from "@/routes/routes.tsx";
