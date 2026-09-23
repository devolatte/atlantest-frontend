(() => {
  const results = [
    {
      code: "TEST 001: PASS",
      message: "Button responded to input. This is suspiciously close to intended behavior.",
      state: "pass"
    },
    {
      code: "TEST 002: BUG CONFIRMED",
      message: "A result appeared before anyone agreed on the expected result. Evidence preserved.",
      state: "bug"
    },
    {
      code: "TEST 003: INCONCLUSIVE",
      message: "The tester is now part of the test. A second tester would create a second test.",
      state: "inconclusive"
    },
    {
      code: "TEST 004: VERIFIED",
      message: "The bug changed behavior while being observed. Observation successfully reproduced.",
      state: "verified"
    }
  ];

  const runner = document.getElementById("runner");
  const runButton = document.getElementById("run-test");
  const resultCode = document.getElementById("result-code");
  const resultMessage = document.getElementById("result-message");
  const runCount = document.getElementById("run-count");
  const stamp = document.getElementById("test-stamp");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let count = 0;

  if (runner && runButton && resultCode && resultMessage && runCount) {
    runButton.addEventListener("click", () => {
      const result = results[count % results.length];
      count += 1;

      runner.dataset.result = result.state;
      resultCode.textContent = result.code;
      resultMessage.textContent = result.message;
      runCount.textContent = String(count).padStart(2, "0");

      if (stamp && !reduceMotion.matches && typeof stamp.animate === "function") {
        stamp.animate(
          [
            { transform: "rotate(7deg) scale(1)" },
            { transform: "rotate(4deg) scale(0.94)" },
            { transform: "rotate(7deg) scale(1)" }
          ],
          { duration: 240, easing: "ease-out" }
        );
      }
    });
  }

  const contractSection = document.querySelector(".contract");
  const contractAddress = document.getElementById("contract-address");
  const contractStatus = document.getElementById("contract-status");
  const copyButton = document.getElementById("copy-contract");
  const configuredAddress = typeof window.AQUA_CONFIG?.TOKEN_CA === "string"
    ? window.AQUA_CONFIG.TOKEN_CA.trim()
    : "";

  if (configuredAddress && contractSection && contractAddress && contractStatus && copyButton) {
    contractAddress.textContent = configuredAddress;
    contractStatus.textContent = "CONFIGURED";
    copyButton.disabled = false;
    contractSection.classList.add("configured");

    copyButton.addEventListener("click", async () => {
      let copied = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(configuredAddress);
          copied = true;
        } catch {
          copied = false;
        }
      }

      if (!copied) {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = configuredAddress;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        try {
          copied = document.execCommand("copy");
        } catch {
          copied = false;
        }

        temporaryInput.remove();
      }

      contractStatus.textContent = copied ? "COPIED" : "COPY FAILED";

      window.setTimeout(() => {
        contractStatus.textContent = "CONFIGURED";
      }, 1800);
    });
  }
})();
