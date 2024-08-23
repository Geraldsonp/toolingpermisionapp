import * as React from 'react';
import * as ReactDom from 'react-dom';

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
import { useEffect, useState } from 'react';

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
    }
  })
    .then(({ d }) => {
      Settings.CurrentUser = d;
      return d.Email;
    })
    // for dev purposes only
    .catch(() => {
      let email = location.href.indexOf("https://localhost") == 0 ? "jay.shah@envivabiomass.com" : "unidentified_user";
      Settings.CurrentUser = { Email: email };
      return email;
    })
    .then((email) => GET<string[]>(`${Settings.Host.replace("/api/", "/api/Tooling/")}/Permissions/${email}`))
    .catch(() => []);
}

export default function ToolingPermissionsWebPart() {
  const isProduction = import.meta.env.PROD;
  Settings.Host = isProduction ? "" : "http://localhost:51171";
  const [permissions, setPermissions] = useState<any>(null); //

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissions = await GetPermissions();
        Settings.Permissions = permissions;
        setPermissions(permissions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPermissions();
  }, []);


  return (
    <>
      {/* Render ToolingPermissions component with permissions from state */}
      {permissions && (
        <ToolingPermissions permissions={permissions} />
      )}
    </>
  )

}

