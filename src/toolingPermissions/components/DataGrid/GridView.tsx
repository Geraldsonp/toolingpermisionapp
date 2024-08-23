import * as React from 'react';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import GetDataGridSettings from './GetDataGridSettings';
import { GetReactDataGridColumns, } from './GetDataGridColumns';
import dxDatagGrid from 'devextreme/ui/data_grid';
import * as $ from 'jquery';
import 'jquery-validation/dist/jquery.validate.min.js';
import bootbox from 'bootbox';
import { SendXHR } from './XHR';
import Settings from './AppSettings';

export default class GridView extends React.Component<any, {}> {

  private DxDataGrid: dxDatagGrid = null;
  public state: any = {
    dataGridSettings: GetDataGridSettings({})
  };

  private excelExportData: any = null;
  private historySettings: any = {
    dataSource: new DataSource(new CustomStore({
      load: () => {
        return SendXHR({ url: `${Settings.Host}/ToolingPermissions/History`, method: "GET" });
      },
      insert: (v) => { return null; },
      update: (v) => { return null; },
      remove: (v) => { return null; }
  })),
    export: {
      enabled: true,
      fileName: "PermissionHistory"
    },
    /**
         * Out-of-the-box exporting breaks inside of a normal sharepoint page, so we utilize onExporting(...) to implement custom functionality
         */
        onExporting: (e) => {
          // store this event object for use in onExported(...). It contains the cancelation flag to prevent default functionality, as well as the excel blob file we want to download
          this.excelExportData = e;
      },
      /**
       * Out-of-the-box exporting breaks inside of a normal sharepoint page, so we utilize onExported(...) to implement custom functionality
       */
      onExported: () => {
          // The incoming parameter in this object is not the same as the one coming from onExporting(...)
          let e = this.excelExportData;
          this.excelExportData = null;
          e.cancel = true;

          // Blob data is not appended to the export data until after method completion, so we set a timeout to run it asynchorously
          setTimeout(() => {
              // Create the download url from blob data, generate and click a temporary element, then clear the data from memory
              let url = window.URL.createObjectURL(e.data);
              $(`<a href="${url}" download="${e.fileName}">BUTTON</a>`).get(0).click();
              window.URL.revokeObjectURL(url);
          });
      },
    allowColumnReordering: true,
    allowColumnResizing: true,
    editing: {
        mode: "form",
        texts: {
          editRow: "View",
          saveRowChanges: "OK",
          cancelRowChanges: "Close"
        },
        allowDeleting: false,
        allowUpdating: true,
        allowAdding: false
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
    columns: [
      {
        dataField: "id",
        allowEditing: false
      },
      {
        dataField: "action",
        allowEditing: false
      },
      {
        dataField: "userName",
        allowEditing: false
      },
      {
        dataField: "modifiedBy",
        allowEditing: false
      },
      {
        dataField: "modified",
        allowEditing: false
      },
      {
        dataField: "notesJson",
        allowEditing: false,
        calculateCellValue: function({ notesJson }) {
          return JSON.stringify(JSON.parse(notesJson), null, 2);
        }
      }
    ]
};
  
  public render(): React.ReactElement<any> {
    let props = this.state.dataGridSettings;

    if (this.state.showHistory !== true) {
      return (
          <div>
            <DataGrid {...props}>
              {GetReactDataGridColumns()}
            </DataGrid>
            <a href="javascript:void(0)" onClick={() => this.setState({ showHistory: true })}>History</a>
        </div>
      );
    }
    else {
      return (
        <div>
          <a href="javascript:void(0)" onClick={() => this.setState({ showHistory: false })}>Back</a>
          <DataGrid {...this.historySettings}></DataGrid>
      </div>
    );
    }
  }
}
