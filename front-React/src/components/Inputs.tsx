import { useDebounce } from "@/hooks/use-debounce.ts";
import { useQuery, useQueryClient, type UseBaseQueryOptions } from "@tanstack/react-query";
import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useRef, useState, type RefObject} from "react";
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ErrorMap: (string | undefined)[];
}

export function TextInput({ label, name, ErrorMap, onChange }: TextInputProps) {
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
export function NumberInput({ label, name, ErrorMap, onChange }: TextInputProps) {
  return (
    <label className="text-white" htmlFor={name}>
      <p className="mb-1.5 text-[1.1em] ">{label}</p>
      <input
        onChange={onChange}
        type="number"
        id={name}
        name={name}
        className="bg-white rounded-sm no-spin focus:outline-Secundaria focus:outline-3 text-black p-1.5"
      />
      <p className="text-red-500 text">{ErrorMap[0]}</p>
    </label>
  );
}

export function PassWordInput({
  label,
  name,
  ErrorMap,
  onChange,
}: TextInputProps) {
  const [plain, setPlain] = useState(true);
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

interface SelectInputProps<T extends Array<any>> extends TextInputProps {
  optsUseData: UseBaseQueryOptions<T>;
  filter: (data: T, value: string) => T;
  ref?: RefObject<HTMLInputElement | null>;
  option: (data: T, pai: HTMLInputElement) => React.ReactNode;
}
export function SelectInput<T extends Array<any>>({
  label,
  name,
  ErrorMap,
  onChange,
  optsUseData,
  option,
  filter,
  ref = useRef<HTMLInputElement>(null),
}: React.PropsWithChildren<SelectInputProps<T>>) {
  const [value, setValue] = useState("");
  // const inputRef = useRef<HTMLInputElement>(ref?.current??null);
  const [filteredData, setFilteredData] = useState<T>();
  const debouncedValue = useDebounce(value, 300);
  const [open, setOpen] = useState(false);
  const { data, refetch } = useQuery(optsUseData);
  // if (inputRef.current && ref?.current) {
  //   ref.current = inputRef.current;
  // }
  useEffect(() => {
    if (data) {
      refetch();
      console.log(data);
      setFilteredData(filter(data, debouncedValue.toLowerCase()));
    }
    // ref!.current = inputRef.current;
  }, [debouncedValue, data]);

  return (
    <label className="text-white relative" htmlFor={name}>
      <p className="mb-1.5 text-[1.1em]">{label}</p>
      <input
        ref={ref}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onChange={(e) => {
          setValue(e.target.value);
          onChange && onChange(e);
        }}
        type="text"
        id={name}
        name={name}
        className="bg-white rounded-sm  focus:outline-Secundaria focus:outline-3 text-black p-1.5"
      />

      {filteredData &&
        ref.current &&
        open &&
        option(filteredData, ref.current)}

      <p className="text-red-500 text">{ErrorMap[0]}</p>
    </label>
  );
}

export function FileInput({ label, name, ErrorMap, onChange }: TextInputProps) {
  const [path, setPath] = useState("Insira um arquivo");
  const prefix = "C:\\fakepath\\";
  const final = /.jpg|.png|.jpeg/;
  if (!path.match(final) && path !== "Insira um arquivo")
    ErrorMap.push("O Arquivo precisa ser uma imagem");
  return (
    <label className="text-white" htmlFor={name}>
      <p className="mb-1.5 text-[1.1em]">{label}</p>
      <input
        type="file"
        name={name}
        onChange={(e) => {
          setPath(e.target.value);
          onChange && onChange(e);
        }}
        id={name}
        className="hidden "
      />
      <div className="bg-Primaria rounded-md cursor-pointer text-black p-5">
        {path.replace(prefix, "")}
      </div>
      <p className="text-red-500 text">{ErrorMap[0]}</p>
    </label>
  );
}
export function SubmitBtn() {}
