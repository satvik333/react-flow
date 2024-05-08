import { getClientBasedConfig } from "app/store/constants"
import useClientKey from "./useClientKey"

function useClientBasedConfig(config) {
    const clientKey = useClientKey()

    return getClientBasedConfig(clientKey, config)
}

export default useClientBasedConfig
