import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ClothesService from "../../services/clothes.service";  // Renomeei o serviço para ClothesService
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ListarClothes() {
    let emptyClothes = {
        name: "",
        category: "",
        price: "",
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
        ClothesService.getClothes().then((data) => setClothes(data.data));  // Alterei para usar ClothesService
    };

    const updateURLWithPage = (page, rows) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page + 1); // page começa em 0, então adicionamos 1 para a URL
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
        const pageFromURL = parseInt(params.get('page'), 10) || 1; // Padrão é 1 se não houver parâmetro
        const rowsFromURL = parseInt(params.get('rows'), 10) || 10;

        setCurrentPage(pageFromURL - 1); // pageFromURL começa em 1 na URL, mas em 0 na tabela
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
        return <img src={rowData.image} alt="Foto do Produto" style={{ width: '7rem'}} />;
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
                    <Column field="title" header="Nome do Produto" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="category" header="Categoria" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="price" header="Preço" sortable style={{ minWidth: '10rem' }} body={priceTemplate}></Column>
                    <Column field="image" header="Foto" sortable style={{ minWidth: '10rem' }} body={imageTemplate}></Column>
                </DataTable>
            </div>
        </div>
    );
}
