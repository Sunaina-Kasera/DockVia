/* =========================================================
   DOCKVIA — MONITOR
========================================================= */

async function loadResources() {

    const errorBox =
        document.getElementById("monitor-error");

    errorBox.style.display = "none";


    try {

        const response =
            await fetch("/api/resources");


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error ||
                "Unable to load resources."
            );

        }


        renderResources(
            data.containers
        );


        document.getElementById(
            "last-updated"
        ).textContent =
            "Updated " +
            new Date().toLocaleTimeString();

    }


    catch (error) {

        console.error(
            "DockVia monitor error:",
            error
        );


        errorBox.textContent =
            "Unable to load Docker resources: " +
            error.message;

        errorBox.style.display =
            "block";

    }

}


/* =========================================================
   RENDER RESOURCE DATA
========================================================= */

function renderResources(containers) {

    const table =
        document.getElementById(
            "resource-table"
        );


    if (!containers ||
        containers.length === 0) {

        table.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="loading-cell">

                    No running containers.

                </td>
            </tr>
        `;

        updateSummary([]);

        return;

    }


    table.innerHTML =
        containers.map(container => {

            const memoryPercent =
                parseFloat(
                    container.memory_percent
                ) || 0;


            return `
                <tr>

                    <td>

                        <span class="container-name">
                            ${escapeHtml(
                                container.name
                            )}
                        </span>

                    </td>


                    <td>

                        <span class="resource-value cpu-value">
                            ${escapeHtml(
                                container.cpu
                            )}
                        </span>

                    </td>


                    <td>

                        <span class="resource-value">
                            ${escapeHtml(
                                container.memory
                            )}
                        </span>

                    </td>


                    <td>

                        <span class="resource-value">
                            ${escapeHtml(
                                container.memory_percent
                            )}
                        </span>


                        <div class="memory-bar">

                            <span
                                style="width:${Math.min(
                                    memoryPercent,
                                    100
                                )}%">
                            </span>

                        </div>

                    </td>


                    <td>

                        <span class="resource-value">
                            ${escapeHtml(
                                container.network
                            )}
                        </span>

                    </td>

                </tr>
            `;

        }).join("");


    updateSummary(containers);

}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary(containers) {

    const running =
        containers.length;


    document.getElementById(
        "running-count"
    ).textContent =
        running;


    let cpuTotal = 0;


    containers.forEach(container => {

        const cpu =
            parseFloat(
                container.cpu
            );


        if (!isNaN(cpu)) {

            cpuTotal += cpu;

        }

    });


    document.getElementById(
        "cpu-total"
    ).textContent =
        cpuTotal.toFixed(1) + "%";


    let memoryText = "--";


    if (containers.length > 0) {

        memoryText =
            containers.length +
            " active";

    }


    document.getElementById(
        "memory-total"
    ).textContent =
        memoryText;

}


/* =========================================================
   GET STOPPED CONTAINERS
========================================================= */

async function loadMonitorSummary() {

    try {

        const response =
            await fetch("/api/summary");


        const data =
            await response.json();


        if (!data.success) {
            return;
        }


        document.getElementById(
            "running-count"
        ).textContent =
            data.running;


        document.getElementById(
            "stopped-count"
        ).textContent =
            data.containers -
            data.running;


    } catch (error) {

        console.error(
            "Monitor summary error:",
            error
        );

    }

}


/* =========================================================
   DOCKER DISK
========================================================= */

async function loadDiskUsage() {

    try {

        const response =
            await fetch("/api/monitor");


        const data =
            await response.json();


        if (!data.success) {
            return;
        }


        const output =
            data.output;


        const start =
            output.indexOf(
                "Docker Disk Usage"
            );


        const end =
            output.indexOf(
                "Monitor Summary"
            );


        if (
            start !== -1 &&
            end !== -1
        ) {

            const disk =
                output
                    .substring(
                        start +
                        "Docker Disk Usage".length,
                        end
                    )
                    .trim();


            document.getElementById(
                "disk-output"
            ).textContent =
                disk;

        }

    }

    catch (error) {

        console.error(
            "Disk usage error:",
            error
        );

    }

}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   INITIAL LOAD
========================================================= */

loadResources();

loadMonitorSummary();

loadDiskUsage();


/* =========================================================
   AUTO REFRESH
========================================================= */

setInterval(() => {

    loadResources();

    loadMonitorSummary();

}, 5000);