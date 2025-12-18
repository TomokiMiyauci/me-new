import { EntryResolver } from "route-kit";
import routes from "../routes/route.ts";

export default new EntryResolver(routes);
