import pandas as pd


def run(input_path, output_path):
    df = pd.read_csv(input_path)
    df["Caminhao"] = "pardal"
    df.to_csv(output_path, index=False)
