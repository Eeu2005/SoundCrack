import { OptsDeslogar, OptsGetUser } from "@/http/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export default function Header() {
  const client = useQueryClient()
  let  { data } = useQuery(OptsGetUser);
  const {mutate} = useMutation(OptsDeslogar)
  function deslogar(): React.MouseEventHandler<HTMLButtonElement> | undefined {
      return () => {
          mutate({}, {
              onSuccess(res, _, context) {
                  console.log(context);
                  toast.success(res);
                  data = undefined;
                  client.invalidateQueries(OptsGetUser);
                  location.reload();
              },
          });
      };
  }

  
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
        {!data?(
          <Link to="/login">
          <p className="">login</p>
        </Link>
        ):<button onClick={deslogar()}>
            <p>Deslogar</p>
          </button>}
        {data&&(
          <Link to="/user">
            <p>{data.nome}</p>
          </Link>
        )}
      </nav>
    </header>
  );
}
