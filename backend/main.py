from __future__ import annotations

import socket
import time
from typing import Dict, Optional
from urllib.parse import urlparse

import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# FastAPI app setup
app = FastAPI(title="NetScope - Network Diagnostic Dashboard", version="1.0.0")

# CORS configuration (open for frontend integration and demos)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def normalize_domain(domain: str) -> str:
    """Normalize user input into a clean domain string."""
    value = (domain or "").strip()
    if not value:
        raise ValueError("Domain is required.")

    if "://" in value:
        value = urlparse(value).netloc or value

    value = value.split("/")[0].strip()
    if not value:
        raise ValueError("Invalid domain format.")

    return value


def resolve_dns(domain: str) -> tuple[bool, Optional[str], Optional[str]]:
    """Resolve domain using socket DNS lookup."""
    try:
        ip_address = socket.gethostbyname(domain)
        return True, ip_address, None
    except socket.gaierror as exc:
        return False, None, str(exc)


def scan_port(ip_address: str, port: int, timeout: float = 1.5) -> bool:
    """Check if a TCP port is open using socket connection."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    try:
        return sock.connect_ex((ip_address, port)) == 0
    except OSError:
        return False
    finally:
        sock.close()


def measure_latency(ip_address: str, ports: list[int]) -> Optional[float]:
    """Measure connection latency (ms) by timing first successful TCP connect."""
    for port in ports:
        start = time.perf_counter()
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        try:
            result = sock.connect_ex((ip_address, port))
            if result == 0:
                end = time.perf_counter()
                return round((end - start) * 1000, 2)
        except OSError:
            continue
        finally:
            sock.close()
    return None


def check_http(domain: str) -> Dict[str, Optional[object]]:
    """Run an HTTP HEAD request to check web reachability."""
    url = f"https://{domain}"
    try:
        response = requests.head(url, timeout=4, allow_redirects=True)
        return {
            "success": True,
            "status_code": response.status_code,
            "final_url": response.url,
            "error": None,
        }
    except requests.RequestException as exc:
        return {
            "success": False,
            "status_code": None,
            "final_url": None,
            "error": str(exc),
        }


def compute_score(
    dns_success: bool,
    port_results: Dict[int, bool],
    http_success: bool,
    latency_ms: Optional[float],
) -> int:
    """Compute connectivity score with caps and bonuses."""
    score = 0

    if dns_success:
        score += 40
    if port_results.get(443):
        score += 25
    if port_results.get(80):
        score += 15
    if http_success:
        score += 20
    if latency_ms is not None and latency_ms < 120:
        score += 10

    return min(score, 100)


def verdict_from_score(score: int) -> str:
    """Map score to a human-friendly verdict."""
    if 75 <= score <= 100:
        return "Healthy"
    if 40 <= score <= 74:
        return "Partial / Slow"
    return "Not Reachable"


@app.get("/")
def root() -> dict:
    return {"message": "NetScope backend is running."}


@app.get("/analyze")
def analyze_domain(domain: str = Query(..., description="Domain name to analyze")) -> dict:
    """
    Analyze domain connectivity through DNS, ports, HTTP and latency.
    Returns a clean, structured diagnostic JSON response.
    """
    try:
        clean_domain = normalize_domain(domain)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    dns_success, resolved_ip, dns_error = resolve_dns(clean_domain)

    ports_to_scan = [80, 443, 22, 8080]
    port_results: Dict[int, bool] = {port: False for port in ports_to_scan}
    latency_ms: Optional[float] = None
    http_result = {"success": False, "status_code": None, "final_url": None, "error": None}

    if dns_success and resolved_ip:
        for port in ports_to_scan:
            port_results[port] = scan_port(resolved_ip, port)

        latency_ms = measure_latency(resolved_ip, [443, 80, 22, 8080])
        http_result = check_http(clean_domain)

    score = compute_score(
        dns_success=dns_success,
        port_results=port_results,
        http_success=bool(http_result.get("success")),
        latency_ms=latency_ms,
    )

    return {
        "domain": clean_domain,
        "dns": {
            "success": dns_success,
            "resolved_ip": resolved_ip,
            "error": dns_error,
        },
        "ports": {str(port): {"open": is_open} for port, is_open in port_results.items()},
        "http": http_result,
        "latency_ms": latency_ms,
        "connectivity_score": score,
        "verdict": verdict_from_score(score),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
