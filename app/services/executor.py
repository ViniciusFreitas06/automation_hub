import importlib


def execute(script_name: str, input_path, output_path):
    module = importlib.import_module(f"scripts.{script_name}")
    module.run(input_path, output_path)
