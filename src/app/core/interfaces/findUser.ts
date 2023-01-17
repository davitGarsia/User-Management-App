export interface FindUser {
  search: string;
  sortBy: string;
  sortDirection: string;
  pageIndex: number;
  pageSize: number;
  includes: string[];
  excludes: string[];
}
