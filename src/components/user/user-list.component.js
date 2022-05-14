import UserService from "../../services/user.service";
import EventBus from "../../common/EventBus";
import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { confirmDialog } from 'primereact/confirmdialog';



const UserList = (props) => {
  const [users, setUsers] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [userDialog, setUserDialog] = useState(null);
  const [user, setUser] = useState(null);
  const [dt, setDt] = useState(null);
  const usersRef = useRef();

  usersRef.current = users;

  const emptyUser = {
    username: '',
    fullName: '',
    password: '',
  };

  useEffect(() => {
    retrieveUsers();
  }, []);

  const retrieveUsers = () => {
    setShowLoader(true);
    UserService.getAll()
      .then((response) => {
        setUsers(response.data);
        setShowLoader(false);
      })
      .catch((e) => {
        console.log(e);
        setShowLoader(false);
        EventBus.dispatch("logout");
      });
  };

  const refreshList = () => {
    retrieveUsers();
  };

  const hideDialog = () => {
    setUserDialog(false);
  }

  const editUser = (user) => {
    setUser(user);
    setUserDialog(true);
  }


  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let drv = { ...user };
    drv[`${name}`] = val;
    setUser(drv);
  }


  const deleteUser = (user) => {
    UserService.delete(user.id)
      .then((response) => {
        // props.history.push("/users/");
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };



  const saveUser = () => {

    if (user.id > 0) {
      UserService.update(user.id, user)
        .then(response => {
          refreshList();
          console.log(response.data);
          //setMessage("The user was updated successfully!");
        })
        .catch(e => {
          console.log(e);
        });
    }

    else {


      var data = {
        username: user.username,
        fullName: user.fullName,
        password: user.password
      };


      UserService.create(data)
        .then(response => {
          refreshList();
          setUser({
            username: response.data.username,
            fullName: response.data.fullName,
            password: response.data.password
          });

          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

    hideDialog();
  };


  const exportCSV = () => {
    dt.exportCSV();
  }

  const openNew = () => {
    setUser(emptyUser);
    setUserDialog(true);
  }

  let header = (
    <div style={{ 'textAlign': 'left' }}>
      <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
      <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" size="50" />
    </div>
  );


  const userDialogFooter = () => {
    return (

      <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
      </React.Fragment>

    );
  }


  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUser(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirm(rowData)} />
      </React.Fragment>
    );
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
      </React.Fragment>
    )
  }


  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
      </React.Fragment>
    )
  }

  const usernameTemplate = (rowData) => {
    return <span>{rowData.username}</span>;
  }

  const fullNameTemplate = (rowData) => {
    return <span>{rowData.fullName}</span>;
  }

  

  const rejectFunc = () => {
    return props.history.push("/user-list/");
  }

  const confirm = (data) => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteUser(data),
      reject: () => rejectFunc()
    });
  }


  return (
    <div>

      <div className="centered-spinner">
        {showLoader && <Spinner animation="border" variant="primary" />}
      </div>

      <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

      <DataTable className="mb-4" ref={(el) => { setDt(el) }} value={users} dataKey="id" responsiveLayout="scroll" selectionMode="single" selection={selectedUser}
        onSelectionChange={e => setSelectedUser(e.value)} header={header} globalFilter={globalFilter}>

        <Column header="Username" body={usernameTemplate}></Column>
        <Column header="FullName" body={fullNameTemplate}></Column>
        <Column body={actionBodyTemplate} exportable={true} style={{ minWidth: '2rem' }}></Column>
      </DataTable>

      <Dialog visible={userDialog} style={{ width: '1000px' }} header="User Details" footer={userDialogFooter} modal className="p-fluid" onHide={hideDialog}>
        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="username">username</label>
            {user && <InputText id="username" value={user.username} onChange={(e) => onInputChange(e, 'username')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="fullName">fullName</label>
            {user && <InputText id="fullName" value={user.fullName} onChange={(e) => onInputChange(e, 'fullName')} required/>}
          </div>
          <div className="form-group col">
            <label htmlFor="password">Password</label>
            {user && <InputText id="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} required/>}
          </div>
        </div>
      </Dialog>

    </div>
  );
};

export default UserList;
