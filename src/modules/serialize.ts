import * as qs from "qs";
import {ParamsSerializerOptions} from "axios";


export const repeatQuerySerializer: ParamsSerializerOptions = {
    serialize: (params: Record<string, any>) => qs.stringify(params, {arrayFormat: 'repeat'})
}