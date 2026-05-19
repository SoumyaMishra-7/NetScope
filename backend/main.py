from __future__ import annotations

import json
import random
import socket
import time
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional
from urllib.parse import urlparse

import requests
import urllib3
from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from requests import Response

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI(title="NetScope X API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROTOCOLS = ["TCP", "UDP", "HTTP", "HTTPS", "DNS", "ICMP"]
STATUSES = ["Healthy", "Warning", "Critical"]


def build_mock_packets(count: int = 48) -> list[dict]:
    packets: list[dict] = []
    now = datetime.now(timezone.utc)

    for index in range(count):
        status = STATUSES[(index + (1 if index % 4 == 0 else 0)) % len(STATUSES)]
        threat_score = 88 + index % 9 if status == "Critical" else 48 + index % 20 if status == "Warning" else 8 + index % 24
        packets.append(
            {
                "id": f"pkt-{index + 1:04d}",
                "ipAddress": f"10.{12 + index % 6}.{24 + index % 12}.{80 + index}",
                "protocol": PROTOCOLS[index % len(PROTOCOLS)],
                "status": status,
                "latency": round(18 + random.random() * 170 + (95 if status == "Critical" else 0)),
                "threatLevel": "High" if threat_score > 80 else "Medium" if threat_score > 45 else "Low",
                "threatScore": threat_score,
                "timestamp": (now - timedelta(minutes=index * 17)).isoformat(),
                "device": {
                    "name": ["Edge Gateway", "Core Switch", "API Node", "DNS Relay", "VPN Concentrator", "IoT Segment"][index % 6],
                    "mac": f"A4:9D:{20 + index:02d}:7C:{50 + index:02d}:B{index % 9}",
                    "zone": ["DMZ", "Production", "Branch", "Cloud", "Internal"][index % 5],
                    "owner": ["Security Ops", "Platform", "Network Team"][index % 3],
                },
            }
        )

    return packets


MOCK_PACKETS = build_mock_packets()


def normalize_domain(domain: str) -> str:
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
    try:
        return True, socket.gethostbyname(domain), None
    except socket.gaierror as exc:
        return False, None, str(exc)


def scan_port(ip_address: str, port: int, timeout: float = 1.5) -> bool:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    try:
        return sock.connect_ex((ip_address, port)) == 0
    except OSError:
        return False
    finally:
        sock.close()


def measure_latency(ip_address: str, ports: list[int]) -> Optional[float]:
    for port in ports:
        start = time.perf_counter()
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        try:
            if sock.connect_ex((ip_address, port)) == 0:
                return round((time.perf_counter() - start) * 1000, 2)
        except OSError:
            continue
        finally:
            sock.close()
    return None


def build_http_result(success: bool, response: Optional[Response] = None, error: Optional[str] = None, warning: Optional[str] = None) -> Dict[str, Optional[object]]:
    return {
        "success": success,
        "status_code": response.status_code if response else None,
        "final_url": response.url if response else None,
        "error": error,
        "warning": warning,
    }


def check_http(domain: str) -> Dict[str, Optional[object]]:
    last_error: Optional[str] = None
    for url in (f"https://{domain}", f"http://{domain}"):
        for method in ("HEAD", "GET"):
            try:
                response = requests.request(method, url, timeout=4, allow_redirects=True)
                return build_http_result(True, response=response)
            except requests.exceptions.SSLError:
                try:
                    response = requests.request(method, url, timeout=4, allow_redirects=True, verify=False)
                    return build_http_result(True, response=response, warning="TLS validation failed locally; retried without verification.")
                except requests.RequestException as exc:
                    last_error = str(exc)
            except requests.RequestException as exc:
                last_error = str(exc)
    return build_http_result(False, error=last_error)


def compute_score(dns_success: bool, port_results: Dict[int, bool], http_success: bool, latency_ms: Optional[float]) -> int:
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
    if score >= 75:
        return "Healthy"
    if score >= 40:
        return "Partial / Slow"
    return "Not Reachable"


@app.get("/")
def root() -> dict:
    return {"message": "NetScope X API is running.", "docs": "/docs"}


@app.get("/analytics")
def analytics() -> dict:
    return {
        "activeDevices": 284,
        "networkHealth": 96,
        "packetLoss": 0.7,
        "activeConnections": 12482,
        "systemLatency": 42,
        "threatDetections": 17,
        "protocolDistribution": [
            {"name": "HTTPS", "value": 38, "color": "#2dd4bf"},
            {"name": "TCP", "value": 24, "color": "#60a5fa"},
            {"name": "DNS", "value": 16, "color": "#f8c471"},
            {"name": "UDP", "value": 13, "color": "#a78bfa"},
            {"name": "ICMP", "value": 9, "color": "#fb7185"},
        ],
        "trafficSeries": [
            {"label": f"{minute}m", "inbound": 280 + random.randint(0, 240), "outbound": 180 + random.randint(0, 190), "blocked": 18 + random.randint(0, 64)}
            for minute in range(1, 13)
        ],
    }


@app.get("/packets")
def packets(
    protocol: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort: str = Query("timestamp"),
) -> dict:
    rows = MOCK_PACKETS
    if protocol:
        rows = [packet for packet in rows if packet["protocol"].lower() == protocol.lower()]
    if status:
        rows = [packet for packet in rows if packet["status"].lower() == status.lower()]
    if search:
        value = search.lower()
        rows = [packet for packet in rows if value in json.dumps(packet).lower()]
    rows = sorted(rows, key=lambda packet: packet.get(sort) or "", reverse=True)
    return {"packets": rows, "total": len(rows)}


@app.get("/packets/{packet_id}")
def packet_detail(packet_id: str) -> dict:
    packet = next((row for row in MOCK_PACKETS if row["id"] == packet_id), None)
    if not packet:
        raise HTTPException(status_code=404, detail="Packet not found")
    return {"packet": packet}


@app.get("/devices")
def devices() -> dict:
    return {
        "devices": [
            {"id": index + 1, "name": packet["device"]["name"], "ipAddress": packet["ipAddress"], "zone": packet["device"]["zone"], "status": packet["status"]}
            for index, packet in enumerate(MOCK_PACKETS[:18])
        ]
    }


@app.post("/logs")
async def upload_logs(file: UploadFile = File(...)) -> dict:
    if not file.filename.endswith((".txt", ".json")):
        raise HTTPException(status_code=400, detail="Only .txt and .json logs are supported.")
    content = await file.read()
    size_factor = max(1, len(content) // 200)
    return {
        "fileName": file.filename,
        "parsedRows": 800 + size_factor * 12,
        "suspiciousActivity": 14 + size_factor % 31,
        "failedRequests": 38 + size_factor % 68,
        "riskScore": min(98, 55 + size_factor % 35),
    }


@app.get("/analyze")
def analyze_domain(domain: str = Query(..., description="Domain name to analyze")) -> dict:
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
        port_results = {port: scan_port(resolved_ip, port) for port in ports_to_scan}
        latency_ms = measure_latency(resolved_ip, ports_to_scan)
        http_result = check_http(clean_domain)

    score = compute_score(dns_success, port_results, bool(http_result.get("success")), latency_ms)
    return {
        "domain": clean_domain,
        "dns": {"success": dns_success, "resolved_ip": resolved_ip, "error": dns_error},
        "ports": {str(port): {"open": is_open} for port, is_open in port_results.items()},
        "http": http_result,
        "latency_ms": latency_ms,
        "connectivity_score": score,
        "verdict": verdict_from_score(score),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
