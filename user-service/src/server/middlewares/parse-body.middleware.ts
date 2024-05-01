import ExtendedRequest from "../interfaces/extended-request.interface";

export default function parseBody(req: ExtendedRequest, _: any, next: any) {
    let data = "";

    req.on("data", (chunk) => {
        data += chunk;
    });

    req.on("end", () => {
        if (data) {
            req.body = JSON.parse(data);
        }

        next();
    });
}
