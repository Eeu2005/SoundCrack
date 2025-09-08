import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Consts } from "@/env";

import z from "zod";
import { PassWordInput, TextInput } from "@/components/Inputs.tsx";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { register } from "@/http/register.ts";
export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

const schema = z.object({
  email: z.string().email("Isso não se parece com um email"),
  nome: z.string().min(4, "Vamos la você consegue ser mais criativo"),
  senha: z.string().min(5, "A senha deve conter pelo menos 5 caracteres"),
});

function RouteComponent() {
  const nav = useNavigate({ from: Route.fullPath });
  const client = useQueryClient();
  const { data, mutateAsync } = useMutation({
    mutationKey: ["login"],
    mutationFn: register,
  });
  const form = useForm({
    defaultValues: { nome: "", email: "", senha: "" },

    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
      client.invalidateQueries({ queryKey: ["user"] });
      nav({ to: "/" });
    },
  });
  return (
    <main className="flex items-center-safe flex-col gap-7 justify-between ">
      <h1 className="text-4xl text-Primaria ">
        Registra-se no <span className="font-ribeye">SoundCrack</span>
      </h1>
      <form
        encType="multpart/form-data"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        action=""
        className="bg-background flex flex-col gap-1.5 p-5"
      >
        <form.Field
          name="nome"
          children={(field) => (
            <TextInput
              name={field.name}
              onChange={(e) => field.setValue(e.target.value)}
              label="Insira um apelido"
              ErrorMap={field.state.meta.errors.map((err) => err?.message)}
            />
          )}
        />
        <form.Field
          name="email"
          children={(field) => (
            <TextInput
              name={field.name}
              label="Insira o seu email"
              onChange={(e) => field.setValue(e.target.value)}
              ErrorMap={field.state.meta.errors.map((err) => err?.message)}
            />
          )}
        />
        <form.Field
          name="senha"
          children={(field) => (
            <PassWordInput
              name={field.name}
              onChange={(e) => field.setValue(e.target.value)}
              label="Crie uma senha"
              ErrorMap={field.state.meta.errors.map((err) => err?.message)}
            />
          )}
        />
        <input
          className="bg-Primaria rounded-4xl  text-black hover:bg-black  hover:text-Secundaria"
          type="submit"
          value="Enviar"
        />
      </form>
    </main>
  );
}
