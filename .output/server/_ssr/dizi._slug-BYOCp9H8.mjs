import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Route } from "./dizi._slug-DxRHPgfE.mjs";
import { n as SeriesView } from "./SeriesView-UeIRlsRJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dizi._slug-BYOCp9H8.js
var import_jsx_runtime = require_jsx_runtime();
function Detail() {
	const { id, slug } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeriesView, {
		id,
		slug
	});
}
//#endregion
export { Detail as component };
