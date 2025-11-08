/**
 * REACT QUERY PROVIDER
 *
 * Provider de React Query (TanStack Query) para toda la aplicación.
 * Envuelve la app y proporciona el QueryClient.
 */

'use client'

// TODO: Implementar provider de React Query
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { useState } from 'react'

// export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 1000 * 60 * 5, // 5 minutes
//             retry: 1,
//             refetchOnWindowFocus: false,
//           },
//         },
//       })
//   )

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//       <ReactQueryDevtools initialIsOpen={false} />
//     </QueryClientProvider>
//   )
// }

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
