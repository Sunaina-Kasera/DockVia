async function runModule(module) {

    const resultBox = document.getElementById("result");

    resultBox.style.display = "block";
    resultBox.textContent = "Running " + module + "...";

    try {

        const response = await fetch("/api/" + module);
        const data = await response.json();

        if (data.success) {
            resultBox.textContent = data.output;
        } else {
            resultBox.textContent =
                "ERROR\n\n" + data.error + "\n\n" + data.output;
        }

    } catch (error) {

        resultBox.textContent =
            "Failed to connect to DockVia backend:\n\n" + error;
    }
}


/* Load dashboard summary */

async function loadSummary() {

    try {

        const response = await fetch("/api/summary");
        const data = await response.json();

        if (!data.success) {
            console.error("Failed to load summary:", data.error);
            return;
        }

        const cards = document.querySelectorAll(".card .value");

        cards[0].textContent = data.containers;
        cards[1].textContent = data.running;
        cards[2].textContent = data.images;
        cards[3].textContent = data.health + "/100";

    } catch (error) {

        console.error("Dashboard summary error:", error);
    }
}


/* Load summary when dashboard opens */

loadSummary();

setInterval(loadSummary, 10000);