import { apiUrl } from "@/constant/model";

// 请求方法枚举
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

// 请求配置接口
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

// 响应接口
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// 请求响应接口，包含取消控制器
export interface RequestResponse<T = any> {
  response: Promise<ApiResponse<T>>;
  controller: AbortController;
  cancel: () => void;
}

// 请求错误类
export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public response?: Response;

  constructor(
    message: string,
    status: number,
    statusText: string,
    response?: Response
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

// 主要的 API 请求类
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || apiUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
    this.defaultTimeout = 10000; // 10秒超时
  }

  /**
   * 设置默认请求头
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * 设置认证 token
   */
  setAuthToken(token: string): void {
    this.setDefaultHeaders({ Authorization: `Bearer ${token}` });
  }

  /**
   * 构建完整的 URL
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    return url.toString();
  }

  /**
   * 创建 AbortController 用于超时控制
   */
  private createTimeoutController(timeout: number): AbortController {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // 如果请求在超时前完成，清除超时定时器
    const originalAbort = controller.abort.bind(controller);
    controller.abort = () => {
      clearTimeout(timeoutId);
      originalAbort();
    };

    return controller;
  }

  /**
   * 通用请求方法 - 返回 Promise
   */
  private async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const requestResponse = this.createRequest<T>(endpoint, config);
    return requestResponse.response;
  }

  /**
   * 创建请求 - 返回可取消的请求对象
   */
  public createRequest<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): RequestResponse<T> {
    const {
      method = HttpMethod.GET,
      headers = {},
      params,
      data,
      timeout = this.defaultTimeout,
    } = config;

    // 构建请求配置
    const url = this.buildURL(
      endpoint,
      method === HttpMethod.GET ? params : undefined
    );

    this.setAuthToken("auth Token");
    const controller = this.createTimeoutController(timeout);

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
    };

    // 处理请求体
    if (data && method !== HttpMethod.GET) {
      if (data instanceof FormData) {
        // FormData 自动设置 Content-Type
        delete requestHeaders["Content-Type"];
        requestConfig.body = data;
      } else if (typeof data === "object") {
        requestConfig.body = JSON.stringify(data);
      } else {
        requestConfig.body = data;
      }
    }

    // 对于非 GET 请求，将 params 添加到请求体
    if (params && method !== HttpMethod.GET && !data) {
      requestConfig.body = JSON.stringify(params);
    }

    const responsePromise = this.executeRequest<T>(
      url,
      requestConfig,
      controller
    );

    return {
      response: responsePromise,
      controller,
      cancel: () => {
        controller.abort();
      },
    };
  }

  /**
   * 执行实际的请求
   */
  private async executeRequest<T = any>(
    url: string,
    requestConfig: RequestInit,
    controller: AbortController
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, requestConfig);

      // 检查响应状态
      if (!response.ok) {
        const errorMessage = `Request failed with status ${response.status}: ${response.statusText}`;
        throw new ApiError(
          errorMessage,
          response.status,
          response.statusText,
          response
        );
      }

      // 解析响应数据
      let responseData: T;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = (await response.text()) as T;
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // 处理网络错误或超时
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError("Request timeout", 408, "Request Timeout");
        }
        throw new ApiError(error.message, 0, "Network Error");
      }

      throw new ApiError("Unknown error occurred", 0, "Unknown Error");
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    config?: Omit<RequestConfig, "method" | "params">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: HttpMethod.GET,
      params,
    });
  }

  /**
   * 可取消的 GET 请求
   */
  createGetRequest<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    config?: Omit<RequestConfig, "method" | "params">
  ): RequestResponse<T> {
    return this.createRequest<T>(endpoint, {
      ...config,
      method: HttpMethod.GET,
      params,
    });
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "data">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: HttpMethod.POST,
      data,
    });
  }

  /**
   * 可取消的 POST 请求
   */
  createPostRequest<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "data">
  ): RequestResponse<T> {
    return this.createRequest<T>(endpoint, {
      ...config,
      method: HttpMethod.POST,
      data,
    });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "data">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: HttpMethod.PUT,
      data,
    });
  }

  /**
   * 可取消的 PUT 请求
   */
  createPutRequest<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "data">
  ): RequestResponse<T> {
    return this.createRequest<T>(endpoint, {
      ...config,
      method: HttpMethod.PUT,
      data,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(
    endpoint: string,
    config?: Omit<RequestConfig, "method">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: HttpMethod.DELETE,
    });
  }

  /**
   * 可取消的 DELETE 请求
   */
  createDeleteRequest<T = any>(
    endpoint: string,
    config?: Omit<RequestConfig, "method">
  ): RequestResponse<T> {
    return this.createRequest<T>(endpoint, {
      ...config,
      method: HttpMethod.DELETE,
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "data">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: HttpMethod.PATCH,
      data,
    });
  }

  /**
   * 可取消的 PATCH 请求
   */
  createPatchRequest<T = any>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "data">
  ): RequestResponse<T> {
    return this.createRequest<T>(endpoint, {
      ...config,
      method: HttpMethod.PATCH,
      data,
    });
  }

  /**
   * 上传文件
   */
  async upload<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, String(additionalData[key]));
      });
    }

    return this.post<T>(endpoint, formData);
  }

  /**
   * 可取消的文件上传
   */
  createUploadRequest<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): RequestResponse<T> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, String(additionalData[key]));
      });
    }

    return this.createPostRequest<T>(endpoint, formData);
  }
}

// 创建默认实例
export const apiClient = new ApiClient();

// 便捷方法 - 普通请求
export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, any>) =>
    apiClient.get<T>(endpoint, params),
  post: <T = any>(endpoint: string, data?: any) =>
    apiClient.post<T>(endpoint, data),
  put: <T = any>(endpoint: string, data?: any) =>
    apiClient.put<T>(endpoint, data),
  delete: <T = any>(endpoint: string) => apiClient.delete<T>(endpoint),
  patch: <T = any>(endpoint: string, data?: any) =>
    apiClient.patch<T>(endpoint, data),
  upload: <T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ) => apiClient.upload<T>(endpoint, file, additionalData),
};

// 便捷方法 - 可取消请求
export const cancelableApi = {
  get: <T = any>(endpoint: string, params?: Record<string, any>) =>
    apiClient.createGetRequest<T>(endpoint, params),
  post: <T = any>(endpoint: string, data?: any) =>
    apiClient.createPostRequest<T>(endpoint, data),
  put: <T = any>(endpoint: string, data?: any) =>
    apiClient.createPutRequest<T>(endpoint, data),
  delete: <T = any>(endpoint: string) =>
    apiClient.createDeleteRequest<T>(endpoint),
  patch: <T = any>(endpoint: string, data?: any) =>
    apiClient.createPatchRequest<T>(endpoint, data),
  upload: <T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ) => apiClient.createUploadRequest<T>(endpoint, file, additionalData),
};

export default apiClient;
