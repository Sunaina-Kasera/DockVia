/* =========================================================
   DOCKVIA — INVENTORY
========================================================= */

async function loadInventory() {

    const errorBox =
        document.getElementById("inventory-error");

    errorBox.style.display = "none";


    try {

        const response =
            await fetch("/api/inventory");


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.error || "Inventory scan failed."
            );

        }


        parseInventory(data.output);


    } catch (error) {

        console.error(
            "DockVia inventory error:",
            error
        );


        errorBox.textContent =
            "Unable to load Docker inventory: "
            + error.message;

        errorBox.style.display =
            "block";

    }

}


/* =========================================================
   PARSE BASH OUTPUT
========================================================= */

function parseInventory(output) {

    const lines =
        output.split("\n");


    let section = "";


    const containers = [];
    const images = [];
    const volumes = [];
    const networks = [];


    let dockerVersion = "--";


    for (let line of lines) {

        line = line.trim();


        if (!line) {
            continue;
        }


        /* Docker Version */

        if (line === "Docker Version") {

            section = "docker";

            continue;

        }


        /* Containers */

        if (line === "Containers") {

            section = "containers";

            continue;

        }


        /* Images */

        if (line === "Images") {

            section = "images";

            continue;

        }


        /* Volumes */

        if (line === "Volumes") {

            section = "volumes";

            continue;

        }


        /* Networks */

        if (line === "Networks") {

            section = "networks";

            continue;

        }


        if (line.startsWith("Docker version")) {

            dockerVersion =
                line.replace("Docker version", "Docker");

            continue;

        }


        /* Ignore table separators */

        if (
            line.startsWith("---") ||
            line.startsWith("===") ||
            line.startsWith("CONTAINER") ||
            line.startsWith("NAMES") ||
            line.startsWith("REPOSITORY") ||
            line.startsWith("DRIVER") ||
            line.startsWith("VOLUME")
        ) {

            continue;

        }


        /* Containers */

        if (section === "containers") {

            const parts =
                line.split(/\s{2,}/);

            if (parts.length >= 3) {

                containers.push({

                    name: parts[0],

                    status: parts[1],

                    image: parts[2]

                });

            }

        }


        /* Images */

        else if (section === "images") {

            const parts =
                line.split(/\s{2,}/);

            if (parts.length >= 3) {

                images.push({

                    repository: parts[0],

                    tag: parts[1],

                    size: parts[2]

                });

            }

        }


        /* Volumes */

        else if (section === "volumes") {

    const parts =
        line.split(/\s+/);

    if (
        parts.length >= 2 &&
        parts[0] === "local"
    ) {

        volumes.push(
            parts.slice(1).join(" ")
        );

    }

}


        /* Networks */

        else if (section === "networks") {

    const parts =
        line.split(/\s+/);

    if (
        parts.length >= 2 &&
        parts[1]
    ) {

        networks.push(parts[1]);

    }

}

    }


    renderInventory({

        dockerVersion,

        containers,

        images,

        volumes,

        networks

    });

}


/* =========================================================
   RENDER
========================================================= */

function renderInventory(data) {


    /* Summary */

    document.getElementById(
        "container-count"
    ).textContent =
        data.containers.length;


    document.getElementById(
        "image-count"
    ).textContent =
        data.images.length;


    document.getElementById(
        "volume-count"
    ).textContent =
        data.volumes.length;


    document.getElementById(
        "network-count"
    ).textContent =
        data.networks.length;


    document.getElementById(
        "docker-version"
    ).textContent =
        data.dockerVersion;


    document.getElementById(
        "container-status"
    ).textContent =
        data.containers.length
        + " detected";


    /* Containers */

    const containerTable =
        document.getElementById(
            "containers-table"
        );


    if (data.containers.length === 0) {

        containerTable.innerHTML = `
            <tr>
                <td colspan="3"
                    class="loading-cell">
                    No containers found.
                </td>
            </tr>
        `;

    } else {

        containerTable.innerHTML =
            data.containers.map(container => {

                const running =
                    container.status
                        .toLowerCase()
                        .includes("up");


                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(container.name)}
                            </strong>
                        </td>

                        <td>

                            <span class="status-badge ${
                                running
                                ? "status-running"
                                : "status-stopped"
                            }">

                                ${escapeHtml(
                                    container.status
                                )}

                            </span>

                        </td>

                        <td>
                            ${escapeHtml(
                                container.image
                            )}
                        </td>

                    </tr>
                `;

            }).join("");

    }


    /* Images */

    const imageTable =
        document.getElementById(
            "images-table"
        );


    if (data.images.length === 0) {

        imageTable.innerHTML = `
            <tr>
                <td colspan="3"
                    class="loading-cell">
                    No images found.
                </td>
            </tr>
        `;

    } else {

        imageTable.innerHTML =
            data.images.map(image => {

                return `
                    <tr>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    image.repository
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(image.tag)}
                        </td>

                        <td>
                            ${escapeHtml(image.size)}
                        </td>

                    </tr>
                `;

            }).join("");

    }


    /* Volumes */

    renderResourceList(
        "volumes-list",
        data.volumes
    );


    /* Networks */

    renderResourceList(
        "networks-list",
        data.networks
    );

}


/* =========================================================
   RESOURCE LIST
========================================================= */

function renderResourceList(
    elementId,
    items
) {

    const element =
        document.getElementById(elementId);


    if (items.length === 0) {

        element.innerHTML = `
            <div class="loading-cell">
                None found.
            </div>
        `;

        return;

    }


    element.innerHTML =
        items.map(item => {

            return `
                <div class="resource-item">

                    <span class="resource-dot"></span>

                    <span>
                        ${escapeHtml(item)}
                    </span>

                </div>
            `;

        }).join("");

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

loadInventory();