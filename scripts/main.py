from dijkstra import dijkstra

grafo = {
    "São Paulo": [("Campinas", 100), ("São José dos Campos", 80), ("Santos", 70)],
    "Campinas": [("São Paulo", 100), ("Ribeirão Preto", 200), ("Sorocaba", 90)],
    "Santos": [("São Paulo", 70), ("São Vicente", 20)],
    "São José dos Campos": [("São Paulo", 80), ("Taubaté", 40)],
    "Ribeirão Preto": [("Campinas", 200), ("São Carlos", 120)],
    "Sorocaba": [("Campinas", 90), ("Itu", 30)],
    "Taubaté": [("São José dos Campos", 40), ("Ubatuba", 110)],
    "São Carlos": [("Ribeirão Preto", 120)],
    "São Vicente": [("Santos", 20)],
    "Itu": [("Sorocaba", 30)],
    "Ubatuba": [("Taubaté", 110)],
}

print("Grafo: A → B (10), A → C (6), C → B (2), B → D (2)")
distancias, predecessores = dijkstra(grafo, "São Paulo")
print(f"\n RESULTADO FINAL:")
print(f"Distancias: {distancias}")
print(f"Predecessores: {predecessores}")


# Reconstruir caminho A → D
def reconstruir_caminho(predecessores, inicio, fim):
    caminho = []
    atual = fim
    while atual != inicio:
        caminho.append(atual)
        atual = predecessores[atual]
    caminho.append(inicio)
    caminho.reverse()
    return caminho


caminho = reconstruir_caminho(predecessores, "São Paulo", "São Carlos")
print(f"Menor caminho A → D: {' → '.join(caminho)}")
print(f"Distância: {distancias['São Carlos']}")
