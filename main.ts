interface Curl {
  path: string;
  url: string;
  method?: string;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const main = () => {
  const args = process.argv.slice(2);
  const [jsonCurl] = args;

  if (!jsonCurl) {
    console.error("There is no json to convert");
    return;
  }

  let parsedJsonCurl: Curl;
  try {
    parsedJsonCurl = JSON.parse(jsonCurl);
  } catch (error) {
    console.error("Invalid JSON input. Make sure it's properly escaped.");
    console.error(error);
    return;
  }

  const path = parsedJsonCurl.path;
  const url = parsedJsonCurl.url;

  if (!path || !url) {
    console.error("The curl must need path and url");
    return;
  }

  let method = parsedJsonCurl.method || "GET";
  const headers = parsedJsonCurl.headers || {};
  const body = parsedJsonCurl.body;

  if (body && method === "GET") {
    method = "POST";
  }

  if (body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const parsedHeaders = Object.keys(headers)
    .map((key) => {
      return `  --header '${key}: ${headers[key]}' \\`;
    })
    .join("\n");

  const parsedBody = body ? `  --data '${JSON.stringify(body, null, 2)}'` : "";

  const curl = `curl --request ${method} \\
  --url '${url}${path}' \\
${parsedHeaders}
${parsedBody}`;

  console.log(curl);
};

main();
