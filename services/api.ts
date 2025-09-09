import { APIRequest, APIResponse } from "./api.type";
import { Annotate } from "./api.type";
export async function sendMessageToBackground(message: APIRequest<any>) {
  try {
    console.log("Sending message to background:", message);
    const response = await browser.runtime.sendMessage(message);
    console.log("Received response from background:", response);
    return response;
  } catch (error) {
    console.error("Error sending message to background:", error);
    throw error;
  }
}

export async function addAnnotate(
  annotate: Annotate
): Promise<APIResponse<Annotate>> {
  const request: APIRequest<Annotate> = {
    basicType: "annotate",
    messageType: "addAnnotate",
    params: annotate,
  };
  return sendMessageToBackground(request);
}

export async function getAnnotations(
  path: string
): Promise<APIResponse<Annotate[]>> {
  const request: APIRequest<{ path: string }> = {
    basicType: "annotate",
    messageType: "getAnnotations",
    params: { path },
  };
  return sendMessageToBackground(request);
}

export async function updateAnnotate(
  uid: string,
  data: Partial<Annotate>
): Promise<APIResponse<Annotate>> {
  const request: APIRequest<{ uid: string; data: Partial<Annotate> }> = {
    basicType: "annotate",
    messageType: "updateAnnotate",
    params: { uid, data },
  };
  return sendMessageToBackground(request);
}

export async function deleteAnnotate(
  uid: string
): Promise<APIResponse<string>> {
  const request: APIRequest<string> = {
    basicType: "annotate",
    messageType: "deleteAnnotate",
    params: uid,
  };
  return sendMessageToBackground(request);
}
