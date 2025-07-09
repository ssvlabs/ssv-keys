import { execSync } from "child_process";
import { mkdirSync, renameSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const targets = {
  // linux: 'node22-linux-x64',
  // macos: 'node22-macos-x64',
  win: "node22-win-x64",
};

const outputBase = join(__dirname, "../1234444");

for (const [platform, target] of Object.entries(targets)) {
  const outputName = platform === "win" ? "cli.exe" : "cli";
  const tempOutput = join(
    outputBase,
    `ssv-keys${platform}${platform === "win" ? ".exe" : ""}`
  );
  console.log("tempOutput:", tempOutput);
  const finalOutput = join(outputBase, platform, outputName);
  console.log("finalOutput:", finalOutput);

  console.log(`Packaging for ${platform}...`);
  execSync(`pkg ./dist/cli.js --target ${target} --output ${tempOutput}`, {
    stdio: "inherit",
  });

  mkdirSync(join(outputBase, platform), { recursive: true });
  renameSync(tempOutput, finalOutput);
}
