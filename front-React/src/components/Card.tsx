// import { getColor } from "@/integrations/colorThief.ts";
import type { AlbumType } from "@/types.d.ts";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "./ui/skeleton.tsx";

export  function Album(album: AlbumType) {
  return (
    <div
      style={{ "--corAlbum": `${album.corAlbum}` }}
      className="mt-8 p-2.5 text-white flex flex-col justify-center items-center w-[310px] rounded-2xl bg-gradient-to-t from-background to-[var(--corAlbum)] shadow-[0_1px_2px_4px_rgba(0,0,0,0.16)] transition-all duration-2000"
    >
      <img
        src={album.capa}
        alt={album.nome}
        crossOrigin="anonymous"
        className="shadow-[0_0_20px_0_var(--corAlbum)] w-[70%]"
      />
      <h1 className="font-medium  text-2xl my-1.5">{album.nome}</h1>
      <h2 className="font-medium my-1.5">
        Artistas: {album.artistas.map((e) => e.nome).join(" - ")}
      </h2>
      <p className="font-medium my-1.5">
        Preço:
        {album.preco.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
      <Link
        viewTransition={{ types: ["slide-right"] }}
        to="/album/$idAlbum"
        params={{ idAlbum: album._id }}
        className="rounded-full font-extrabold text-center text-background bg-Primaria w-[70%] h-[calc(10%+5px)] shadow-md mb-5 hover:text-Primaria hover:bg-background transition-colors"
      >
        Saiba Mais
      </Link>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className=" self-start justify-self-start bg-gradient-to-t from-background to-Primaria shadow-[0_1px_2px_4px_rgba(0,0,0,0.16)] flex flex-col gap-0.5 justify-evenly items-center bg-background e h-[385px] w-[310px]">
      <Skeleton className="w-[78%]  h-[204px]" />
      <Skeleton className="w-[40%] h-[20px]" />
      <Skeleton className="w-[40%] h-[20px]" />
      <Skeleton className="w-[40%] h-[20px]" />
    </div>
  );
}
