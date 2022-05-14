import DriverService from "../../services/driver.service";
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



const DriverList = (props) => {
  const [drivers, setDrivers] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [driverDialog, setDriverDialog] = useState(null);
  const [driver, setDriver] = useState(null);
  const [dt, setDt] = useState(null);
  const driversRef = useRef();

  driversRef.current = drivers;

  const emptyDriver = {
    driverId: '',
    driverName: '',
    address: '',
    phoneNumber: '',
    homePhone: '',
    emergencyPhone: '',
    emailAddress: '',
    usCitizen: '',
    greenCard: '',
    canCrossBorder: '',
    tsa: '',
    tweaktwi: '',
    vechileId: ''
  };

  useEffect(() => {
    retrieveDrivers();
  }, []);

  const retrieveDrivers = () => {
    setShowLoader(true);
    DriverService.getAll()
      .then((response) => {
        setDrivers(response.data);
        setShowLoader(false);
      })
      .catch((e) => {
        console.log(e);
        setShowLoader(false);
        EventBus.dispatch("logout");
      });
  };

  const refreshList = () => {
    retrieveDrivers();
  };

  const hideDialog = () => {
    setDriverDialog(false);
  }

  const editDriver = (driver) => {
    setDriver(driver);
    setDriverDialog(true);
  }


  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let drv = { ...driver };
    drv[`${name}`] = val;
    setDriver(drv);
  }


  const deleteDriver = (driver) => {
    DriverService.delete(driver.id)
      .then((response) => {
        // props.history.push("/drivers/");
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };



  const saveDriver = () => {

    if (driver.id > 0) {
      DriverService.update(driver.id, driver)
        .then(response => {
          refreshList();
          console.log(response.data);
          //setMessage("The driver was updated successfully!");
        })
        .catch(e => {
          console.log(e);
        });
    }

    else {


      var data = {
        driverId: driver.driverId,
        driverName: driver.driverName,
        address: driver.address,
        phoneNumber: driver.phoneNumber,
        homePhone: driver.homePhone,
        emergencyPhone: driver.emergencyPhone,
        emailAddress: driver.emailAddress,
        usCitizen: driver.usCitizen,
        greenCard: driver.greenCard,
        canCrossBorder: driver.canCrossBorder,
        tsa: driver.tsa,
        tweaktwi: driver.tweaktwi,
        vechileId: driver.vechileId
      };


      DriverService.create(data)
        .then(response => {
          refreshList();
          setDriver({
            driverId: response.data.driverId,
            driverName: response.data.driverName,
            address: response.data.address,
            phoneNumber: response.data.phoneNumber,
            homePhone: response.data.homePhone,
            emergencyPhone: response.data.emergencyPhone,
            emailAddress: response.data.emailAddress,
            usCitizen: response.data.usCitizen,
            greenCard: response.data.greenCard,
            canCrossBorder: response.data.canCrossBorder,
            tsa: response.data.tsa,
            tweaktwi: response.data.tweaktwi,
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
    setDriver(emptyDriver);
    setDriverDialog(true);
  }

  let header = (
    <div style={{ 'textAlign': 'left' }}>
      <i className="pi pi-search" style={{ margin: '4px 4px 0 0' }}></i>
      <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" size="50" />
    </div>
  );


  const driverDialogFooter = () => {
    return (

      <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDriver} />
      </React.Fragment>

    );
  }


  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editDriver(rowData)} />
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

  const driverIdNameTemplate = (rowData) => {
    return <span>{rowData.driverId} {rowData.driverName}</span>;
  }

  const driverAddressPhone = (rowData) => {
    return <span>{rowData.address} {rowData.phoneNumber}</span>;
  }

  const driverHomeEmergencyPhone = (rowData) => {
    return <span>{rowData.homePhone} {rowData.emergencyPhone}</span>;
  }

  const driverEmailCitizen = (rowData) => {
    return <span>{rowData.emailAddress} {rowData.usCitizen}</span>;
  }

  const driverGreenBorder = (rowData) => {
    return <span>{rowData.greenCard} {rowData.canCrossBorder}</span>;
  }

  const driverTsaTweakVechile = (rowData) => {
    return <span>{rowData.tsa} {rowData.tweaktwi} {rowData.vechileId}</span>;
  }

  const rejectFunc = () => {
    return props.history.push("/driver-list/");
  }

  const confirm = (data) => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteDriver(data),
      reject: () => rejectFunc()
    });
  }


  return (
    <div>

      <div className="centered-spinner">
        {showLoader && <Spinner animation="border" variant="primary" />}
      </div>

      <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

      <DataTable className="mb-4" ref={(el) => { setDt(el) }} value={drivers} dataKey="id" responsiveLayout="scroll" selectionMode="single" selection={selectedDriver}
        onSelectionChange={e => setSelectedDriver(e.value)} header={header} globalFilter={globalFilter}>

        <Column header="DriverId DriverName" body={driverIdNameTemplate}></Column>
        <Column header="Address PhoneNumber" body={driverAddressPhone}></Column>
        <Column header="HomePhone EmergencyPhone" body={driverHomeEmergencyPhone}></Column>
        <Column header="EmailAddress UsCitizen" body={driverEmailCitizen}></Column>
        <Column header="GreenCard CanCrossBorder" body={driverGreenBorder}></Column>
        <Column header="Tsa Tweaktwi VechileId" body={driverTsaTweakVechile}></Column>
        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '2rem' }}></Column>
      </DataTable>

      <Dialog visible={driverDialog} style={{ width: '1000px' }} header="Driver Details" footer={driverDialogFooter} modal className="p-fluid" onHide={hideDialog}>
        <div className="form-row">
          <div class="form-group col">
            <label htmlFor="driverId">DriverId</label>
            {driver && <InputText id="driverId" value={driver.driverId} onChange={(e) => onInputChange(e, 'driverId')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="driverName">DriverName</label>
            {driver && <InputText id="driverName" value={driver.driverName} onChange={(e) => onInputChange(e, 'driverName')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="address">Address</label>
            {driver && <InputText id="address" value={driver.address} onChange={(e) => onInputChange(e, 'address')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="phoneNumber">PhoneNumber</label>
            {driver && <InputText id="phoneNumber" value={driver.phoneNumber} onChange={(e) => onInputChange(e, 'phoneNumber')} required />}
          </div>
        </div>

        <div className="form-row">
          <div class="form-group col">
            <label htmlFor="homePhone">HomePhone</label>
            {driver && <InputText id="homePhone" value={driver.homePhone} onChange={(e) => onInputChange(e, 'homePhone')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="emergencyPhone">EmergencyPhone</label>
            {driver && <InputText id="emergencyPhone" value={driver.emergencyPhone} onChange={(e) => onInputChange(e, 'emergencyPhone')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="emailAddress">EmailAddress</label>
            {driver && <InputText id="emailAddress" value={driver.emailAddress} onChange={(e) => onInputChange(e, 'emailAddress')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="usCitizen">UsCitizen</label>
            {driver && <InputText id="usCitizen" value={driver.usCitizen} onChange={(e) => onInputChange(e, 'usCitizen')} required />}
          </div>
        </div>


        <div className="form-row">
          <div class="form-group col">
            <label htmlFor="greenCard">GreenCard</label>
            {driver && <InputText id="greenCard" value={driver.greenCard} onChange={(e) => onInputChange(e, 'greenCard')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="canCrossBorder">CanCrossBorder</label>
            {driver && <InputText id="canCrossBorder" value={driver.canCrossBorder} onChange={(e) => onInputChange(e, 'canCrossBorder')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="tsa">Tsa</label>
            {driver && <InputText id="tsa" value={driver.tsa} onChange={(e) => onInputChange(e, 'tsa')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="tweaktwi">Tweaktwi</label>
            {driver && <InputText id="tweaktwi" value={driver.tweaktwi} onChange={(e) => onInputChange(e, 'tweaktwi')} required />}
          </div>
          <div class="form-group col">
            <label htmlFor="vechileId">VechileId</label>
            {driver && <InputText id="vechileId" value={driver.vechileId} onChange={(e) => onInputChange(e, 'vechileId')} required />}
          </div>
        </div>
      </Dialog>

    </div>
  );
};

export default DriverList;
