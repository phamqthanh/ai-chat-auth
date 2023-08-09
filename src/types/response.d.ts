declare namespace Response {
  type Format<D = unknown> = {
    error: boolean;
    statusCode: number;
    message: string[];
    data: D;
  };
}
