import streamlit as st
import requests

st.set_page_config(page_title="Automation Hub", layout="centered")

st.title("Automation Hub")
st.write("Centra de execução de scripts")
st.markdown("---")
st.subheader("1. Escolha um script")

response = requests.get("http://127.0.0.1:8000/scripts/")

if response.status_code == 200:
    scripts = response.json()
    script_selected = st.selectbox("Scripts disponíveis", scripts)
else:
    st.error("Erro ao buscar scripts")

st.markdown("---")
st.subheader("2. Selecione um arquivo")
uploaded_file = st.file_uploader("Escolha o arquivo")

if st.button("Executar"):
    if uploaded_file is None:
        st.warning("Envie um arquivo primeiro")
        st.stop()

    with st.spinner("Executando..."):
        files = {"file": (uploaded_file.name, uploaded_file.getvalue())}
        data = {"script_name": script_selected}

        response = requests.post(
            "http://127.0.0.1:8000/runner/", files=files, data=data
        )

    if response.status_code == 200:
        result = response.json()
        st.success("Script executado com sucesso!")

        output_path = result["output_file"]

        with open(output_path, "rb") as f:
            st.download_button(
                label="Baixar resultado", data=f, file_name=output_path.split("/")[-1]
            )
    else:
        st.error(f"Erro: {response.text}")


st.markdown("---")
st.subheader("3. Adicionar um script")

st.write("Envie um novo script para a pasta de scripts")
new_script = st.file_uploader("Escolha um script para adicionar", type=["py"])

if st.button("Enviar"):
    if new_script is None:
        st.warning("Envie um script primeiro")
        st.stop()

    with st.spinner("Enviando script..."):
        files = {
            "file": (
                new_script.name,
                new_script.read(),
                new_script.type
            )
        }

        response = requests.post(
            "http://127.0.0.1:8000/scripts/upload",
            files=files
        )

    if response.status_code == 200:
        st.success("Script enviado com sucesso!")
    else:
        st.error(f"Erro: {response.text}")