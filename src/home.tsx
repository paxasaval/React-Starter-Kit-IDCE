import React, { MouseEventHandler, useRef, useState } from "react";
import logo from "./logo.svg";
import { Button, DataGrid, Form, Popup, ScrollView } from "devextreme-react";
import {
  ColumnChooser,
  Editing,
  Export,
  Button as GridButton,
  HeaderFilter,
  RequiredRule,
  SearchPanel,
  Texts,
} from "devextreme-react/data-grid";
import { Button as AntButton, FloatButton } from "antd";
import ModalFullscreen from "./shared/modalFullScreen";
import { ExportOutlined, SettingFilled } from "@ant-design/icons";
import useService from "./hooks/useService";
import { GetUsuariosByInstitucionDTO } from "./types/user";
import { getUsersByIntitucion } from "./services/userService";
import { Provincia } from "./types/provincia";
import { getAllProvincia } from "./services/provinciaService";
import { Column, Pager, Paging } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import Swal from "sweetalert2";
import ReactECharts from "echarts-for-react";
import { Drawer } from "antd";
import { ToastContainer, toast } from "react-toastify";
//Component buttons
const Buttons = () => {
  return (
    <div className="flex gap-4 justify-center h-8">
      <Button text="Normal" icon="plus" type="normal" stylingMode="contained" />
      <Button
        text="Primary"
        stylingMode="contained"
        elementAttr={{ class: "btn-primary" }}
      />
      <Button
        text="Info"
        stylingMode="contained"
        icon="help"
        elementAttr={{ class: "btn-info" }}
      />
      <Button
        text="Success"
        stylingMode="contained"
        icon="save"
        elementAttr={{ class: "btn-success" }}
      />
      <Button
        text="Danger"
        stylingMode="contained"
        icon="close"
        elementAttr={{ class: "btn-danger" }}
      />
    </div>
  );
};
//Component Floating Button
interface FloatingButtonProps {
  openDrawer: MouseEventHandler<HTMLButtonElement>;
}
const FloatingButton = ({ openDrawer }: FloatingButtonProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <FloatButton onClick={openDrawer} icon={<SettingFilled />}></FloatButton>
    </div>
  );
};
//Component Drawer
interface DrawerProps {
  open: boolean;
  onClose: any;
}
const DrawerComponent = ({ open, onClose }: DrawerProps) => {
  return (
    <Drawer title="Drawer Basico" open={open} onClose={onClose}>
      <div className="flex flex-col gap-2 items-center">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </div>
    </Drawer>
  );
};
//Component titles
const Titles = () => {
  return (
    <div className="flex flex-col justify-center items-start gap-1 self-start">
      <h2 className="subtitle">Subtitulo</h2>
      <span className="span">Span</span>
      <p>Text</p>
      <a href="#Link" className="link">
        Link
      </a>
    </div>
  );
};

//Component dataGrid
const DataGridDevExtreme = () => {
  //Service: getAllProvincia
  const {
    data: provincia,
    loading: provinciaLoading,
    error: provinciaError,
    execute: executeProvincia,
    isLoading: isLoadingProvincia,
    hasError: hasErrorProvincia,
  } = useService<Provincia[]>(
    getAllProvincia,
    [], //ID de insitucion para ejemplo 1
    [],
    true
  );

  //StateModal: Nuevo, Editar, Eliminar
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedCodeForUpdate, setSelectedCodeForUpdate] =
    useState<Provincia | null>(null);

  //FormsData
  const defaultFormData: Provincia = {
    provinciaID: 0,
    codigo: "",
    nombre: "",
    paisIso2: "",
    region: "",
    peso: 0,
    estado: "",
  };
  const [formData, setFormData] = useState<Provincia>(defaultFormData);
  const formRef = useRef<Form>(null);
  const [formDataUpdate, setFormDataUpadte] =
    useState<Provincia>(defaultFormData);
  const formRefUpdate = useRef<Form>(null);

  //Personalizar Toolbar del DataGrid
  const onToolbarPreparing = (e: any) => {
    e.toolbarOptions.items = e.toolbarOptions.items.filter(
      (items: any) => items.name !== "addRowButton"
    );
    // Agrega el botón "Nuevo" y Demas botones personalizados
    e.toolbarOptions.items.push({
      //unshift
      location: "after",
      widget: "dxButton",
      options: {
        icon: "add",
        text: "Nuevo",
        onClick: () => setIsCreateModalVisible(true),
      },
    });
  };

  //Eventos Create
  const hideModalCreate = () => {
    setIsCreateModalVisible(false);
  };

  const saveData = () => {
    console.log("Guardando datos:", formData);
    //Aqui va la logica de guardar
    //
    hideModalCreate();
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "El catálogo ha sido agregado correctamente.",
    });
  };

  //Eventos Update
  const hideModalUpdate = () => {
    setIsUpdateModalVisible(false);
  };
  const handleUpdateGrid = (e: any) => {
    const data = e.row.data;
    console.log(data);
    setFormDataUpadte(data);
    setIsUpdateModalVisible(true);
  };
  const updateData = () => {
    console.log("Actualizando datos:", formDataUpdate);
    //Aqui va la logica de actualizar
    hideModalUpdate();
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "La provincia ha sido actualizado correctamente.",
    });
  };

  //Evento Delete
  const handleDelteGrid = (e: any) => {
    console.log(e);
    const value = e.row.data.nombre; //capturas la propiedad "nombre" del objeto
    Swal.fire({
      title: "¿Está seguro?",
      text: `¿Desea eliminar el catalogo "${value}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Llamamos al servicio para eliminar el catálogo
          //const result = await deleteProvincia(codigo);
          const result = true;
          if (result === true) {
            // Mostrar mensaje de éxito
            Swal.fire({
              icon: "success",
              title: "Éxito",
              text: "La provincia ha sido eliminado correctamente.",
            });
            executeProvincia(); //Reejecutar la funcion de consultar datos dataGrid
          }
        } catch (error) {
          console.error("Error al eliminar Catalogo:", error);
          // Mostrar mensaje de error
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el Catalogo. Por favor, intente nuevamente.",
          });
        }
      }
    });
  };
  return (
    <div className="containerDataGrid p-4 pt-8">
      <DataGrid
        dataSource={provincia}
        showBorders={true}
        remoteOperations={false}
        rowAlternationEnabled={true}
        errorRowEnabled={true}
        wordWrapEnabled={true}
        columnAutoWidth={true}
        onToolbarPreparing={onToolbarPreparing}
      >
        {/* Columnas del DataGrid */}
        <Column dataField={"codigo"} caption="Codigo" width={"auto"} />
        <Column dataField={"paisIso2"} caption="Pais Iso2" width={"auto"} />
        <Column dataField={"nombre"} caption="Nombre" width={"auto"} />
        <Column dataField={"region"} caption="Region" width={"auto"} />
        <Column type="buttons" caption="Acciones" width={150}>
          <GridButton
            name="edit"
            text="Editar"
            onClick={(e: any) => handleUpdateGrid(e)}
          />
          <GridButton
            name="delete"
            text="Eliminar"
            onClick={(e: any) => handleDelteGrid(e)}
          />
        </Column>

        {/* Toolbar del dataGrid */}
        <ColumnChooser title="Columnas" enabled={true} width={300} />
        <HeaderFilter visible={true} />
        <SearchPanel visible={true} highlightCaseSensitive={true} />
        <Export enabled={true} allowExportSelectedData={true} />

        {/* Activar Editing */}
        <Editing
          mode="popup"
          allowUpdating={true}
          allowAdding={true}
          allowDeleting={true}
          useIcons={true}
        >
          <Texts
            addRow="Nuevo"
            saveRowChanges="Guardar"
            cancelRowChanges="Cancelar"
            editRow="Editar"
            deleteRow="Eliminar"
            confirmDeleteMessage="¿Está seguro de que desea eliminar este registro?"
          />
        </Editing>
        {/* Pie del dataGrid y paginacion */}
        <Paging enabled={true} pageSize={10} />
        <Pager
          showInfo={true}
          infoText="Pagina {0} de {1} ({2} registros)"
          showNavigationButtons={true}
        />
      </DataGrid>
      {/* Create Modal */}
      <Popup
        visible={isCreateModalVisible}
        // onHiding={hideModal}
        onHiding={() => {
          hideModalCreate();
          setFormData(defaultFormData);
        }}
        dragEnabled={true}
        showTitle={true}
        title="Nuevo Catálogo"
        height="auto"
        minHeight={20}
      >
        <ScrollView>
          <Form
            formData={formData}
            ref={formRef}
            colCount={1} // Este colCount afecta el nivel superior
            labelLocation="top"
          >
            {/* Aqui se personaliza los inputs */}
            <SimpleItem dataField="codigo" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El código es requerido" />
            </SimpleItem>
            <SimpleItem dataField="nombre" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El nombre es requerido" />
            </SimpleItem>
            <SimpleItem dataField="paisIso2" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El paisIso2 es requerido" />
            </SimpleItem>
            <SimpleItem dataField="region" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El region es requerido" />
            </SimpleItem>
            <SimpleItem dataField="peso" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El peso es requerido" />
            </SimpleItem>
          </Form>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              text="Guardar"
              icon="save"
              type="success"
              stylingMode="contained"
              onClick={saveData}
            />
            <Button
              text="Cancelar"
              icon="close"
              onClick={hideModalCreate}
              stylingMode="outlined"
            />
          </div>
        </ScrollView>
      </Popup>

      {/* Update Modal */}
      <Popup
        visible={isUpdateModalVisible}
        onHiding={() => {
          setIsUpdateModalVisible(false);
          setSelectedCodeForUpdate(null);
          setFormData(defaultFormData);
        }}
        dragEnabled={true}
        showTitle={true}
        title="Actualizar Producto"
        height="auto"
        minHeight={250}
      >
        <ScrollView>
          <Form
            formData={formDataUpdate}
            ref={formRefUpdate}
            colCount={1}
            labelLocation="top"
          >
            {/* Aqui se personaliza los inputs */}
            <SimpleItem dataField="codigo" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El código es requerido" />
            </SimpleItem>
            <SimpleItem dataField="nombre" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El nombre es requerido" />
            </SimpleItem>
            <SimpleItem dataField="paisIso2" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El paisIso2 es requerido" />
            </SimpleItem>
            <SimpleItem dataField="region" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El region es requerido" />
            </SimpleItem>
            <SimpleItem dataField="peso" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El peso es requerido" />
            </SimpleItem>
          </Form>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              text="Cancelar"
              onClick={() => {
                setIsUpdateModalVisible(false);
                setSelectedCodeForUpdate(null);
              }}
              stylingMode="outlined"
            />
            <Button
              text="Actualizar"
              type="success"
              stylingMode="contained"
              onClick={updateData}
            />
          </div>
        </ScrollView>
      </Popup>
    </div>
  );
};

//Component Chart
const Echarts = () => {
  const dataOptionsChart1 = {
    title: {
      text: "Stacked Line",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      Show: true,
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        saveAsImage: {},
        dataView: { show: true, readOnly: false },
        magicType: { type: ["line", "bar"] },
        restore: {},
        iconStyle: {
          borderColor: "#333333",
        },
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Email",
        type: "line",
        stack: "Total",
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "Union Ads",
        type: "line",
        stack: "Total",
        data: [220, 182, 191, 234, 290, 330, 310],
      },
      {
        name: "Video Ads",
        type: "line",
        stack: "Total",
        data: [150, 232, 201, 154, 190, 330, 410],
      },
      {
        name: "Direct",
        type: "line",
        stack: "Total",
        data: [320, 332, 301, 334, 390, 330, 320],
      },
      {
        name: "Search Engine",
        type: "line",
        stack: "Total",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  };
  return (
    <div className="flex justify-center items-center w-full pt-8">
      <ReactECharts option={dataOptionsChart1} className="w-full" />
    </div>
  );
};

//Component Documentacion
const Documentation = () => {
  return (
    <div className="w-full flex flex-col items-start gap-4">
      <div className="item flex gap-2">
        <span className="span">DevExtreme:</span>
        <a
          className="link"
          href="https://js.devexpress.com/React/Documentation/22_2/Guide/React_Components/DevExtreme_React_Components/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://js.devexpress.com/React/
        </a>
      </div>
      <div className="item flex gap-2">
        <span className="span">ECharts:</span>
        <a
          className="link"
          href="https://echarts.apache.org/examples/en/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://echarts.apache.org
        </a>
      </div>
      <div className="item flex gap-2">
        <span className="span">Tailwind:</span>
        <a
          className="link"
          href="https://tailwindcss.com/docs/styling-with-utility-classes"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://tailwindcss.com
        </a>
      </div>
      <div className="item flex gap-2">
        <span className="span">Ant Design:</span>
        <a
          className="link"
          href="https://ant.design/components/overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ant.design/components/overview
        </a>
      </div>
      <div className="item flex gap-2">
        <span className="span">Toastify:</span>
        <a
          className="link"
          href="https://fkhadra.github.io/react-toastify/introduction/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://fkhadra.github.io/react-toastify/introduction/
        </a>
      </div>
      <div className="item flex gap-2">
        <span className="span">SweetAlert2:</span>
        <a
          className="link"
          href="https://sweetalert2.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://sweetalert2.github.io/
        </a>
      </div>
    </div>
  );
};

//Component Alerts
const Alerts = () => {
  const openSweetAlert = () => {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Mensaje de prueba.",
    });
  };
  const openToast = () => {
    toast("Mensaje Toast");
  };
  return (
    <div className="flex flex-col gap-4">
      <Button
        text="Open SweetAlert"
        type="normal"
        stylingMode="contained"
        onClick={openSweetAlert}
      />
      <Button
        text="Open Toastify"
        type="normal"
        stylingMode="contained"
        onClick={openToast}
      />
      <ToastContainer position="top-center" />
    </div>
  );
};

//Default component Home/Page
const Home = () => {
  const [modalChart, setModalChart] = useState<number | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleDrawerToggle = () => {
    console.log(openDrawer);
    setOpenDrawer(!openDrawer);
  };
  return (
    <div className="w-screen h-screen p-4 bg-neutral flex flex-wrap gap-4 justify-between overflow-y-auto">
      <h1 className="subtitle w-full text-black">React Starter Kit IDCE</h1>
      <div className="card w-auto min-h-52 p-4 flex flex-col gap-4 justify-center items-center relative">
        <h2 className="subtitle text-black">Botones</h2>
        <div className="btn-modal absolute top-2 right-3">
          <AntButton
            icon={<ExportOutlined />}
            onClick={() => setModalChart(1)}
            variant="solid"
            size="small"
            className="btn-primary"
          />
        </div>
        <Buttons />
      </div>
      <div className="card w-1/6 min-h-52 p-4 flex flex-col gap-4 justify-center items-center relative">
        <h2 className="subtitle text-black">Alertas</h2>
        <div className="btn-modal absolute top-2 right-3">
          <AntButton
            icon={<ExportOutlined />}
            onClick={() => setModalChart(6)}
            variant="solid"
            size="small"
            className="btn-primary"
          />
        </div>
        <Alerts />
      </div>
      <div className="card w-1/6 min-h-52 p-4 flex flex-col gap-4 justify-center items-center relative">
        <h2 className="subtitle text-black">Textos:</h2>

        <div className="btn-modal absolute top-2 right-3">
          <AntButton
            icon={<ExportOutlined />}
            onClick={() => setModalChart(2)}
            variant="solid"
            size="small"
            className="btn-primary"
          />
        </div>
        <Titles />
      </div>
      <div className="card w-auto h-auto p-4 flex flex-col gap-4 justify-center items-center relative">
        <h2 className="subtitle text-black">Documentacion</h2>
        <div className="btn-modal absolute top-2 right-3">
          <AntButton
            icon={<ExportOutlined />}
            onClick={() => setModalChart(5)}
            variant="solid"
            size="small"
            className="btn-primary"
          />
        </div>
        <Documentation />
      </div>
      <div className="card w-full h-auto p-4 flex flex-col gap-4 justify-center items-center relative">
        <h2 className="subtitle text-black">DataGrid</h2>

        <div className="btn-modal absolute top-2 right-3">
          <AntButton
            icon={<ExportOutlined />}
            onClick={() => setModalChart(3)}
            variant="solid"
            size="small"
            className="btn-primary"
          />
        </div>
        <DataGridDevExtreme />
      </div>
      <div className="card w-full h-auto p-4 flex flex-col gap-4 justify-center items-center relative">
        <h2 className="subtitle text-black">Chart</h2>

        <div className="btn-modal absolute top-2 right-3">
          <AntButton
            icon={<ExportOutlined />}
            onClick={() => setModalChart(4)}
            variant="solid"
            size="small"
            className="btn-primary"
          />
        </div>
        <Echarts />
      </div>
      {/* Drawer */}
      <FloatingButton openDrawer={handleDrawerToggle} />
      <DrawerComponent open={openDrawer} onClose={handleDrawerToggle} />
      {/*End Drawer */}
      {modalChart && (
        <ModalFullscreen onClose={() => setModalChart(null)}>
          {modalChart === 1 && <Buttons />}
          {modalChart === 2 && <Titles />}
          {modalChart === 3 && <DataGridDevExtreme />}
          {modalChart === 4 && <Echarts />}
          {modalChart === 5 && <Documentation />}
          {modalChart === 6 && <Alerts />}
        </ModalFullscreen>
      )}
    </div>
  );
};

export default Home;
