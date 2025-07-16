#!/usr/bin/env node

/**
 * Database Health Check Script
 * Run this script to verify MongoDB integration is working properly
 */

const { exec } = require("child_process");

console.log("🔍 IdealizePlanBee Database Health Check\n");

const checks = [
  {
    name: "Node.js Version",
    command: "node --version",
    check: (output) => {
      const version = output.trim();
      const majorVersion = parseInt(version.replace("v", "").split(".")[0]);
      return majorVersion >= 18 ? "PASS" : "FAIL - Requires Node.js 18+";
    },
  },
  {
    name: "MongoDB Dependencies",
    command: "npm list mongoose mongodb --depth=0",
    check: (output) => {
      return output.includes("mongoose@") && output.includes("mongodb@")
        ? "PASS"
        : "FAIL - Missing dependencies";
    },
  },
  {
    name: "TypeScript Compilation",
    command: "npx tsc --noEmit",
    check: (output) => {
      return output.trim() === "" ? "PASS" : "FAIL - TypeScript errors";
    },
  },
];

async function runCheck(check) {
  return new Promise((resolve) => {
    exec(check.command, (error, stdout, stderr) => {
      const result = {
        name: check.name,
        status: "UNKNOWN",
        output: stdout || stderr || error?.message || "",
      };

      if (error) {
        result.status = "ERROR";
      } else {
        result.status = check.check(stdout);
      }

      resolve(result);
    });
  });
}

async function runAllChecks() {
  console.log("Running health checks...\n");

  for (const check of checks) {
    process.stdout.write(`${check.name}...`);
    const result = await runCheck(check);

    if (result.status === "PASS") {
      console.log(" ✅ PASS");
    } else if (result.status.startsWith("FAIL")) {
      console.log(` ❌ ${result.status}`);
    } else {
      console.log(` ⚠️  ${result.status}`);
      if (result.output) {
        console.log(`   ${result.output.trim()}`);
      }
    }
  }

  console.log("\n📋 Next Steps:");
  console.log("1. Ensure MongoDB is running (local or Atlas)");
  console.log("2. Configure DATABASE_URL in .env.local");
  console.log("3. Run: npm run dev");
  console.log("4. Visit: http://localhost:3000/api/database?action=health");
  console.log(
    "5. Visit: http://localhost:3000/api/database?action=setup (first time only)"
  );

  console.log("\n💡 Database API Endpoints:");
  console.log(
    "   GET /api/database?action=health  - Check database connection"
  );
  console.log("   GET /api/database?action=init    - Initialize collections");
  console.log("   GET /api/database?action=seed    - Seed default data");
  console.log("   GET /api/database?action=setup   - Full setup (init + seed)");
}

runAllChecks().catch(console.error);
