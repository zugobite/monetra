#!/usr/bin/env node

import { execSync } from "child_process";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const RESULTS_FILE = join(process.cwd(), "benchmarks", "history.json");

function getCurrentVersion() {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    return pkg.version;
  } catch {
    return "unknown";
  }
}

function runBenchmarks() {
  console.log("🚀 Running performance benchmarks...");

  try {
    const output = execSync("npx vitest bench --run", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    const result = {
      timestamp: new Date().toISOString(),
      version: getCurrentVersion(),
      nodeVersion: process.version,
      results: [],
    };

    // Parse the benchmark output for performance data
    const lines = output.split("\n");
    let currentSuite = "";

    for (const line of lines) {
      // Extract suite names (look for ✓ lines with > indicating test suite)
      if (line.includes("✓") && line.includes(">")) {
        const match = line.match(/✓\s+[^>]+>\s+(.+?)\s+\d+ms/);
        if (match) {
          currentSuite = match[1].trim();
        }
      }

      // Extract benchmark results (look for lines starting with ·)
      if (line.trim().startsWith("·")) {
        // Parse the benchmark line: · Name   hz   min   max   mean   ...
        const match = line.match(
          /·\s+(.+?)\s+([\d,]+\.?\d*)\s+[\d.]+\s+[\d.]+\s+[\d.]+/
        );
        if (match) {
          const name = match[1].trim();
          const hzStr = match[2].replace(/,/g, "");
          const hz = parseFloat(hzStr);

          result.results.push({
            name: currentSuite ? `${currentSuite} - ${name}` : name,
            hz: hz || 0,
            mean: hz > 0 ? 1 / hz : 0,
          });
        }
      }
    }

    // Load existing results
    let history = [];
    if (existsSync(RESULTS_FILE)) {
      try {
        history = JSON.parse(readFileSync(RESULTS_FILE, "utf8"));
      } catch {
        console.warn("⚠️  Could not parse existing results file");
      }
    }

    // Add new result
    history.push(result);

    // Keep only last 50 runs to avoid file bloat
    if (history.length > 50) {
      history = history.slice(-50);
    }

    // Save results
    writeFileSync(RESULTS_FILE, JSON.stringify(history, null, 2));

    console.log("✅ Benchmark complete!");
    console.log(`📊 Results saved to ${RESULTS_FILE}`);
    console.log(`🔍 Found ${result.results.length} benchmark results`);

    // Show summary of fastest operations
    const topPerformers = result.results
      .filter((r) => r.hz > 0)
      .sort((a, b) => b.hz - a.hz)
      .slice(0, 5);

    console.log("\n🏆 Top 5 Fastest Operations:");
    topPerformers.forEach((perf, i) => {
      const ops =
        perf.hz >= 1000000
          ? `${(perf.hz / 1000000).toFixed(1)}M ops/sec`
          : perf.hz >= 1000
            ? `${(perf.hz / 1000).toFixed(1)}K ops/sec`
            : `${perf.hz.toFixed(0)} ops/sec`;

      console.log(`  ${i + 1}. ${perf.name}: ${ops}`);
    });
  } catch (error) {
    console.error("❌ Benchmark failed:", error.message);
    console.log("\n💡 Falling back to simple benchmark run...");

    // Fallback: just run benchmarks without parsing
    try {
      execSync("npx vitest bench --run", { stdio: "inherit" });
      console.log("✅ Benchmarks completed (no data saved)");
    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError.message);
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runBenchmarks();
}
