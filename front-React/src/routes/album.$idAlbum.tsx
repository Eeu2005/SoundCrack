import { TabelaDeMusica } from "@/components/Table.tsx";
import { Consts } from "@/env";
import { getAlbum } from "@/http/getAlbuns.ts";
import type { AlbumType } from "@/types.js";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/album/$idAlbum")({
  component: RouteComponent,
  async loader({ context: { queryClient }, params }) {
    return queryClient.ensureQueryData({
      queryKey: ["album", params.idAlbum],
      queryFn: () => {
        return getAlbum(params.idAlbum);
      },
    });
  },
  head: (context) => ({
    meta: [{ title: `${context.loaderData?.nome}- SoundCrack` }],
  }),
  pendingComponent: () => <p>Hello</p>,
});

function Page(album: AlbumType) {
  return (
    <main
      style={{ "--corAlbum": album.corAlbum }}
      className="flex justify-center items-center flex-wrap bg-linear-0 pt-5 from-light-background to-[var(--corAlbum)] from-05%"
    >
      <div className="w-[40%]  p-[50px]">
        <img
          className="rounded-3xl"
          src={Consts.BASE_URL + album.capa}
          alt=""
        />
      </div>
      <TabelaDeMusica musicas={album.musicas} />
    </main>
  );
}

function RouteComponent() {
  const { idAlbum } = Route.useParams();
  const { data, status } = useQuery({
    queryKey: ["album", idAlbum],
    queryFn: () => {
      return getAlbum(idAlbum);
    },
  });
  const Loading = () => {
    switch (status) {
      case "success":
        return <Page {...data} />;
        break;
      case "error":
        return <p>Erro</p>;
        break;
      case "pending":
        return <p>Carregando</p>;
    }
  };
  return <Loading />;
}
