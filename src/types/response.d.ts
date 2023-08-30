declare namespace Response {
  type Format<D = unknown> = {
    error: boolean;
    statusCode: number;
    message: string[];
    data: D;
  };

  type List<D = unknown> = {
    data: D[];
    meta: {
      itemsPerPage: number;
      totalItems: number;
      currentPage: number;
      totalPages: number;
      sortBy: [string, string][];
      search: string;
    };
    links: {
      current: string;
      last: string;
    };
  };
}
