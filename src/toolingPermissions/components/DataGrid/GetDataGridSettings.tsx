import GetDataGridDataSource from './GetDataGridDataSource';

import dxDataGrid from 'devextreme/ui/data_grid';
import { dxButtonOptions } from 'devextreme/ui/button';

export interface IButtonOptions extends dxButtonOptions, INavigationItem {}
export interface IDropDownButtonOptions extends dxButtonOptions, INavigationItem {}

export interface INavigationItem {
    itemType: "dxButton" | "dxDropDownButton"
}

export interface IDataGridSettingsAdditionalOpts {
    navButtons?: (IButtonOptions | IDropDownButtonOptions)[];
}

export default function GetDataGridSettings({ navButtons }: IDataGridSettingsAdditionalOpts): any {
    let excelExportData: any = null;
    let gridComponent: dxDataGrid | null = null;

    let opts: any = {
        GetComponent: () => gridComponent,
        dataSource: GetDataGridDataSource(),
        export: {
            enabled: true,
            fileName: "ToolingPermissions"
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        editing: {
            mode: "row",
            allowDeleting: true,
            allowUpdating: true,
            allowAdding: true,
            useIcons: true
        },
        onEditingStart: (e) => {
            //e.cancel = !Settings.HasPermission(`Presses.Edit.${e.data.plant}`);
        },
        headerFilter: {
            allowSearch: true,
            visible: true
        },
        groupPanel: {
            visible: true
        },
        grouping: { 
            autoExpandAll: false
        },
        filterRow: {
            visible: true
        },
        searchPanel: {
            visible: true
        },
        paging: {
            enabled: true,
            pageSize: 10
        },
        columnChooser: {
            allowSearch: true,
            enabled: true,
            mode: "dragAndDrop"
        },
        /**
         * onToolbarPreparing(...) allows us to add custom function buttons
         */
        onToolbarPreparing: (e) => {
            let toolbarItems = e.toolbarOptions.items;

            (navButtons = navButtons || []).unshift({
                itemType: "dxButton",
                icon: "refresh",
                hint: "Refresh list data",
                onClick: () => { gridComponent.refresh(); }
            });

            if (navButtons) {
                for (let i = 0; i < navButtons.length; i++) {
                    let button = navButtons[i];
                    toolbarItems.unshift({
                        location: "after",
                        widget: button.itemType,
                        options: button
                    });
                }
            }
        },
        onInitialized: ({ component, element }) => {
            gridComponent = component;
        },
        /**
         * Out-of-the-box exporting breaks inside of a normal sharepoint page, so we utilize onExporting(...) to implement custom functionality
         */
        onExporting: (e) => {
            // store this event object for use in onExported(...). It contains the cancelation flag to prevent default functionality, as well as the excel blob file we want to download
            excelExportData = e;
        },
        /**
         * Out-of-the-box exporting breaks inside of a normal sharepoint page, so we utilize onExported(...) to implement custom functionality
         */
        onExported: () => {
            // The incoming parameter in this object is not the same as the one coming from onExporting(...)
            let e = excelExportData;
            excelExportData = null;
            e.cancel = true;

            // Blob data is not appended to the export data until after method completion, so we set a timeout to run it asynchorously
            setTimeout(() => {
                // Create the download url from blob data, generate and click a temporary element, then clear the data from memory
                let url = window.URL.createObjectURL(e.data);
                $(`<a href="${url}" download="${e.fileName}">BUTTON</a>`).get(0).click();
                window.URL.revokeObjectURL(url);
            });
        },
        onRowDblClick: ({ rowIndex, component }) => {
            component.editRow(rowIndex);
        }
    };

    return opts;
}