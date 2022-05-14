import OwnerService from "../../services/owner.service";
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



const OwnerList = (props) => {
  const [owners, setOwners] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [ownerDialog, setOwnerDialog] = useState(null);
  const [owner, setOwner] = useState(null);
  const [dt, setDt] = useState(null);
  const ownersRef = useRef();

  ownersRef.current = owners;

  const emptyOwner = {
    ownerId: '',
    ownerName: '',
    companyName: '',
    address: '',
    phoneNumber: '',
    homePhone: '',
    emergencyPhone: '',
    email: '',
    vechileId: ''
  };

  useEffect(() => {
    retrieveOwners();
  }, []);

  const retrieveOwners = () => {
    setShowLoader(true);
    OwnerService.getAll()
      .then((response) => {
        setOwners(response.data);
        setShowLoader(false);
      })
      .catch((e) => {
        console.log(e);
        setShowLoader(false);
        EventBus.dispatch("logout");
      });
  };

  const refreshList = () => {
    retrieveOwners();
  };

  const hideDialog = () => {
    setOwnerDialog(false);
  }

  const editOwner = (owner) => {
    setOwner(owner);
    setOwnerDialog(true);
  }


  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let drv = { ...owner };
    drv[`${name}`] = val;
    setOwner(drv);
  }


  const deleteOwner = (owner) => {
    OwnerService.delete(owner.id)
      .then((response) => {
        // props.history.push("/owners/");
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };



  const saveOwner = () => {

    if (owner.id > 0) {
      OwnerService.update(owner.id, owner)
        .then(response => {
          refreshList();
          console.log(response.data);
          //setMessage("The owner was updated successfully!");
        })
        .catch(e => {
          console.log(e);
        });
    }

    else {


      var data = {
        ownerId: owner.ownerId,
        ownerName: owner.ownerName,
        companyName: owner.companyName,
        address: owner.address,
        phoneNumber: owner.phoneNumber,
        homePhone: owner.homePhone,
        emergencyPhone: owner.emergencyPhone,
        email: owner.email,
        vechileId: owner.vechileId
      };


      OwnerService.create(data)
        .then(response => {
          refreshList();
          setOwner({
            ownerId: response.data.ownerId,
            ownerName: response.data.ownerName,
            companyName: response.data.companyName,
            address: response.data.address,
            phoneNumber: response.data.phoneNumber,
            homePhone: response.data.homePhone,
            emergencyPhone: response.data.emergencyPhone,
            email: response.data.email,
            vechileId: response.data.vechileId
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
    setOwner(emptyOwner);
    setOwnerDialog(true);
  }

  let header = (
    <div style={{ 'textAlign': 'left' }}>
      <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
      <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" size="50" />
    </div>
  );


  const ownerDialogFooter = () => {
    return (

      <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveOwner} />
      </React.Fragment>

    );
  }


  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editOwner(rowData)} />
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

  const ownerIdNameTemplate = (rowData) => {
    return <span>{rowData.ownerId} {rowData.ownerName}</span>;
  }

  const ownerCompanyAddressPhone = (rowData) => {
    return <span>{rowData.companyName} {rowData.address}</span>;
  }

  const ownerPhoneHomePhone = (rowData) => {
    return <span>{rowData.phoneNumber} {rowData.homePhone}</span>;
  }

  const ownerEmergencyEmail = (rowData) => {
    return <span>{rowData.emergencyPhone} {rowData.email}</span>;
  }

  const ownerVechileId = (rowData) => {
    return <span>{rowData.vechileId}</span>;
  }



  const rejectFunc = () => {
    return props.history.push("/owner-list/");
  }

  const confirm = (data) => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteOwner(data),
      reject: () => rejectFunc()
    });
  }


  return (
    <div>

      <div className="centered-spinner">
        {showLoader && <Spinner animation="border" variant="primary" />}
      </div>

      <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

      <DataTable className="mb-4" ref={(el) => { setDt(el) }} value={owners} dataKey="id" responsiveLayout="scroll" selectionMode="single" selection={selectedOwner}
        onSelectionChange={e => setSelectedOwner(e.value)} header={header} globalFilter={globalFilter}>

        <Column header="OwnerId OwnerName" body={ownerIdNameTemplate}></Column>
        <Column header="Address PhoneNumber" body={ownerCompanyAddressPhone}></Column>
        <Column header="HomePhone EmergencyPhone" body={ownerPhoneHomePhone}></Column>
        <Column header="EmailAddress UsCitizen" body={ownerEmergencyEmail}></Column>
        <Column header="GreenCard CanCrossBorder" body={ownerVechileId}></Column>
        <Column body={actionBodyTemplate} exportable={true} style={{ minWidth: '2rem' }}></Column>
      </DataTable>

      <Dialog visible={ownerDialog} style={{ width: '1000px' }} header="Owner Details" footer={ownerDialogFooter} modal className="p-fluid" onHide={hideDialog}>
        <div className="form-row">
          <div class="form-group col">
            <label htmlFor="ownerId">OwnerId</label>
            {owner && <InputText id="ownerId" value={owner.ownerId} onChange={(e) => onInputChange(e, 'ownerId')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="ownerName">OwnerName</label>
            {owner && <InputText id="ownerName" value={owner.ownerName} onChange={(e) => onInputChange(e, 'ownerName')} required/>}
          </div>
          <div class="form-group col">
            <label htmlFor="companyName">CompanyName</label>
            {owner && <InputText id="companyName" value={owner.companyName} onChange={(e) => onInputChange(e, 'companyName')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="address">Address</label>
            {owner && <InputText id="address" value={owner.address} onChange={(e) => onInputChange(e, 'address')} required />}
          </div>
        </div>
        <div className="form-row">
          <div class="form-group col">
            <label htmlFor="phoneNumber">PhoneNumber</label>
            {owner && <InputText id="phoneNumber" value={owner.phoneNumber} onChange={(e) => onInputChange(e, 'phoneNumber')} required  />}
          </div>
          <div class="form-group col">
            <label htmlFor="homePhone">HomePhone</label>
            {owner && <InputText id="homePhone" value={owner.homePhone} onChange={(e) => onInputChange(e, 'homePhone')} required  />}
          </div>
          <div class="form-group col">
            <label htmlFor="emergencyPhone">EmergencyPhone</label>
            {owner && <InputText id="emergencyPhone" value={owner.emergencyPhone} onChange={(e) => onInputChange(e, 'emergencyPhone')} required  />}
          </div>
          <div class="form-group col">
            <label htmlFor="email">Email</label>
            {owner && <InputText id="email" value={owner.email} onChange={(e) => onInputChange(e, 'email')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="vechileId">VechileId</label>
            {owner && <InputText id="vechileId" value={owner.vechileId} onChange={(e) => onInputChange(e, 'vechileId')} required />}
          </div>
        </div>
      </Dialog>

    </div>
  );
};

export default OwnerList;
