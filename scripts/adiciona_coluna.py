import csv


def run(input_path, output_path):
    with open(input_path, mode="r", newline="", encoding="utf-8") as infile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames + ["nova_coluna"]

        with open(output_path, mode="w", newline="", encoding="utf-8") as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()

            for row in reader:
                # Aqui você define o valor da nova coluna
                row["nova_coluna"] = "valor_fixo"
                writer.writerow(row)
