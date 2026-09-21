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


/* Load resource monitoring */

async function loadResources() {

    const table = document.getElementById("resource-table");

    try {

        const response = await fetch("/api/resources");
        const data = await response.json();

        if (!data.success) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        Failed to load resource data
                    </td>
                </tr>
            `;

            return;
        }


        if (data.containers.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        No running containers
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML = "";


        data.containers.forEach(container => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${container.name}</td>
                <td>${container.cpu}</td>
                <td>${container.memory}</td>
                <td>${container.memory_percent}</td>
                <td>${container.network}</td>
            `;

            table.appendChild(row);

        });

    } catch (error) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to connect to DockVia backend
                </td>
            </tr>
        `;

        console.error(error);
    }
}


/* Initial dashboard load */

loadSummary();
loadResources();


/* Auto refresh */

setInterval(loadSummary, 10000);
setInterval(loadResources, 10000);