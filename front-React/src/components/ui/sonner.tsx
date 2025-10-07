import { AlertCircle, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={`dark toaster group shadow-toast ${props.className} `}
      toastOptions={{
        style: {
          boxShadow: "5px 4px 1.4px rgba(223, 146, 0, 0.28)",
          background:"var(--background)",
          gap:"20px"
        },
      }}
      icons={{
        success: <Check className="text-Secundaria mr-3" />,
        error: <AlertCircle className="text-Secundaria mr-3" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster }
