import { spawn } from "child_process";
import { describe, it, expect, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Keyshares Creation", async () => {
  const outputDir = path.join(__dirname, "output");

  await new Promise<void>((resolve, reject) => {
    const buildProcess = spawn("pnpm", ["build"], {
      stdio: ["pipe", "pipe", "pipe"],
      cwd: path.join(__dirname, "../.."),
      shell: true,
    });

    let buildStdout = "";
    let buildStderr = "";

    buildProcess.stdout?.on("data", (data) => {
      buildStdout += data.toString();
      console.log(`Build: ${data.toString().trim()}`);
    });

    buildProcess.stderr?.on("data", (data) => {
      buildStderr += data.toString();
      console.error(`Build Error: ${data.toString().trim()}`);
    });

    buildProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Build completed successfully");
        resolve();
      } else {
        reject(
          new Error(
            `Build failed with exit code ${code}\nStdout: ${buildStdout}\nStderr: ${buildStderr}`
          )
        );
      }
    });

    buildProcess.on("error", (error) => {
      reject(new Error(`Build process error: ${error.message}`));
    });
  });

  afterEach(async () => {
    // Clean up - remove output directory after each test
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });

  it("should create keyshares file when running CLI with valid arguments", async () => {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Test data from examples
    const keystorePath = path.join(__dirname, "./keystores/keystore.json");
    const operatorKeys = [
      "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdHhHZEx6QVBnR0hhYWVoYUN6a0YKTmdiSmZ6WndCQnlsVFhMdWxPc3ErMzA2NCtBUFNQZHh3YmVXalpPRWpvWC9rRy9EaHNUVmw5eGw0SktUdWxpQwpYdlpMZXRpd3ZuM3RYQTFTKzNGTnJLZ1FjNFBnSHppd1RKL01yMEdyRzFyYWpvYm9VMGVETU5Hbi8zL3BRdk1WCks5bFNuY1QyaFhLbW1PdDdtQUUyK3ltT0JOZDhKU3g5NnA3ajFWdDNwc2d4ZzJMTUU0Nnd2dEpPVyswUWdNVDMKSDNEVjVSTWZWUlU4Z29nUFptbjNYRUR4RUJLZUtmaFZHVjlYNmFhcXkvU2Y4aEo3aG16eVcrQ3F1bkFYYWUySwo5ZDdSL0g0dStZcGovaU5NYkNQNi9GOGlIOCtQbWRyTmtUUFRPakwrb05HZVlNSVB3L1hYVStZbkhzcGp4SjRMCnBRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
      "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBeFArYkhwYS85WlhJUkJUR0JFWmcKN2hxa1Rra0VRUnZnTFJTV0E3K2cwbHkvVlpUczlFVTBjcXZFNURvUmxseVhrTHNVcnplOTZaOFJPNllmNC9LZQpta3hudk1YeHFUanlITGNkWlhIN1pFMmhWUnZRRVA3TE9hL3RCRHFYYVlHVklZbEYwWWIrVlFhSUczbGg4QmpCClN2ZE9rVERwblJLU1g2Z0ZnTTZVMy9FcFQyVlZRR1Y3VjIrNTF0YlM4WGJpUVQ3OTdwZmpBVEU4VmZseXBPUFIKYU5PREpjWnBlWjFjR0JCMWVJTUlGMlFGMFBCdGQzZ1ZVbDU5RFBHRFRZSUh2VnRrdkhSVHR3a1hOS2EveXV3SApnb1JhZjE4SDZTRy9vazFUM0l4WFYwdk1GdGlvUDJGWVh6UlNzaDBTcnlBR255azB0MElKb0JPMzBtZjFUeXZxCmN3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
      "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBem9hb09qQWIvVTQ3QitTWit6WUYKcm5TNHBMbUZnL2RYc3pCYWpaSm5zTWJoSzZISHFCdnZwRXZHWHpsU1Q3R3lWTDVQbzVaNEVSQzdPdXBHK2JQWQptQTgwNXZPb3FqYmNkVVlwclgyb1c4K1V1aFZJdUwyd2QvQXJqRDFScUc5eUV6WkRuUVdDdmplaElTQ1NXWFNPCmppbWxTbkpPZTd1Z0hwOXJWRkh3bVlwNGQyOWRBWFc2YTJZdndDRm1oVE9mdUMrSVNESzJTck9JWC9hVnZ5ekgKMU1OY0VmUTNaSGxjYmZQMDdTMVNqN25WYWhqM1hVUEIyMDMxOTRpQU9zcVRaOVFuU3NUamtydGF1MW1SV21aMQpFNm9nYTNJQ2t0YWs5M2FqcElYV3JKUzMwVERtSDhPckpKanVoQm4zaXRrK1o1Szg5SEdXa3FLME1wN2tYOGxPCi93SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
      "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcWMwUjlWRm9pM1NIeDl2alppb1gKRllwNFhkRjB2emRRRjRLRnozVklYaU5US3Vzck5mSW0zSm1FbWlSQmw4RmRvTmliRC9SZFc1YkFRUzN1UE5MRApGdHZVZ2p3bXBFNEdvcUpmSXZSWENWK2ROamcyNDU5aW44UnlkK0FUbm5qZXRYYWFSN3JNUlIreDRrcVlONkR4CkZoc2llZGgrZG0xTXNtMTRzc2FhMmZ3TExXamlzMDhTZlJZcXhjVHVCd24zUzFFajUwZzVrRG1RRmVyWUxBY2EKSXFOaFNsc0ZJZE50dHFkMUdSR3o0SFFPQmcyQk9iWWdwNEhEZTFLb0xmREdyMHNzRWFZMnRoeVZZOE9FaHh3YgpwUE1NTEk3NmFpUHdJQUsyM1MzWHZLS3ZtRXc1T1FFM0ptWXJrRDFDMTdoRGNWdUxkODV4YnZFSUFENms3b0NJCnB3SURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
    ];
    const operatorIds = [123, 456, 789, 777];
    const ownerAddress = "0x81592c3de184a3e2c0dcb5a261bc107bfa91f494";
    const ownerNonce = 1;
    const password = "123123123";

    const cliPath = path.join(__dirname, "../../dist/cli-interactive.js");

    // Build CLI arguments
    const args = [
      cliPath,
      `--keystore=${keystorePath}`,
      `--password=${password}`,
      `--operator-ids=${operatorIds.join(",")}`,
      `--operator-keys=${operatorKeys.join(",")}`,
      `--owner-address=${ownerAddress}`,
      `--owner-nonce=${ownerNonce}`,
      `--output-folder=${outputDir}`,
    ];

    // Run the CLI command
    const result = await new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number;
    }>((resolve, reject) => {
      const child = spawn("node", args, {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: path.join(__dirname, "../.."),
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data) => {
        stdout += data.toString();
      });

      child.stderr?.on("data", (data) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        resolve({
          stdout,
          stderr,
          exitCode: code || 0,
        });
      });

      child.on("error", (error) => {
        reject(error);
      });

      // Set a timeout to avoid hanging tests
      setTimeout(() => {
        child.kill();
        reject(new Error("CLI process timed out"));
      }, 30000); // 30 seconds timeout
    });

    // Check that the command executed successfully
    expect(result.exitCode).toBe(0);

    // Check that output directory exists
    expect(fs.existsSync(outputDir)).toBe(true);

    // Find files in output directory
    const files = fs.readdirSync(outputDir);

    // Should have at least one file
    expect(files.length).toBeGreaterThan(0);

    // Find keyshares file
    const keySharesFile = files.find(
      (file) => file.startsWith("keyshares") && file.endsWith(".json")
    );

    // Verify keyshares file exists and matches expected pattern
    expect(keySharesFile).toBeDefined();
    expect(keySharesFile).toMatch(/^keyshares.*\.json$/);

    // Verify the file actually exists and is readable
    const filePath = path.join(outputDir, keySharesFile!);
    expect(fs.existsSync(filePath)).toBe(true);

    // Verify the file contains valid JSON
    const fileContent = fs.readFileSync(filePath, "utf8");
    expect(() => JSON.parse(fileContent)).not.toThrow();

    // Basic validation that it's a keyshares file
    const jsonContent = JSON.parse(fileContent);
    expect(jsonContent).toHaveProperty("version");
    expect(jsonContent).toHaveProperty("shares");
    expect(Array.isArray(jsonContent.shares)).toBe(true);
  }, 180_000); // 3 minutes timeout for the test
});
