export interface GlobalState {
  search: string;
  statusNavBar: boolean;
  statusSearch: boolean;
  statusNavBarReponsive: boolean;
  statusAuth: "idle" | "login" | "register"
}
