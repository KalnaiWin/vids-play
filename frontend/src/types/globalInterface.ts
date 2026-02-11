export interface GlobalState {
  statusNavBar: boolean;
  statusSearch: boolean;
  statusNavBarReponsive: boolean;
  statusAuth: "idle" | "login" | "register"
}
