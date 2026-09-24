/* =========================
   SIDE MENU
========================= */

function toggleMenu() {

    const menu =
        document.getElementById("side-menu");

    const overlay =
        document.getElementById("overlay");


    menu.classList.toggle("active");

    overlay.classList.toggle("active");

}


function closeMenu() {

    document
        .getElementById("side-menu")
        .classList.remove("active");


    document
        .getElementById("overlay")
        .classList.remove("active");

}


/* =========================
   SEARCH
========================= */

function toggleSearch() {

    const searchBox =
        document.getElementById("search-box");


    searchBox.classList.toggle("active");


    if (searchBox.classList.contains("active")) {

        document
            .getElementById("search-input")
            .focus();

    }

}


/* =========================
   DOCKER SUMMARY
========================= */

async function loadSummary() {

    try {

        const response =
            await fetch("/api/summary");


        const data =
            await response.json();


        if (!data.success) {
            return;
        }


        document
            .getElementById("running-count")
            .textContent =
            data.running;


        document
            .getElementById("image-count")
            .textContent =
            data.images;


        document
            .getElementById("health-score")
            .textContent =
            data.health + "/100";


        const stopped =
            data.containers - data.running;


        document
            .getElementById("stopped-count")
            .textContent =
            stopped >= 0
                ? stopped
                : 0;

    }

    catch (error) {

        console.error(
            "DockVia summary error:",
            error
        );

    }

}


/* =========================
   INITIAL LOAD
========================= */

loadSummary();


/* =========================
   AUTO REFRESH
========================= */

setInterval(
    loadSummary,
    10000
);