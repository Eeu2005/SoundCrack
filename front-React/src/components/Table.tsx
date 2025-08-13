

interface Musica {
  nome: string;
  artistas: {nome:string}[];
}

interface TableProps {
  musicas: Musica[];
}

export const TabelaDeMusica: React.FC<TableProps> = ({ musicas }) => {
  return (
    <div className="w-[50%] overflow-x-auto rounded-lg bg-background/50  border-black border shadow-lg h-fit ">
      <table className="min-w-full divide-y divide-background
      
      ">

        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-Primaria uppercase tracking-wider border-b border-r border-black">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-Primaria uppercase tracking-wider border-b border-black">
              Artistas
            </th>
          </tr>
        </thead>
        <tbody>
          {musicas.map((musica, idx) => (
            <tr
              key={idx}
              className="hover:bg-black/80 transition-colors border-b border-black last:border-b-0"
            >
              <td className="hover:p-5 px-6 py-4 whitespace-pre-line text-Primaria">
                {musica.nome}
              </td>
              <td className="px-6 py-4 text-Primaria">
                {musica.artistas.map((e) => e.nome).join(" • ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

