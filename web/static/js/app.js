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