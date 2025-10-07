import { createFileRoute } from "@tanstack/react-router"
import { Album, CardSkeleton } from "@/components/Card.tsx";
import { optsGetAlbums } from "@/http/getAlbuns.ts";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  async loader({context:{queryClient},}) {
          queryClient.ensureQueryData(optsGetAlbums)
  },
  pendingComponent:()=>(
    <main className="flex justify-  flex-wrap  items-start">
    {Array.from({ length: 5
     }).map((_,indx)=>{
      return <CardSkeleton key={indx} />;})},
    </main>
  ),
    component:Loja,
    
})
   function Loja(){

  const{data:albuns} =  useQuery( optsGetAlbums)
  return (
    <main className="flex justify-evenly flex-wrap  items-center">
      {albuns && albuns.map(e=>{
        return (<Album key={e._id} {...e}/>)
        })}
    </main>
  );
}