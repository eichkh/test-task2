import ExtendedRequest from "../interfaces/extended-request.interface";

export default function parseUrlParams(
    req: ExtendedRequest,
    _: any,
    next: any
) {
    const reqUrl = req.url?.split("/");

    if (reqUrl) {
        for (let i = 1; i < reqUrl.length; i += 2) {
            req[reqUrl[i].substring(0, reqUrl[i].length - 1) + "Id"] =
                reqUrl[i + 1];

            if (reqUrl[i + 1]) reqUrl[i + 1] = ":id";
        }

        req.urlToProcess = reqUrl.join("/");
    }

    next();
}
