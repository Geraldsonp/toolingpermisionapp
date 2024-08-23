export default class Settings {
    public static Host: string = "https://envivaql.azurewebsites.net/api";
    public static CurrentUser: { Email: string | null, [x: string]: any } = { Email: null };
    public static Permissions: string[] | null = null;

    public static HasPermission = (): boolean => {
        return Settings.Permissions !== null && Settings.Permissions.includes("Permissions");
    }
}