export default class Settings {
    // public static Host: string = "http://localhost:51171/api";
    public static Host: string = "https://envivaql.azurewebsites.net/api";
    public static CurrentUser: { Email: string, [x : string]: any } = { Email: null };

    public static Permissions: string[] = null;

    public static HasPermission() : boolean  {
        return Settings.Permissions !== null && Settings.Permissions.filter(p => p == "Permissions").length > 0;
    }
}