import { spawn } from "child_process";

const proc = spawn("bun", ["run", "dev"], {
    cwd: "./frontend",
    stdio: "inherit",
});

proc.on("close", (code) => {
    process.exit(code);
});