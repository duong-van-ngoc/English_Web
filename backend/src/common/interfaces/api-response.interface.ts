export interface ApiResponse<TData> {
  success: true;
  message: string;
  data: TData;
}
