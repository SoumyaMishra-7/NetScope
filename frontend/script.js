const API_BASE = "http://127.0.0.1:8000";

const domainInput = document.getElementById("domainInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const statusText = document.getElementById("statusText");
const resultCard = document.getElementById("resultCard");
const verdictBadge = document.getElementById("verdictBadge");
const scoreValue = document.getElementById("scoreValue");
const resolvedIp = document.getElementById("resolvedIp");
const httpStatus = document.getElementById("httpStatus");
const latency = document.getElementById("latency");
const portsList = document.getElementById("portsList");
const downloadBtn = document.getElementById("downloadBtn");
const infoModal = document.getElementById("infoModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModalBtn");
let lastReport = null;

const infoContent = {
  diagnostics: {
    title: "Diagnostics Overview",
    body:
      "This section combines multiple network checks to show whether a domain is reachable and healthy from this machine.",
  },
  score: {
    title: "Connectivity Score",
    body:
      "The score is a weighted total from DNS success, open web ports, HTTP response, and low latency. Higher means healthier connectivity.",
  },
  ip: {
    title: "Resolved IP",
    body:
      "This is the server IP address returned by DNS. If no IP appears, DNS resolution likely failed for the domain.",
  },
  http: {
    title: "HTTP Status",
    body:
      "This comes from an HTTP HEAD request. A status like 200/301/302 usually means the web endpoint is reachable.",
  },
  latency: {
    title: "Latency",
    body:
      "Latency is the time taken to establish a network connection to an open port. Lower values generally mean faster response.",
  },
  ports: {
    title: "Port Scan",
    body:
      "Each port shows if it accepts TCP connections. 80 and 443 are common web ports, 22 is SSH, and 8080 is often alternate web services.",
  },
  port_detail: {
    title: "Single Port Result",
    body:
      "OPEN means this service port accepted a TCP connection. CLOSED means the host rejected or did not respond on that port.",
  },
};

function setLoading(isLoading) {
  analyzeBtn.disabled = isLoading;
  analyzeBtn.textContent = isLoading ? "Analyzing..." : "Analyze Domain";
  statusText.textContent = isLoading ? "Running network diagnostics..." : "";
}

function badgeClass(verdict) {
  if (verdict === "Healthy") return "badge-healthy";
  if (verdict === "Partial / Slow") return "badge-partial";
  return "badge-unreachable";
}

function openInfoModal(key) {
  const content = infoContent[key] || infoContent.diagnostics;
  modalTitle.textContent = content.title;
  modalBody.textContent = content.body;
  infoModal.classList.remove("hidden");
}

function closeInfoModal() {
  infoModal.classList.add("hidden");
}

function formatFileTimestamp(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function downloadReport() {
  if (!lastReport) return;

  const generatedAt = new Date();
  const payload = {
    generated_at: generatedAt.toISOString(),
    report_type: "NetScope Diagnostic Report",
    ...lastReport,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const downloadUrl = URL.createObjectURL(blob);
  const fileName = `netscope-report-${(lastReport.domain || "domain").replace(
    /[^a-zA-Z0-9.-]/g,
    "_"
  )}-${formatFileTimestamp(generatedAt)}.json`;

  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
}

function renderPorts(ports) {
  portsList.innerHTML = "";

  Object.entries(ports).forEach(([port, details]) => {
    const isOpen = details.open;
    const portElement = document.createElement("div");
    portElement.className = "port-pill";
    portElement.innerHTML = `
      <span>Port ${port}</span>
      <button class="info-btn" data-info="port_detail" aria-label="About this port result">i</button>
      <span class="port-status ${isOpen ? "port-open" : "port-closed"}">${
      isOpen ? "OPEN" : "CLOSED"
    }</span>
    `;
    portsList.appendChild(portElement);
  });
}

function renderResult(data) {
  lastReport = data;
  downloadBtn.disabled = false;
  resultCard.classList.remove("hidden");

  scoreValue.textContent = data.connectivity_score;
  resolvedIp.textContent = data.dns.resolved_ip || "Not resolved";
  httpStatus.textContent = data.http.success
    ? `${data.http.status_code} (${data.http.final_url})`
    : "Unavailable";
  latency.textContent =
    data.latency_ms !== null ? `${data.latency_ms} ms` : "N/A";

  verdictBadge.textContent = data.verdict;
  verdictBadge.className = `verdict-badge ${badgeClass(data.verdict)}`;

  renderPorts(data.ports);
}

async function analyzeDomain() {
  const domain = domainInput.value.trim();
  if (!domain) {
    statusText.textContent = "Please enter a valid domain.";
    return;
  }

  setLoading(true);
  resultCard.classList.add("hidden");
  downloadBtn.disabled = true;
  lastReport = null;

  try {
    const response = await fetch(
      `${API_BASE}/analyze?domain=${encodeURIComponent(domain)}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Request failed");
    }

    const data = await response.json();
    renderResult(data);
    statusText.textContent = "Diagnostics complete.";
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  } finally {
    setLoading(false);
  }
}

analyzeBtn.addEventListener("click", analyzeDomain);

domainInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    analyzeDomain();
  }
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".info-btn");
  if (button) {
    openInfoModal(button.dataset.info);
  }
});

closeModalBtn.addEventListener("click", closeInfoModal);
downloadBtn.addEventListener("click", downloadReport);

infoModal.addEventListener("click", (event) => {
  if (event.target === infoModal) {
    closeInfoModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeInfoModal();
  }
});
