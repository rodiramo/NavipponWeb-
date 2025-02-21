import CurrencyInput from "react-currency-input-field";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const PriceInput = ({ price, setPrice }) => {
  const theme = useTheme();

  return (
    <Box marginTop={3}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          marginBottom: "8px",
        }}
      >
        Precio Aproximado
      </Typography>

      <CurrencyInput
        id="price"
        value={price}
        decimalsLimit={2}
        decimalSeparator="."
        groupSeparator=","
        prefix="¥ "
        onValueChange={(value) => setPrice(value)}
        allowNegativeValue={false}
        style={{
          width: "100%",
          height: "56px",
          fontSize: "16px",
          borderRadius: "10px",
          border: `1.5px solid ${theme.palette.secondary.light}`,
          paddingLeft: "16px",
          backgroundColor: "white",
        }}
        placeholder="Ingresa el precio"
      />
    </Box>
  );
};

export default PriceInput;
