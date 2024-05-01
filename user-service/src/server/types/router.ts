import HttpMethods from "../enums/http-methods.enum";
import { Handler } from "../interfaces/handler.interface";

type Route = {
    [key in HttpMethods]: {
        [path: string]: Handler;
    };
};

export default Route;
