import React from "react";
import TextField from "@mui/material/TextField";

function CPFField() {
  const [cpf, setCpf] = React.useState("");

  const formatCPF = (value) => {

    value = value.replace(/\D/g, "");


    value = value.slice(0, 11);


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
      inputProps={{ inputMode: "numeric" }} 
      fullWidth
    />
  );
}

export default CPFField;