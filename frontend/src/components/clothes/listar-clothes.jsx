import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ClothesService from "../../services/clothes.service";
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ListarClothes() {
    let emptyClothes = {
        name: "",
        category: "",
    };

    const [clothes, setClothes] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const location = useLocation();

    const getClothes = () => {
        ClothesService.getClothes().then((data) => setClothes(data.data));
    };

    const updateURLWithPage = (page, rows) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page + 1);
        params.set('rows', rows);
        navigate({ search: params.toString() });
    };

    const onPageChange = (event) => {
        setCurrentPage(event.page);
        setRowsPerPage(event.rows);
        updateURLWithPage(event.page, event.rows);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const pageFromURL = parseInt(params.get('page'), 10) || 1;
        const rowsFromURL = parseInt(params.get('rows'), 10) || 10;

        setCurrentPage(pageFromURL - 1);
        setRowsPerPage(rowsFromURL);
        getClothes();
    }, [location.search]);

    const header = (
        <div className="header-container">
            <div className="header-left">
                <h4 className="m-0">Buscar Roupas</h4>
                <div className="search-container">
                    <span className="p-input-icon-left">
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                    </span>
                </div>
            </div>
        </div>
    );

    const priceTemplate = (rowData) => {
        return "$" + rowData.price.toFixed(2);
    };

    const imageTemplate = (rowData) => {
        return <img src={`http://localhost:3000${rowData.image_path}`} alt="Foto do Produto" style={{ width: '7rem' }} />;
    };
    

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable
                    header={header}
                    globalFilter={globalFilter}
                    ref={dt}
                    value={clothes}
                    dataKey="id"
                    paginator
                    first={currentPage * rowsPerPage}
                    rows={rowsPerPage}
                    onPage={onPageChange}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} ao {last} de {totalRecords} Roupas">
                    <Column field="item_name" header="Nome do Produto" sortable style={{ minWidth: '16rem' }} />
                    <Column field="category" header="Categoria" sortable style={{ minWidth: '10rem' }} />
                    <Column field="color" header="Cor" sortable style={{ minWidth: '10rem' }} />
                    <Column field="size" header="Tamanho" sortable style={{ minWidth: '8rem' }} />
                    <Column field="image_path" header="Foto" body={imageTemplate} style={{ minWidth: '10rem' }} />
                    <Column field="added_date" header="Data de Adição" sortable style={{ minWidth: '14rem' }} />
                </DataTable>
            </div>
        </div>
    );
}
