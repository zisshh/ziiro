#!/usr/bin/env python3
"""Locked scorer for Ziiro multi-route performance research.

Prints one number to stdout: mean mobile Lighthouse Performance across the
public marketing/legal routes. Details and guardrail messages go to stderr.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HARNESS = Path(__file__).resolve().parent
REPORTS_DIR = HARNESS / "reports"
HOST = "127.0.0.1"
PORT = 4173
BASE_URL = f"http://{HOST}:{PORT}"
ROUTES = ["/", "/services", "/about", "/contact", "/audit", "/privacy", "/terms"]
CHROME_PATH = os.environ.get("CHROME_PATH", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")

GUARDRAILS = {
    "/": ["ZIIRO", "Book Free Consultation", "See How It Works"],
    "/services": ["WHAT WE DO", "Agentic Systems", "Book Free Consultation"],
    "/about": ["ABOUT ZIIRO", "OUR PROCESS", "Automating Tomorrow, Today"],
    "/contact": ["TALK", "Your Name", "Email Address", "Send Message"],
    "/audit": ["AGENTIC SYSTEMS", "AUDIT", "GET YOUR AUDIT"],
    "/privacy": ["PRIVACY POLICY", "Information We Collect", "How We Use Your Information"],
    "/terms": ["TERMS", "Use of the Services", "Disclaimer"],
}


def run(cmd: list[str], *, timeout: int | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=ROOT,
        text=True,
        capture_output=True,
        timeout=timeout,
    )


def ensure_build() -> None:
    result = run(["npm", "run", "build"], timeout=180)
    if result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit(2)


def wait_for_preview(timeout_s: int = 60) -> None:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(f"{BASE_URL}/", timeout=2) as response:
                if response.status == 200:
                    return
        except (urllib.error.URLError, TimeoutError, OSError):
            time.sleep(0.5)
    raise SystemExit("preview_not_ready")


def check_rendered_guardrails() -> None:
    script = r"""
const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL;
const routes = JSON.parse(process.env.ROUTES);
const guardrails = JSON.parse(process.env.GUARDRAILS);

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  for (const route of routes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (!response || response.status() >= 400) {
      throw new Error(`route_failed:${route}:${response ? response.status() : "no_response"}`);
    }
    await page.waitForTimeout(900);
    const text = await page.evaluate(() => {
      const visibleText = document.body.innerText;
      const fieldText = Array.from(document.querySelectorAll("input, textarea, select, button, a"))
        .map((element) => [
          element.getAttribute("placeholder"),
          element.getAttribute("aria-label"),
          element.textContent,
        ].filter(Boolean).join(" "))
        .join(" ");
      return `${visibleText} ${fieldText}`.toLowerCase();
    });
    for (const needle of guardrails[route]) {
      if (!text.includes(needle.toLowerCase())) {
        throw new Error(`guardrail_failed:${route}:${needle}`);
      }
    }
  }

  await browser.close();
})().catch(async (error) => {
  console.error(error.message || error);
  process.exit(3);
});
"""
    env = {
        **os.environ,
        "BASE_URL": BASE_URL,
        "ROUTES": json.dumps(ROUTES),
        "GUARDRAILS": json.dumps(GUARDRAILS),
    }
    result = subprocess.run(
        ["node", "-e", script],
        cwd=ROOT,
        text=True,
        capture_output=True,
        env=env,
        timeout=90,
    )
    if result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)


def lighthouse_score(route: str) -> float:
    report_name = "root" if route == "/" else route.strip("/").replace("/", "_")
    report_path = REPORTS_DIR / f"{report_name}.json"
    command = [
        "npx",
        "--no-install",
        "lighthouse",
        f"{BASE_URL}{route}",
        "--only-categories=performance",
        "--form-factor=mobile",
        "--screenEmulation.mobile=true",
        "--screenEmulation.width=390",
        "--screenEmulation.height=844",
        "--screenEmulation.deviceScaleFactor=2",
        "--throttling-method=simulate",
        "--quiet",
        "--output=json",
        f"--output-path={report_path}",
    ]
    if Path(CHROME_PATH).exists():
        command.append(f"--chrome-path={CHROME_PATH}")

    result = run(command, timeout=180)
    if result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit(2)

    data = json.loads(report_path.read_text())
    return float(data["categories"]["performance"]["score"]) * 100


def main() -> None:
    ensure_build()
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    preview = subprocess.Popen(
        ["npm", "run", "preview", "--", "--port", str(PORT), "--strictPort", "--host", HOST],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        text=True,
    )
    try:
        wait_for_preview()
        check_rendered_guardrails()
        scores = [(route, lighthouse_score(route)) for route in ROUTES]
        mean = round(sum(score for _, score in scores) / len(scores), 1)
        print(mean)
        print("per_route=" + ",".join(f"{route}:{score:.1f}" for route, score in scores), file=sys.stderr)
    finally:
        preview.terminate()
        try:
            preview.wait(timeout=10)
        except subprocess.TimeoutExpired:
            preview.kill()
            preview.wait(timeout=5)


if __name__ == "__main__":
    main()
