import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();
const options = {
	key: await Deno.readTextFile("./debug/key.pem"),
	cert: await Deno.readTextFile("./debug/cert.pem"),
};

app.use(logger());
app.use("*", serveStatic({ root: "./dist/" }));

Deno.serve(
	{
		onListen: ({ port, hostname }) => {
			console.log(`Server started at https://${hostname}:${port}`);
		},
		key: await Deno.readTextFile("./debug/key.pem"),
		cert: await Deno.readTextFile("./debug/cert.pem"),
	},
	app.fetch
);
