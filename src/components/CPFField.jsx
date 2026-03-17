import React from "react";
import TextField from "@mui/material/TextField";

function CPFField() {
  const [cpf, setCpf] = React.useState("");

  const formatCPF = (value) => {
    // Remove tudo que não for número
    value = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    value = value.slice(0, 11);

    // Aplica a máscara
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return value;
  };

  const handleChange = (e) => {
    setCpf(formatCPF(e.target.value));
  };

  return (
    <TextField
      label="CPF"
      value={cpf}
      onChange={handleChange}
      inputProps={{ inputMode: "numeric" }} // teclado numérico no mobile
      fullWidth
    />
  );
}

export default CPFField;