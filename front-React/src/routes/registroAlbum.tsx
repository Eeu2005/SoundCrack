import { createFileRoute } from "@tanstack/react-router";
import { FileInput, NumberInput, SelectInput, TextInput } from "@/components/Inputs.tsx";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { getGeneros } from "@/http/getGeneros.ts";
import { optsSeartchArt } from "@/http/artistas.ts";
import { useRef } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Chip } from "@/components/ui/chip.tsx";
import { useMutation } from "@tanstack/react-query";
import { optsPostAlbum } from "@/http/postAlbum.ts";
export const Route = createFileRoute("/registroAlbum")({
  component: RouteComponent,
});

const schema = z.object({
  nome: z.string().min(1, "O nome do album é obrigatorio"),
  genero: z.string().min(1, "O genero é obrigatorio"),
  artistas:z.object({
    id:z.string(),
    nome:z.string(),
    imagem:z.string().url(),
  }).array().min(1,"Adicione pelo menos um artista"),
  capa: z.string(),
  disco: z.string(),
  preco: z
    .number({
      message: "O preco precisa ser um numero",
    })
    .positive("O preço precisa ser um numero positivo"),
});

function RouteComponent() {
  const datasetSchema=z.object({
    id:z.string(),
    nome:z.string(),
    imagem:z.string()
  })
  const mutation = useMutation(optsPostAlbum)
  const inputArtistaRef= useRef<HTMLInputElement>(null)
  const form = useForm({
    defaultValues: {
      nome: "",
      artistas:[{id:"",nome:"",imagem:""}],
      genero: "",
      capa: "",
      disco: "",
      preco: 0,
    },
    validators: {
      onSubmit: schema,
      onChange:schema
    },
    onSubmitInvalid:(e)=>{
      console.log(e);
      toast.error("Dados invalidos");
    },
    onSubmit:({meta:formData})=>{
      console.log("heelo");
      if(mutation.isPending) return;
      if(!(formData instanceof FormData) ) throw new Error("Erro ao enviar o formulario");
      console.log(formData);
      mutation.mutate(formData)
    }
  });
  const {Field}= form
  
  return (
    <main className=" flex justify-center items-center">
      <form action="" method="" onSubmit={(e)=>{
        if(form.getFieldValue("artistas")[0].id===""){
          form.removeFieldValue("artistas",0)
          ;
        }
        const formData = new FormData(e.currentTarget)
        e.preventDefault();
        form.handleSubmit(formData);
        // console.log("heelo")
      }} className="bg-background p-5 rounded-2xl">
        <Field
          name="nome"
          children={(field) => (
            <TextInput
              name={field.name}
              onChange={(e) => field.setValue(e.target.value)}
              label="Nome do Album"
              ErrorMap={field.state.meta.errors.map((e) => e?.message)}
            />
          )}
        />
        <Field
          name="artistas"
          mode="array"
          children={(field) => (
            <>
              <div className="flex gap-2">
                <SelectInput
                  ref={inputArtistaRef}
                  option={(artista, input) => (
                    <div className="absolute  z-50  w-full backdrop-blur-3xl  border-Secundaria border-2 text-black">
                      {artista.map((e) => (
                        <div
                          key={e._id}
                          onClick={() => {
                            input.dataset.nome = e.nome;
                            input.value=e.nome
                            input.dataset.id = e._id;
                            input.dataset.imagem= e.imagem

                          }}
                          className="flex bg-white hover:translate-x-4  transition justify-between border-b rounded-md border-Primaria "
                        >
                          <p className=" self-center  p-2">{e.nome}</p>
                          <img
                            className="size-10 self-center rounded-md"
                            src={e.imagem}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  filter={(data, campo) =>
                    data.filter((e) => e.nome.toLowerCase().startsWith(campo))
                  }
                  ErrorMap={field.state.meta.errors.map((err) => err?.message)}
                  label="Escolha os artistas"
                  optsUseData={optsSeartchArt(
                    inputArtistaRef.current?.value ?? ""
                  )}
                />
                <button
                  type="button"
                  onClick={() => {
                    const { current: input } = inputArtistaRef;
                    const {data,success} = datasetSchema.safeParse(input?.dataset);
                    if(!success||!data ||!input){
                      toast.error("Erro ao adicionar artista")
                      return;
                    }
                    if(field.state.value.find(e=>e.id===input.dataset.id)){
                      toast.error("Artista ja adicionado")
                      delete input.dataset.id;
                      input.value = "";
                      throw new Error("Artista ja adicionado")
                    }
                    field.pushValue(data);
                    input.value = "";
                    delete input.dataset.id;
                  }}
                  className="h-fit p-2 hover:scale-125 transition rounded-md self-end bg-Primaria cursor-pointer"
                >
                  <Plus className="" />
                </button>
              </div>
              <div className="flex flex-wrap ">{field.state.value.map(({id,nome,imagem})=>{
                if(id==="") return null;
                return <Chip key={id} 
                image={imagem}
                label={nome} 
                value={id}
                name="artistas"
                 onClick={()=>field.removeValue(field.state.value.findIndex(e=>e.id==id))} />
              })}</div>
            </>
          )}
        />

        <Field
          name="capa"
          children={(field) => (
            <FileInput
              name={field.name}
              onChange={(e) => field.setValue(e.target.value)}
              label="insira a foto do album"
              ErrorMap={field.state.meta.errors.map((e) => e?.message)}
            />
          )}
        />
        <Field
          name="disco"
          children={(field) => (
            <FileInput
              name={field.name}
              onChange={(e) => field.setValue(e.target.value)}
              label="Insira a foto do disco"
              ErrorMap={field.state.meta.errors.map((e) => e?.message)}
            />
          )}
        />
        <Field
          name="genero"
          children={(field) => (
            <SelectInput
              filter={(gen, value) =>
                gen.filter((e) => e.toLowerCase().startsWith(value))
              }
              option={(data, input) => {
                return (
                  <div className="absolute  z-50 bg-white w-full border-Secundaria border-2 text-black">
                    {data.map((gen, inx) => (
                      <p
                        className="border-gray-600 border-b p-1.5 hover:border-2 hover:border-Secundaria  "
                        onClick={() => {
                          input.value = gen
                           field.setValue(gen)
                        }}
                        key={inx}
                      >
                        {gen}
                      </p>
                    ))}
                  </div>
                );
              }}
              optsUseData={{ queryKey: ["generos"], queryFn: getGeneros }}
              name={field.name}
              onChange={(e) => field.setValue(e.target.value)}
              label="Genero"
              ErrorMap={field.state.meta.errors.map((e) => e?.message)}
            />
          )}
        />
        <Field
          name="preco"
          children={(field) => (
            <NumberInput
              name={field.name}
              onChange={(e) => field.setValue(e.target.valueAsNumber)}
              label="Preco"
              ErrorMap={field.state.meta.errors.map((e) => e?.message)}
            />
          )}
        />
        <input type="submit" className="p-1 self-center bg-Secundaria text-black" value={"enviar"}/> 
      </form>
    </main>
  );
}
