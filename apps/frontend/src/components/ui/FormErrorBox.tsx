import type { FieldError } from "react-hook-form";

type FormErrorBox = {
  error: FieldError | undefined;
};

export default function FormErrorBox({ error }: FormErrorBox) {
  if (error) {
    return <div className="text-red-500 mb-1 text-xs ">{error.message}</div>;
  }

  return null;
}
