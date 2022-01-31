import { FormControl, FormLabel, Input, InputProps } from "@chakra-ui/react";
import { forwardRef } from "react";

interface TextInputProps extends InputProps {
  label: string;
  id: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ id, label, ...props }, ref) => {
    return (
      <FormControl>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <Input {...props} id={id} ref={ref} />
      </FormControl>
    );
  }
);
TextInput.displayName = "TextInput";

export default TextInput;
