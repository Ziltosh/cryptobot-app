/**
 * this is an app plugin file.
 * its extension 'node-app' is detected by the node application-type.
 */
import type { NodeAppOptions } from "@teambit/node";

export const myApp: NodeAppOptions = {
	name: 'api',
	entry: require.resolve('./api.app-root'),
	portRange: [3333, 3333],
}

export default myApp
