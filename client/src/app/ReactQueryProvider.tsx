"use client"

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactNode } from 'react';
import {useState} from 'react';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'


export default function ReactQueryProvider ({children}: {children: ReactNode}){
    const [queryClient] = useState(()=> new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 10000
            }
        }
    }))
    return (<QueryClientProvider client={queryClient}>
        {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
        {children}
    </QueryClientProvider>)
}