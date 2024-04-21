import React, { FC, useState } from 'react';
import { TextField } from "@mui/material";

interface InputGroupProps {
   label: string,
   type?: "text" | "password" | "email" | "number" | "date",
   field: string,
   validator: (value: string) => string | false | undefined,
   onChange: (isValid: boolean) => void,
   setIncomeValue?: (value: string) => void,
   defaultValue?: string | null
}

const InputGroup: FC<InputGroupProps> = ({
   label,
   type = "text",
   field,
   onChange,
   validator,
   setIncomeValue,
   defaultValue
}) => {
   const [value, setValue] = useState(defaultValue ?? "");
   const [error, setError] = useState<string | false | undefined>(false);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const errorMessage = validator(newValue);
      setValue(newValue);
      setError(errorMessage);
      onChange(!errorMessage);
      if (setIncomeValue) {
         setIncomeValue(newValue);
      }
   };

   const inputStyles = {
      '& label.Mui-focused': {
         color: '#FF7F50',
      },
      '& .MuiInput-underline:after': {
         borderBottomColor: '#FF7F50',
      },
      '& .MuiOutlinedInput-root': {
         '& fieldset': {
            borderColor: error ? 'red' : '#FF7F50',
         },
         '&:hover fieldset': {
            borderColor: '#FF9966',
         },
         '&.Mui-focused fieldset': {
            borderColor: '#FF7F50',
         },
      },
      '& .MuiFormHelperText-root': {
         color: error ? 'red' : '#FF7F50',
      }
   };

   return (
      <TextField
         fullWidth
         label={label}
         type={type}
         value={value}
         id={field}
         name={field}
         onChange={handleChange}
         error={!!error}
         helperText={error}
         sx={inputStyles}
         InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      />
   );

};

export default InputGroup;
