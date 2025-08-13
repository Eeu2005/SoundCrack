import { Link } from '@tanstack/react-router'

export default function Header() {
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
        <Link to="/cadastro">
          <p className="">
            Cadastro
          </p>
        </Link>
      </nav>
    </header>
  );
}
