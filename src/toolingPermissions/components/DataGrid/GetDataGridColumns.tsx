import { Column } from 'devextreme-react/data-grid';

export function GetReactDataGridColumns(): any[] {
    return GetDataGridColumns().map(settings => <Column {...settings}></Column>);
}

export function GetDataGridColumns(): any[] {
    const fields = GetViewFields();
    return fields;
}

function GetViewFields(): any[] {
    return [
        {
            caption: "Id",
            dataField: "id",
            visible: false,
            allowEditing: false
        },
        {
            caption: "Plant",
            dataField: "plant",
            visible: true,
            allowEditing: true,
            lookup: {
                dataSource: ["Ahoskie", "Hamlet", "Northampton", "Richmond", "Sampson", "Southampton", "Lucedale"]
            }
        },
        {
            caption: "User",
            dataField: "user",
            visible: true,
            allowEditing: true
        },
        {
            caption: "Role",
            dataField: "role",
            visible: true,
            allowEditing: true,
            lookup: {
                dataSource: [/*"Viewer", */"Standard User", "Plant Admin", "Super Admin", "Permissions Admin"]
            }
        }
    ];
}