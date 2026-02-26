import pandas as pd

def run(input_path, output_path):
    # Lê o CSV
    df = pd.read_csv(input_path)

    # Adiciona uma nova coluna fixa
    df["nova_coluna"] = "teste"

    # Ou se quiser algo baseado em outra coluna:
    # df["nova_coluna"] = df.iloc[:, 0]  # copia primeira coluna

    # Salva o CSV modificado
    df.to_csv(output_path, index=False)

    print("Script executado com sucesso!")