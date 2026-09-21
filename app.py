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


@app.route("/api/inventory")
def inventory():
    return jsonify(
        run_script("inventory/inventory.sh")
    )


@app.route("/api/monitor")
def monitor():
    return jsonify(
        run_script("monitor/monitor.sh")
    )


@app.route("/api/analyzer")
def analyzer():
    return jsonify(
        run_script("analyzer/analyzer.sh")
    )


@app.route("/api/security")
def security():
    return jsonify(
        run_script("security/security.sh")
    )


@app.route("/api/recovery")
def recovery():
    return jsonify(
        run_script("recovery/recovery.sh")
    )


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


if __name__ == "__main__":
    app.run(debug=True)