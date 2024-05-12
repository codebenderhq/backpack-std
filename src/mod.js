export {
  api_middleware,
  asset_middlware,
  html_middleware,
  script_middleware,
} from "./middleware/index.js";

import oomph from "./lib/deps.js";
import logView from "./views/logger.jsx";

export { logView, oomph };
