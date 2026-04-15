import type { FieldError } from "react-hook-form";

type FormErrorBox = {
  error: FieldError | undefined;
};

export default function FormErrorBox({ error }: FormErrorBox) {
  if (error) {
    return <div className="text-red-500 mb-1 text-sm ">{error.message}</div>;
  }

  return null;
}
