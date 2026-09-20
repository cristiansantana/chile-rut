import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, resolve } from "node:path";
import { spawn, spawnSync } from "node:child_process";

const consumerDirectory = process.argv[2];
const testDirectory = new URL(".", import.meta.url).pathname;

if (!consumerDirectory) {
    throw new Error("Usage: node test/browser-runtime-consumer.mjs <consumer-directory>");
}

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".map": "application/json; charset=utf-8",
};

const browserCandidates = [
    process.env.CHROME_BIN,
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
].filter(Boolean);
const browser = browserCandidates.find((candidate) => spawnSync(candidate, ["--version"], { stdio: "ignore" }).status === 0);

if (!browser) {
    throw new Error(`No supported Chrome or Chromium executable found (${browserCandidates.join(", ")})`);
}

const runBrowser = (url) =>
    new Promise((resolveBrowser, rejectBrowser) => {
        const browserProcess = spawn(browser, [
            "--headless=new",
            "--disable-gpu",
            "--no-sandbox",
            "--virtual-time-budget=1000",
            "--dump-dom",
            url,
        ]);
        let stdout = "";
        let stderr = "";
        const timeout = setTimeout(() => {
            browserProcess.kill();
            rejectBrowser(new Error("Browser did not finish within 60 seconds"));
        }, 60_000);

        browserProcess.stdout.on("data", (chunk) => {
            stdout += chunk;
        });
        browserProcess.stderr.on("data", (chunk) => {
            stderr += chunk;
        });
        browserProcess.on("error", (error) => {
            clearTimeout(timeout);
            rejectBrowser(error);
        });
        browserProcess.on("close", (status) => {
            clearTimeout(timeout);
            resolveBrowser({ status, stdout, stderr });
        });
    });

const resolveRequestPath = (pathname) => {
    if (pathname === "/") return resolve(testDirectory, "browser-runtime-consumer.html");

    const relativePath = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, "");
    const filePath = resolve(consumerDirectory, relativePath);

    if (!filePath.startsWith(`${resolve(consumerDirectory)}/`)) return undefined;
    return filePath;
};

const server = createServer((request, response) => {
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;
    const filePath = resolveRequestPath(pathname);

    if (!filePath || !existsSync(filePath)) {
        response.writeHead(404).end();
        return;
    }

    response.writeHead(200, { "content-type": mimeTypes[extname(filePath)] ?? "application/octet-stream" });
    createReadStream(filePath).pipe(response);
});

await new Promise((resolveServer) => server.listen(0, "127.0.0.1", resolveServer));

try {
    const { port } = server.address();
    const result = await runBrowser(`http://127.0.0.1:${port}/`);

    if (result.status !== 0) {
        throw new Error(`Browser exited with status ${result.status}: ${result.stderr}`);
    }
    if (!result.stdout.includes('data-browser-test="passed"')) {
        throw new Error(`Browser consumer failed:\n${result.stdout}\n${result.stderr}`);
    }

    console.log("Installed artifact verified in a browser runtime");
} finally {
    await new Promise((resolveServer, rejectServer) =>
        server.close((error) => (error ? rejectServer(error) : resolveServer())),
    );
}
