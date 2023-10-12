type ApiResponse<T> =
  | { status: "success"; data: T; timestamp: Date }
  | { status: "error"; message: string; timestamp: Date };

const response1: ApiResponse<number> = {
  status: "success",
  data: 100,
  timestamp: new Date(),
};

const response2: ApiResponse<number> = {
  status: "error",
  message: "There was an error",
  timestamp: new Date(),
};
