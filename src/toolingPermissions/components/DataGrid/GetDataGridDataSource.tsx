import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { SendXHR, PUT, POST, DELETE, GET } from './XHR';
import Promisify from './Promisify';
import IPermissionModel from './PermissionModel';
import Settings from './AppSettings';

let path: string = "/ToolingPermissions";
let currentData: IPermissionModel[] = [];

export function GetUrl(route: string) {
    route = !route ? "" : (route[0] == "/" ? route : "/" + route);
    return `${Settings.Host}${path}${route}`;
}

export function GetCurrentData() {
    return currentData;
}

export default function GetDataGridDataSource(): DataSource {
    let dataSource = new DataSource(new CustomStore({
        load: async () => {
            try {
                const data = await GetAllRowsFromDataSource();
                currentData.splice(0, currentData.length);
                currentData.push.apply(currentData, data);
                return currentData;
            }
            catch (error) {
                return console.error(error);
            }
        },
        insert: async (newRow: IPermissionModel) => {
            const row = await InsertRowInDataSource(newRow);
            currentData.push(row);
            return row;
        },
        update: async (oldRow: IPermissionModel, newRow: IPermissionModel) => {
            let updatedRow = DeepMerge({}, currentData.filter(v => v.id == oldRow.id)[0], newRow);
            const row = await UpdateRowInDataSource(updatedRow);
            // return row;
        },
        remove: async (row: IPermissionModel) => {
            const id = await DeleteRowFromDataSource({ id: row.id });
            let index = currentData.indexOf(row);
            currentData.splice(index, 1);
        }
    }));

    dataSource["rawData"] = currentData;

    return dataSource;
}

export async function GetAllRowsFromDataSource() : Promise<IPermissionModel[]> {
    let url = GetUrl(undefined);
    const data = await GET<IPermissionModel[]>(url);
    return data;
}

export async function GetRowFromDataSource({ id } : { id?: string }) : Promise<IPermissionModel> {
    let url = GetUrl(undefined);
    const data = await GET<IPermissionModel>(url, { id: id });
    return data;
}

export async function InsertRowInDataSource(item: IPermissionModel) : Promise<IPermissionModel> {
    let url = GetUrl(undefined);
    const data = await PUT<IPermissionModel>(url, item);
    return data;
}

export async function UpdateRowInDataSource(item: IPermissionModel) : Promise<IPermissionModel> {
    let url = GetUrl(undefined);
    const data = await POST<IPermissionModel>(url, item);
    return data;
}

export async function DeleteRowFromDataSource({ id }: { id: string }) : Promise<string> {
    let url = GetUrl("/Delete");
    const data = await POST<string>(url, { id: id });
    return data;
}

export function DeepMerge(...args) {
    let final = [...args].reduce((base, top) => _DeepMerge(base, top));
    return final;

    function _DeepMerge(base, top) {

        if (typeof top === undefined) {
            return base;
        } else if (typeof top !== typeof base) {
            return top;
        } else if (typeof top !== "object") {
            return top;
        } else if (top.constructor !== Object) {
            return top;
        } else {
            let final = Object["assign"]({}, base);
            for (let key in top)
                final[key] = DeepMerge(final[key], top[key]);
            return final;
        }

    }
}