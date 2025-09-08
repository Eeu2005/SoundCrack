import {Eye,EyeClosed} from "lucide-react";
import { useState } from "react";
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ErrorMap: (string | undefined)[];
}

export function TextInput({
  label,
  name,
  ErrorMap,
  onChange,
}: TextInputProps) {
  console.log(ErrorMap);
  return (
    <label className="text-white" htmlFor={name}>
      <p className="mb-1.5 text-[1.1em] ">{label}</p>
      <input
        onChange={onChange}
        type="text"
        id={name}
        name={name}
        className="bg-white rounded-sm  focus:outline-Secundaria focus:outline-3 text-black p-1.5"
      />
      <p className="text-red-500 text">{ErrorMap[0]}</p>
    </label>
  );
}

export function PassWordInput({
  label,
  name,
  ErrorMap,
  onChange
}: TextInputProps) {
  const [plain, setPlain] = useState(true) 
    return (
      <label className="text-white" htmlFor={name}>
        <p className="mb-1.5 text-[1.1em]">{label}</p>
        <div className="flex has-focus:outline-Secundaria rounded-sm has-focus:outline-3 w-fit items-center bg-white">
          {" "}
          <input
            onChange={onChange}
            type={!plain ? "text" : "password"}
            id={name}
            name={name}
            className="focus:outline-none  bg-white text-black p-1.5"
          />
          {plain ? (
            <EyeClosed
              className="text-Secundaria  ml-3 mr-5 "
              onClick={() => setPlain(!plain)}
              alignmentBaseline="middle"
              accentHeight={5}
            />
          ) : (
            <Eye
              className="text-Secundaria   ml-3 mr-5"
              onClick={() => setPlain(!plain)}
              alignmentBaseline="middle"
              accentHeight={5}
            />
          )}
        </div>
        <p className="text-red-500 text">{ErrorMap[0]}</p>
      </label>
    );
}
export function SubmitBtn(){

}