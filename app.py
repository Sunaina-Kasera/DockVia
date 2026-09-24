from flask import Flask, render_template, jsonify
import subprocess
import os
import re

app = Flask(
    __name__,
    template_folder="web/templates",
    static_folder="web/static"
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def run_script(script_path):
    try:
        result = subprocess.run(
            ["bash", os.path.join(BASE_DIR, script_path)],
            capture_output=True,
            text=True
        )

        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr
        }

    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": str(e)
        }


@app.route("/")
def dashboard():
    return render_template("index.html")

@app.route("/inventory")
def inventory_page():
    return render_template("inventory.html")

@app.route("/api/inventory")
def inventory():
    return jsonify(
        run_script("inventory/inventory.sh")
    )
@app.route("/monitor")
def monitor_page():
    return render_template("monitor.html")

@app.route("/api/monitor")
def monitor():
    return jsonify(
        run_script("monitor/monitor.sh")
    )

@app.route("/analyzer")
def analyzer_page():
    return render_template("analyzer.html")

@app.route("/api/analyzer")
def analyzer():
    return jsonify(
        run_script("analyzer/analyzer.sh")
    )

@app.route("/security")
def security_page():
    return render_template("security.html")

@app.route("/api/security")
def security():
    return jsonify(
        run_script("security/security.sh")
    )

@app.route("/recovery")
def recovery_page():
    return render_template("recovery.html")

@app.route("/api/recovery")
def recovery():
    return jsonify(
        run_script("recovery/recovery.sh")
    )
@app.route("/reports")
def reports_page():
    return render_template("reports.html")

@app.route("/api/summary")
def summary():

    try:
        containers = subprocess.run(
            ["docker", "ps", "-aq"],
            capture_output=True,
            text=True
        )

        running = subprocess.run(
            ["docker", "ps", "-q"],
            capture_output=True,
            text=True
        )

        images = subprocess.run(
            ["docker", "images", "-q"],
            capture_output=True,
            text=True
        )

        analyzer_result = run_script("analyzer/analyzer.sh")

        total_containers = len(
            set(containers.stdout.splitlines())
        )

        running_containers = len(
            set(running.stdout.splitlines())
        )

        total_images = len(
            set(images.stdout.splitlines())
        )

        health_score = 0

        match = re.search(
            r"Health Score\s*:\s*(\d+)",
            analyzer_result["output"]
        )

        if match:
            health_score = int(match.group(1))

        return jsonify({
            "success": True,
            "containers": total_containers,
            "running": running_containers,
            "images": total_images,
            "health": health_score
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        })


@app.route("/api/resources")
def resources():

    try:

        result = subprocess.run(
            [
                "docker",
                "stats",
                "--no-stream",
                "--format",
                "{{.Name}}|{{.CPUPerc}}|{{.MemUsage}}|{{.MemPerc}}|{{.NetIO}}"
            ],
            capture_output=True,
            text=True
        )

        containers = []

        for line in result.stdout.strip().splitlines():

            if not line:
                continue

            parts = line.split("|")

            if len(parts) == 5:

                containers.append({
                    "name": parts[0],
                    "cpu": parts[1],
                    "memory": parts[2],
                    "memory_percent": parts[3],
                    "network": parts[4]
                })

        return jsonify({
            "success": True,
            "containers": containers
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        })


if __name__ == "__main__":
    app.run(debug=True)