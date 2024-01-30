export const webLogs = async (req, res, info) => {
    const request = await req;
    const response = await res;

    const referer = request.headers.get("referer");

    oomph.logger.info("request/response", {
        info: info,
        request: { method: request.method, uri: request.url, referer },
        response: { status: response.status },
    });
};

export const req = (request) => {
    let { pathname, hostname, username, search, searchParams } = new URL(
        request.url,
        );

    //  determine version requested from path
    const versionParser = /\d{1,2}\.\d{1,3}\.\d{1,3}/g;

    const version = pathname.match(versionParser)
    ? pathname.match(versionParser)[0]
    : undefined;
    pathname = pathname.replace(versionParser, "").replaceAll("//", "/");

    return {
        pathname,
        version,
        hostname,
        username,
        search,
        searchParams,
    };
};


