import { redirect } from "next/dist/next-server/server/api-utils";
import { useRouter } from "next/router";
import useFetch from "./useFetch";

function useErrorGuardedFetch<ResultData = unknown>(...args) {
    const result = useFetch<ResultData>(...args);
    const router = useRouter()

    if (result.status === "error" && result.error.status === 401) {
        router.push("/login");
    }

    return result;
}

export default useErrorGuardedFetch;