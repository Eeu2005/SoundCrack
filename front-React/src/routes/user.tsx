import { OptsGetUser } from "@/http/User";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

let toastShown = false;
export const Route = createFileRoute("/user")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    const data = queryClient.fetchQuery({
      ...OptsGetUser,
      retry: false,
    });
    return data;
  },
  errorComponent: ({ error }) => {
    const location = useNavigate();
    if (!toastShown) {
      toast.error("ERROR", { description: error.message });
      toastShown = true;
    }
    location({ to: "/" });
    return <div></div>;
  },
});

function RouteComponent() {
  const user = Route.useLoaderData();
  return (
    <main className="flex items-center justify-center">
      <div className="shadow-2xl rounded-2xl shadow-Primaria bg-background p-5.5 text-Secundaria">
        <h1 className="text-3xl">
          Olá <span className="font-ribeye">{user.nome} </span>
        </h1>
        <h2 className="text-2xl">
          Você é um usuario{" "}
          {user.tipo == "padrao" ? "Padrão" : "Administrativo"}
        </h2>
      </div>
    </main>
  );
}
