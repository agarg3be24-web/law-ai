document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".year").forEach(el => el.textContent = new Date().getFullYear());

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  // Legal query form. Replace /api/legal-query with the real LLM backend endpoint.
  const queryForm = document.getElementById("queryForm");
  if (queryForm) {
    queryForm.addEventListener("submit", async e => {
      e.preventDefault();
      const query = document.getElementById("legalQuery").value.trim();
      const responseBox = document.getElementById("queryResponse");
      const responseText = document.getElementById("queryResponseText");
      if (!query) return;
      responseBox.hidden = false;
      responseText.textContent = "Saathi is preparing your answer...";

      try {
        const response = await fetch("/api/legal-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query })
        });
        if (!response.ok) throw new Error("API unavailable");
        const data = await response.json();
        responseText.textContent = data.answer || data.response || "No answer was returned.";
      } catch (error) {
        responseText.textContent = "Your question was received. Connect the /api/legal-query endpoint to your LLM service to return the actual answer.";
      }
    });
  }

  // Document upload UI. The actual storage/processing endpoint can be connected later.
  const documentForm = document.getElementById("documentForm");
  const documentInput = document.getElementById("documents");
  const dropZone = document.querySelector(".drop-zone");
  const fileList = document.getElementById("fileList");

  function showFiles(files) {
    if (!fileList) return;
    fileList.innerHTML = "";
    Array.from(files).forEach(file => {
      const item = document.createElement("div");
      item.className = "file-item";
      item.innerHTML = `<span>${file.name}</span><span>${Math.ceil(file.size / 1024)} KB</span>`;
      fileList.appendChild(item);
    });
  }

  if (documentInput) documentInput.addEventListener("change", () => showFiles(documentInput.files));
  if (dropZone) {
    ["dragenter", "dragover"].forEach(eventName => dropZone.addEventListener(eventName, e => {
      e.preventDefault(); dropZone.classList.add("dragover");
    }));
    ["dragleave", "drop"].forEach(eventName => dropZone.addEventListener(eventName, e => {
      e.preventDefault(); dropZone.classList.remove("dragover");
    }));
    dropZone.addEventListener("drop", e => showFiles(e.dataTransfer.files));
  }
  if (documentForm) {
    documentForm.addEventListener("submit", async e => {
      e.preventDefault();
      const status = document.getElementById("uploadStatus");
      if (!documentInput.files.length) {
        status.textContent = "Please choose at least one document.";
        return;
      }
      status.textContent = "Documents selected. Connect the document-processing API to upload and analyse them.";
    });
  }

  // Report generator UI. Replace /api/generate-report with the real LLM backend endpoint.
  const reportForm = document.getElementById("reportForm");
  if (reportForm) {
    reportForm.addEventListener("submit", async e => {
      e.preventDefault();
      const situation = document.getElementById("situation").value.trim();
      const output = document.getElementById("reportOutput");
      const reportText = document.getElementById("reportText");
      if (!situation) return;
      output.hidden = false;
      reportText.textContent = "Legal Saathi is generating your report...";

      try {
        const response = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ situation })
        });
        if (!response.ok) throw new Error("API unavailable");
        const data = await response.json();
        reportText.textContent = data.report || data.response || "No report was returned.";
      } catch (error) {
        reportText.textContent = "Your situation has been captured in the interface. Connect the /api/generate-report endpoint to your LLM service to generate the actual report.";
      }
    });
  }

  const printButton = document.getElementById("printReport");
  if (printButton) printButton.addEventListener("click", () => window.print());
});
