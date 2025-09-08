import { Consts } from "@/env";
import type { User } from "@/types.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(`${Consts.BASE_URL}/login`, {
        credentials: "same-origin",
      });
      const data = (await res.json()) as User;
      return data;
    },
  });
  return (
    <header className="bg-background text-Primaria flex justify-evenly">
      <div className="pt-1.5 pb-1.5 flex flex-col items-center justify-center">
        <h1 className=" font-ribeye text-4xl ">Sound</h1>
        <h2 className="font-ribeye text-[2.8em]">Crack</h2>
      </div>
      <nav className="flex items-center justify-around w-[40%] text-2xl *:transition-all *:duration-300 *:hover:scale-150  ">
        <Link to="/">
          <p className="">Início</p>
        </Link>
        <Link to="/">
          <p className="">Sobre</p>
        </Link>
        <Link to="/login">
          <p className="">login</p>
        </Link>
        {data && <p>{data.username}</p>}
      </nav>
    </header>
  );
}
