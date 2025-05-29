import React, { useRef, useState } from "react";
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
import { Button as AntButton } from "antd";
import ModalFullscreen from "./shared/modalFullScreen";
import { ExportOutlined } from "@ant-design/icons";
import useService from "./hooks/useService";
import { GetUsuariosByInstitucionDTO } from "./types/user";
import { getUsersByIntitucion } from "./services/userService";
import { Provincia } from "./types/provincia";
import { getAllProvincia } from "./services/provinciaService";
import { Column, Pager, Paging } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import Swal from "sweetalert2";
import ReactECharts from "echarts-for-react";

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

//Component titles
const Titles = () => {
  return (
    <div className="flex justify-center gap-4">
      <h1 className="subtitle">Titulo 1</h1>
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
    // Agrega el botón "Nuevo"
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
    console.log(e);
  };
  const updateData = () => {
    console.log("Actualizando datos:", formDataUpdate);
    hideModalUpdate();
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "El catálogo ha sido actualizado correctamente.",
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
            executeProvincia();
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
            {/* Este campo es solo informativo, muestra el catálogo seleccionado */}
            <SimpleItem
              label={{ text: "Catálogo Seleccionado" }}
              editorType="dxTextBox"
            />
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
            <SimpleItem dataField="codigo" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El código es requerido" />
            </SimpleItem>
            <SimpleItem dataField="valor" editorOptions={{ width: "100%" }}>
              <RequiredRule message="El valor es requerido" />
            </SimpleItem>
            {/* Este campo es solo informativo, muestra el catálogo seleccionado */}
            <SimpleItem
              label={{ text: "Catálogo Seleccionado" }}
              editorType="dxTextBox"
            />
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
//Default component Home/Page
const Home = () => {
  const [modalChart, setModalChart] = useState<number | null>(null);
  return (
    <div className="w-screen h-screen p-4 bg-blue-500 flex flex-col gap-4 overflow-y-auto">
      <h1 className="subtitle"> React Starter Kit IDCE</h1>
      <h2 className="subtitle text-white">Botones:</h2>
      <div className="card w-full min-h-52 p-4 flex gap-4 justify-center items-center relative">
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
      <h2 className="subtitle text-white">Textos:</h2>
      <div className="card w-full min-h-52 p-4 flex gap-4 justify-center items-center relative">
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
      <h2 className="subtitle text-white">DataGrid:</h2>
      <div className="card w-full h-auto p-4 flex flex-col gap-4 justify-center items-center relative">
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
      <h2 className="subtitle text-white">Chart:</h2>
      <div className="card w-full h-auto p-4 flex flex-col gap-4 justify-center items-center relative">
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
      {modalChart && (
        <ModalFullscreen onClose={() => setModalChart(null)}>
          {modalChart === 1 && <Buttons />}
          {modalChart === 2 && <Titles />}
          {modalChart === 3 && <DataGridDevExtreme />}
          {modalChart === 4 && <Echarts />}
        </ModalFullscreen>
      )}
    </div>
  );
};

export default Home;
