import { Price } from "@/types";
import axios, { AxiosError } from "axios";

export const getUrl = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";

  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

  return url;
};

type DataType = { price: Price };
export const postData = async ({
  url,
  data,
}: {
  url: string;
  data?: DataType;
}) => {
  try {
    const response: Response = await fetch(url, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`{
      statusCode: ${response.status},
      message: ${response.statusText},
    }`);
    }

    return response.json();
  } catch (error: any) {
    console.log(error.response.data);
  }
};

export const toDateTime = (secs: number) => {
  const time = new Date("1970-01-01T00:30:00Z");
  time.setSeconds(secs);

  return time;
};
