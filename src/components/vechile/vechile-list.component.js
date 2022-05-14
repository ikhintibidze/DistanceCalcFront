import VechileService from "../../services/vechile.service";
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



  const VechileList = (props) => {
  const [vechiles, setVechiles] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedVechile, setSelectedVechile] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [vechileDialog, setVechileDialog] = useState(null);
  const [vechile, setVechile] = useState(null);
  const [dt, setDt] = useState(null);
  const vechilesRef = useRef();
  const [vechileId, setVechileId] = useState(null);
  const [destZip, setDestZip] = useState(null);
  const [radius, setRadius] = useState(null);
  const [distance, setDistance] = useState(null);

  vechilesRef.current = vechiles;

  const emptyVechile = {
    vechileId: '',
    status: '',
    vechileType: '',
    dockHigh: '',
    payload: '',
    dimensions: '',
    doorDimensions: '',
    doorType: '',
    tempControl: '',
    liftGate: '',
    team: '',
    etrack: '',
    dateHired: '',
    whoHired: '',
    hazmatCertified: '',
    vinCode: '',
    licenceState: '',
    model: '',
    year: '',
    color: '',
    location: '',
    distance: '',
    contactNumber: '',
    locationDateTime: '',
    driverId: '',
    ownerId: '',
    lockUser: '',
    category: '',
    dispatch: '',
    w9date: '',
    insuranceDate: '',
    licenseDate: ''
  };

  useEffect(() => {
    retrieveVechiles()
  }, []);


  const retrieveVechiles = () => {
    setShowLoader(true);
   
    if (vechileId) 
    VechileService.getById(vechileId)
    .then((response) => {
      
      const items = [];
      items.push(response.data);
      
      setVechiles(items);
      
      setShowLoader(false);
    })
    .catch((e) => {
      console.log(e);
      setShowLoader(false);
      EventBus.dispatch("logout");
    });


    else

  
    if ((destZip)&&(radius))  {  

    
    VechileService.calculateDistance(destZip,radius)
      .then((response) => {
        setVechiles(response.data);
        console.log(JSON.stringify(response.data));
        setShowLoader(false);
      })
      .catch((e) => {
        console.log(e);
        setShowLoader(false);
        EventBus.dispatch("logout");
      });
    }
     else
     
     VechileService.getAll()
     .then((response) => {
       setVechiles(response.data);
       
       setShowLoader(false);
     })
     .catch((e) => {
       console.log(e);
       setShowLoader(false);
       EventBus.dispatch("logout");
     });

  };



/*  const retrieveVechiles = () => {
    setShowLoader(true);
    VechileService.getAll()
      .then((response) => {
        setVechiles(response.data);
        setShowLoader(false);
      })
      .catch((e) => {
        console.log(e);
        setShowLoader(false);
        EventBus.dispatch("logout");
      });
  };
*/
  

  const refreshList = () => {
    retrieveVechiles();
  };

  const hideDialog = () => {
    setVechileDialog(false);
  }

  const clearSearch = () => {
    setDestZip("");
    setRadius("");
    setVechileId("");
  }

  const editVechile = (vechile) => {
    setVechile(vechile);
    setVechileDialog(true);
  }


  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let drv = { ...vechile };
    drv[`${name}`] = val;
    setVechile(drv);
  }


  const deleteVechile = (vechile) => {
    VechileService.delete(vechile.id)
      .then((response) => {
        // props.history.push("/vechiles/");
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };



  const saveVechile = () => {

    if (vechile.id > 0) {
      VechileService.update(vechile.id, vechile)
        .then(response => {
          refreshList();
          console.log(response.data);
          //setMessage("The vechile was updated successfully!");
        })
        .catch(e => {
          console.log(e);
        });
    }

    else {


      var data = {
        vechileId: vechile.vechileId,
        status: vechile.status,
        vechileType: vechile.vechileType,
        dockHigh: vechile.dockHigh,
        payload: vechile.payload,
        dimensions: vechile.dimensions,
        doorDimensions: vechile.doorDimensions,
        doorType: vechile.doorType,
        tempControl: vechile.tempControl,
        liftGate: vechile.liftGate,
        team: vechile.team,
        etrack: vechile.etrack,
        dateHired: vechile.dateHired,
        whoHired: vechile.whoHired,
        hazmatCertified: vechile.hazmatCertified,
        vinCode: vechile.vinCode,
        licenceState: vechile.licenceState,
        model: vechile.model,
        year: vechile.year,
        color: vechile.color,
        location: vechile.location,
        distance: vechile.distance,
        contactNumber: vechile.contactNumber,
        locationDateTime: vechile.locationDateTime,
        driverId: vechile.driverId,
        ownerId: vechile.ownerId,
        lockUser: vechile.lockUser,
        category: vechile.category,
        dispatch: vechile.dispatch,
        w9date: vechile.w9date,
        insuranceDate: vechile.insuranceDate,
        licenseDate: vechile.licenseDate
      };


      VechileService.create(data)
        .then(response => {
          refreshList();
          setVechile({
            vechileId: response.data.vechileId,
            status: response.data.status,
            vechileType: response.data.vechileType,
            dockHigh: response.data.dockHigh,
            payload: response.data.payload,
            dimensions: response.data.dimensions,
            doorDimensions: response.data.doorDimensions,
            doorType: response.data.doorType,
            tempControl: response.data.tempControl,
            liftGate: response.data.liftGate,
            team: response.data.team,
            etrack: response.data.etrack,
            dateHired: response.data.dateHired,
            whoHired: response.data.whoHired,
            hazmatCertified: response.data.hazmatCertified,
            vinCode: response.data.vinCode,
            licenceState: response.data.licenceState,
            model: response.data.model,
            year: response.data.year,
            color: response.data.color,
            location: response.data.location,
            distance: response.data.distance,
            contactNumber: response.data.contactNumber,
            locationDateTime: response.data.locationDateTime,
            driverId: response.data.driverId,
            ownerId: response.data.ownerId,
            lockUser: response.data.lockUser,
            category: response.data.category,
            dispatch: response.data.dispatch,
            w9date: response.data.w9date,
            insuranceDate: response.data.insuranceDate,
            licenseDate: response.data.licenseDate
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
    setVechile(emptyVechile);
    setVechileDialog(true);
  }

  
  //DataTable is headershi tu ramis gamochena minda aq chavsva
  let header = (
    <div style={{ 'textAlign': 'left' }}>
       <div className="centered-spinner">
        {showLoader && <Spinner animation="border" variant="primary" />}
      </div>
    </div>
  );


  const vechileDialogFooter = () => {
    return (

      <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveVechile} />
      </React.Fragment>

    );
  }


  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-lock" className="p-button-rounded p-button-secondary mr-1" onClick={() => editVechile(rowData)} />
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-1" onClick={() => editVechile(rowData)} />
        <Button icon="pi pi-trash"  className="p-button-rounded p-button-warning" onClick={() => confirm(rowData)} />
      </React.Fragment>
    );
  }

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button icon="pi pi-plus" className="p-button-rounded p-button-info mr-2" onClick={openNew} />
        <Button icon="pi pi-download" className="p-button-rounded p-button-help" onClick={exportCSV} />
      </React.Fragment>
    )
  }


  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
         VechileId &nbsp;&nbsp; <InputText className="inputFld" id="vechId" placeholder="Vechile Id" value={vechileId || ""} onChange={(e) => setVechileId(e.target.value)} onKeyDown={e => e.key === 'Enter' && retrieveVechiles()}/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         Dest ZIP &nbsp;&nbsp;<InputText className="inputFld" id="dstZp" placeholder="Dest Zip" value={destZip || ""} onChange={(e) => setDestZip(e.target.value)} onKeyDown={e => e.key === 'Enter' && retrieveVechiles()}/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
         Radius &nbsp;&nbsp;<InputText className="inputFld" id="rad" placeholder="Radius" value={radius || ""} onChange={(e) => setRadius(e.target.value)} onKeyDown={e => e.key === 'Enter' && retrieveVechiles()} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button icon="pi pi-search" className="p-button-rounded p-button-success mr-2" onClick={() => retrieveVechiles()} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-success mr-2" onClick={() => clearSearch()} />
      </React.Fragment>
    )
  }

   
  const distTemplate = (rowData) => {
    return <span>{rowData.dist}</span>;
  }

  
  const dispatchTemplate = (rowData) => {
    return <span>{rowData.dispatch} {rowData.category} {rowData.vechileId} {rowData.driverId} {rowData.contactNumber} {rowData.location}</span>;
  }

  const typeTemplate = (rowData) => {
    return <span>{rowData.vechileType} {rowData.dimensions} {rowData.payload} {rowData.availableNote}</span>;
  }

  const locTemplate = (rowData) => {
    return <span>{rowData.locationDateTime}</span>;
  }

  const statusTemplate = (rowData) => {
    return <span>{rowData.status} {rowData.dockHigh} {rowData.liftGate} {rowData.team}</span>;
  }


  const vechileVechileId = (rowData) => {
    return <span>{rowData.vechileId}</span>;
  }


  const rejectFunc = () => {
    return props.history.push("/vechile-list/");
  }

  const confirm = (data) => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteVechile(data),
      reject: () => rejectFunc()
    });
  }


  return (
    <div>

     

      <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

      <DataTable value={vechiles} dataKey="id" responsiveLayout="scroll" selectionMode="single" selection={selectedVechile}
        onSelectionChange={e => setSelectedVechile(e.value)} header={header} globalFilter={globalFilter}>
        <Column header="Distance" body={distTemplate}></Column>
        <Column header="Dispatch Category VehicleId DriverId ContactNumber Location" body={dispatchTemplate}></Column>
        <Column header="VehicleType Dimensions Payload AvailableNote" body={typeTemplate}></Column>
        <Column header="LocDateTime W9Expire InsuranceExpire RegistrationExpire LicenceExpire" body={locTemplate}></Column>
        <Column header="Status Dockhigh LiftGate Team" body={statusTemplate}></Column>
        <Column body={actionBodyTemplate} exportable={true} style={{ minWidth: '15rem' }}></Column>
      </DataTable>

      <Dialog visible={vechileDialog} style={{ width: '1000px' }} header="Vechile Details" footer={vechileDialogFooter} modal className="p-fluid" onHide={hideDialog}>

       
        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="vechileId">VechileId</label>
            {vechile && <InputText id="vechileId" value={vechile.vechileId} onChange={(e) => onInputChange(e, 'vechileId')} required/>}
          </div>
          <div className="form-group col">
            <label htmlFor="status">Status</label>
            {vechile && <InputText id="status" value={vechile.status} onChange={(e) => onInputChange(e, 'status')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="vechileType">VechileType</label>
            {vechile && <InputText id="vechileType" value={vechile.vechileType} onChange={(e) => onInputChange(e, 'vechileType')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="dockHigh">DockHigh</label>
            {vechile && <InputText id="dockHigh" value={vechile.dockHigh} onChange={(e) => onInputChange(e, 'dockHigh')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="payload">Payload</label>
            {vechile && <InputText id="payload" value={vechile.payload} onChange={(e) => onInputChange(e, 'payload')} required />}
          </div>
        </div>


        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="dimensions">Dimensions</label>
            {vechile && <InputText id="dimensions" value={vechile.dimensions} onChange={(e) => onInputChange(e, 'dimensions')} required/>}
          </div>
          <div className="form-group col">
            <label htmlFor="doorDimensions">DoorDimensions</label>
            {vechile && <InputText id="doorDimensions" value={vechile.doorDimensions} onChange={(e) => onInputChange(e, 'doorDimensions')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="doorType">DoorType</label>
            {vechile && <InputText id="doorType" value={vechile.doorType} onChange={(e) => onInputChange(e, 'doorType')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="tempControl">TempControl</label>
            {vechile && <InputText id="tempControl" value={vechile.tempControl} onChange={(e) => onInputChange(e, 'tempControl')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="liftGate">LiftGate</label>
            {vechile && <InputText id="liftGate" value={vechile.liftGate} onChange={(e) => onInputChange(e, 'liftGate')} required />}
          </div>
        </div>


        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="team">Team</label>
            {vechile && <InputText id="team" value={vechile.team} onChange={(e) => onInputChange(e, 'team')} required/>}
          </div>
          <div className="form-group col">
            <label htmlFor="etrack">Etrack</label>
            {vechile && <InputText id="etrack" value={vechile.etrack} onChange={(e) => onInputChange(e, 'etrack')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="dateHired">DateHired</label>
            {vechile && <InputText id="dateHired" value={vechile.dateHired} onChange={(e) => onInputChange(e, 'dateHired')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="whoHired">WhoHired</label>
            {vechile && <InputText id="whoHired" value={vechile.whoHired} onChange={(e) => onInputChange(e, 'whoHired')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="hazmatCertified">HazmatCertified</label>
            {vechile && <InputText id="hazmatCertified" value={vechile.hazmatCertified} onChange={(e) => onInputChange(e, 'hazmatCertified')} required />}
          </div>
        </div>


        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="vinCode">VinCode</label>
            {vechile && <InputText id="vinCode" value={vechile.vinCode} onChange={(e) => onInputChange(e, 'vinCode')} required/>}
          </div>
          <div className="form-group col">
            <label htmlFor="licenceState">LicenceState</label>
            {vechile && <InputText id="licenceState" value={vechile.licenceState} onChange={(e) => onInputChange(e, 'licenceState')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="vechileMake">VechileMake</label>
            {vechile && <InputText id="vechileMake" value={vechile.vechileMake} onChange={(e) => onInputChange(e, 'vechileMake')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="model">Model</label>
            {vechile && <InputText id="model" value={vechile.model} onChange={(e) => onInputChange(e, 'model')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="year">Year</label>
            {vechile && <InputText id="year" value={vechile.year} onChange={(e) => onInputChange(e, 'year')} required />}
          </div>
        </div>

      
        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="color">Color</label>
            {vechile && <InputText id="color" value={vechile.color} onChange={(e) => onInputChange(e, 'color')} required/>}
          </div>
          <div className="form-group col">
            <label htmlFor="location">Location</label>
            {vechile && <InputText id="location" value={vechile.location} onChange={(e) => onInputChange(e, 'location')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="distance">Distance</label>
            {vechile && <InputText id="distance" value={vechile.distance} onChange={(e) => onInputChange(e, 'distance')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="contactNumber">ContactNumber</label>
            {vechile && <InputText id="contactNumber" value={vechile.contactNumber} onChange={(e) => onInputChange(e, 'contactNumbers')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="locationDateTime">LocationDateTime</label>
            {vechile && <InputText id="locationDateTime" value={vechile.locationDateTime} onChange={(e) => onInputChange(e, 'locationDateTime')} required />}
          </div>
        </div>

       
        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="availableNote">AvailableNote</label>
            {vechile && <InputText id="availableNote" value={vechile.availableNote} onChange={(e) => onInputChange(e, 'availableNote')} required/>}
          </div>
          <div className="form-group col">
            <label htmlFor="driverId">DriverId</label>
            {vechile && <InputText id="driverId" value={vechile.driverId} onChange={(e) => onInputChange(e, 'driverId')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="ownerId">OwnerId</label>
            {vechile && <InputText id="ownerId" value={vechile.ownerId} onChange={(e) => onInputChange(e, 'ownerId')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="statusId">StatusId</label>
            {vechile && <InputText id="statusId" value={vechile.statusId} onChange={(e) => onInputChange(e, 'statusId')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="lockDateTime">LockDateTime</label>
            {vechile && <InputText id="lockDateTime" value={vechile.lockDateTime} onChange={(e) => onInputChange(e, 'lockDateTime')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="recordStatus">RecordStatus</label>
            {vechile && <InputText id="recordStatus" value={vechile.recordStatus} onChange={(e) => onInputChange(e, 'recordStatus')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="lockUser">LockUser</label>
            {vechile && <InputText id="lockUser" value={vechile.lockUser} onChange={(e) => onInputChange(e, 'lockUser')} required />}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col">
            <label htmlFor="category">Category</label>
            {vechile && <InputText id="category" value={vechile.category} onChange={(e) => onInputChange(e, 'category')} required/>}
          </div>
          <div className="form-group col">
            <label htmlFor="dispatch">Dispatch</label>
            {vechile && <InputText id="dispatch" value={vechile.dispatch} onChange={(e) => onInputChange(e, 'dispatch')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="w9date">W9date</label>
            {vechile && <InputText id="w9date" value={vechile.w9date} onChange={(e) => onInputChange(e, 'w9date')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="insuranceDate">InsuranceDate</label>
            {vechile && <InputText id="insuranceDate" value={vechile.insuranceDate} onChange={(e) => onInputChange(e, 'insuranceDate')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="vechRegDate">VechRegDate</label>
            {vechile && <InputText id="vechRegDate" value={vechile.vechRegDate} onChange={(e) => onInputChange(e, 'vechRegDate')} required />}
          </div>
          <div className="form-group col">
            <label htmlFor="licenseDate">LicenseDate</label>
            {vechile && <InputText id="licenseDate" value={vechile.licenseDate} onChange={(e) => onInputChange(e, 'licenseDate')} required />}
          </div>
        </div>

      </Dialog>

    </div>
  );
};

export default VechileList;
