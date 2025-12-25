export interface Store {
  get(request: Request): Promise<Response | undefined>;
  getEntry(request: Request): Promise<[origin: Request, Response] | undefined>;
  delete(request: Request): Promise<void>;
  put(request: Request, response: Response): Promise<void>;
}
