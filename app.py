from flask import Flask, render_template, jsonify
import subprocess
import os

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


if __name__ == "__main__":
    app.run(debug=True)