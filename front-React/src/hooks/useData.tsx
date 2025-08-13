import type { UseQueryResult } from "@tanstack/react-query";
import type { JSX  } from "react";


export function useData<T>( data: UseQueryResult<T>,
    fetchingElement: JSX.Element,
    ErrorElement: JSX.Element,
    dataElement: JSX.Element) {
 
    switch (data.status) {
      case "error":
        return <ErrorElement />;
      case "success":
        return dataElement;
      case "pending":
        return fetchingElement;
    }
  };

