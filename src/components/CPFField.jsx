import React from "react";
import TextField from "@mui/material/TextField";

function CPFField({ value, onChange, name }) {

  const formatCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return value;
  };

  const handleChange = (e) => {
    const formatted = formatCPF(e.target.value);

    onChange({
      target: {
        name,
        value: formatted,
      },
    });
  };

  return (
    <TextField
      label="CPF"
      value={value}
      onChange={handleChange}
      inputProps={{ inputMode: "numeric" }}
      fullWidth
    />
  );
}

export default CPFField;