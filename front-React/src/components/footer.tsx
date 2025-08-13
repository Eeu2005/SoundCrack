import type {FC} from "react";

const Footer: FC = () => {
  return (
    <footer className="mt-[5%] flex w-full justify-between items-center bg-background text-Primaria h-[14vh]">
      <h3 className="ml-[5%]">&copy; Made by EU</h3>
      <img
        src="/SoundCrack-Logo.png"
        alt="SoundCrack-Logo"
        className="animate-spin rounded-full mr-[50px] bg-corPrimaria w-[58px] object-cover"
        style={{ animationDuration: "10s", animationTimingFunction: "linear" }}
      />
    </footer>
  );
};

export default Footer;
