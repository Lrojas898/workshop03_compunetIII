/**
 * THEME PROVIDER
 *
 * Provider para tema (dark/light mode).
 * Opcional: permite cambiar entre tema claro y oscuro.
 */

'use client'

// TODO: Implementar provider de tema (puede usar next-themes)
// import { ThemeProvider as NextThemesProvider } from 'next-themes'

// export function ThemeCustomizationProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <NextThemesProvider
//       attribute="class"
//       defaultTheme="system"
//       enableSystem
//       disableTransitionOnChange
//     >
//       {children}
//     </NextThemesProvider>
//   )
// }

export function ThemeCustomizationProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
