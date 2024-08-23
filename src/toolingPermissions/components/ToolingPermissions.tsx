import * as React from 'react';
import { IToolingPermissionsProps } from './IToolingPermissionsProps';
import GridView from './DataGrid/GridView';
import Settings from './DataGrid/AppSettings';

export default class ToolingPermissions extends React.Component<IToolingPermissionsProps, {}> {
  public render(): React.ReactElement<IToolingPermissionsProps> {
    if (Settings.HasPermission()) {
      return <GridView></GridView>;
    }
    else {
      return <div>You don't have permission to access this app</div>;
    }
  }
}
