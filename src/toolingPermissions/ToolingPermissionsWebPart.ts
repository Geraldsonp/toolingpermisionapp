import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';

import * as strings from 'ToolingPermissionsWebPartStrings';
import ToolingPermissions from './components/ToolingPermissions';
import { IToolingPermissionsProps } from './components/IToolingPermissionsProps';

// Generic app imports
import 'devextreme-react/text-area';
import 'devextreme-react/select-box';
import 'devextreme/dist/css/dx.common.css';
// need to remove woff2 references from this file
import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './components/css/GenericStyles.css';
import 'font-awesome/css/font-awesome.min.css';
import Settings from './components/DataGrid/AppSettings';
import { GET, SendXHR } from './components/DataGrid/XHR';

export interface IToolingPermissionsWebPartProps {
  Deployment: string;
  LocalDevelopment: boolean;
}

function GetPermissions(): Promise<string[]> {
  return SendXHR({ 
    method: "GET",
    url: location.href.substring(0, location.href.indexOf(location.pathname)) + "/_api/web/currentuser", 
    headers: {  
      "Accept": "application/json; odata=verbose"  
    }})
    .then(({ d }) => {
      Settings.CurrentUser = d;
      return d.Email;
    })
     // for dev purposes only
    .catch(() => { 
      let email = location.href.indexOf("https://localhost") == 0 ? "jay.shah@envivabiomass.com" : "unidentified_user";
      Settings.CurrentUser = { Email: email };\
      
      return email;
    })
    .then((email) => GET<string[]>(`${Settings.Host.replace("/api/", "/api/Tooling/")}/Permissions/${email}`))
    .catch(() => []);
}

export default class ToolingPermissionsWebPart extends BaseClientSideWebPart<IToolingPermissionsWebPartProps> {

  public render(): void {

    Settings.Host = ((deployment, local) => {
      let value;
      let host = local === true ? "http://localhost:51171" : "";
      return value;
    })(this.properties.Deployment, this.properties.LocalDevelopment);

    GetPermissions().then((permissions) => {
      Settings.Permissions = permissions;

      const element: React.ReactElement<IToolingPermissionsProps > = React.createElement(
        ToolingPermissions, {}
      );

      this.domElement.innerHTML = "";
      ReactDom.render(element, this.domElement);
    });
    
    var loadingIndicator = `<div>
      Loading... <i class="fa fa-spinner fa-spin fa-lg fa-fw"></i>
    </div>`;

    this.domElement.innerHTML = loadingIndicator;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    let config = {
      pages: [
        {
          header: {
            description: "Settings"
          },
          groups: [
            {
              groupName: "General",
              groupFields: [
                PropertyPaneCheckbox('LocalDevelopment', {
                  checked: false,
                  disabled: location.hostname !== "localhost" && location.href.indexOf("workbench.aspx") === -1,
                  text: "Local Development"
                }),
                PropertyPaneDropdown('Deployment', {
                  label: "Environment",
                  options: [
                    {
                      key: "Development",
                      text: "Development"
                    },
                    {
                      key: "Production",
                      text: "Production"
                    }
                  ],
                  selectedKey: "Development"
                })
              ]
            }
          ]
        }
      ]
    };

    return config;
  }
}
