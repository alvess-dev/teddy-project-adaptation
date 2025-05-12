import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ClothesService from "../../services/clothes.service";
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ListarClothes() {
    const sizeOptions = [
        { label: 'PP', value: 'PP' },
        { label: 'P', value: 'P' },
        { label: 'M', value: 'M' },
        { label: 'G', value: 'G' },
        { label: 'GG', value: 'GG' }
    ];

    const categoryOptions = [
        { label: 'Camiseta', value: 'tshirt' },
        { label: 'Calça', value: 'pants' },
        { label: 'Boné', value: 'cap' },
        { label: 'Relógio', value: 'watch' },
        { label: 'Jaqueta', value: 'jacket' }
    ];

    const emptyCloth = { id_cloth: null, item_name: '', category: null, color: '', size: null, image_path: '' };
    const [clothes, setClothes] = useState([]);
    const [clothDialog, setClothDialog] = useState(false);
    const [deleteClothDialog, setDeleteClothDialog] = useState(false);
    const [cloth, setCloth] = useState(emptyCloth);
    const [imageFile, setImageFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    const getClothes = () => {
        ClothesService.getClothes()
            .then(res => setClothes(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const pageFromURL = parseInt(params.get('page'), 10) || 1;
        const rowsFromURL = parseInt(params.get('rows'), 10) || 10;
        setCurrentPage(pageFromURL - 1);
        setRowsPerPage(rowsFromURL);
        getClothes();
    }, [location.search]);

    const openNew = () => {
        setCloth({ ...emptyCloth });
        setImageFile(null);
        setSubmitted(false);
        setClothDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setClothDialog(false);
    };

    const hideDeleteDialog = () => {
        setDeleteClothDialog(false);
    };

    const saveCloth = async () => {
        setSubmitted(true);
        if (!cloth.item_name || !cloth.category) return;
        try {
            const formData = new FormData();
            formData.append('item_name', cloth.item_name);
            formData.append('category', cloth.category);
            formData.append('color', cloth.color);
            formData.append('size', cloth.size);
            if (imageFile) formData.append('image', imageFile);

            let response;
            if (cloth.id_cloth) {
                response = await ClothesService.putCloth(cloth.id_cloth, formData, true);
                setClothes(clothes.map(c => c.id_cloth === cloth.id_cloth ? response.data : c));
                toast.current.show({ severity: 'success', summary: 'Atualizado', detail: 'Roupa atualizada', life: 3000 });
            } else {
                response = await ClothesService.postCloth(formData, true);
                setClothes([...clothes, response.data]);
                toast.current.show({ severity: 'success', summary: 'Adicionado', detail: 'Roupa adicionada', life: 3000 });
            }
            hideDialog();
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar roupa', life: 3000 });
        }
    };

    const editCloth = (data) => {
        setCloth({ ...data });
        setImageFile(null);
        setSubmitted(false);
        setClothDialog(true);
    };

    const confirmDeleteCloth = (data) => {
        setCloth(data);
        setDeleteClothDialog(true);
    };

    const deleteCloth = async () => {
        try {
            await ClothesService.deleteClothById(cloth.id_cloth);
            setClothes(clothes.filter(c => c.id_cloth !== cloth.id_cloth));
            setDeleteClothDialog(false);
            toast.current.show({ severity: 'success', summary: 'Excluído', detail: 'Roupa excluída', life: 3000 });
        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir roupa', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = name === 'image' ? e.target.files[0] : e.target.value;
        if (name === 'image') setImageFile(val);
        else setCloth(prev => ({ ...prev, [name]: val }));
    };

    const actionBodyTemplate = (rowData) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined severity="warning" onClick={() => editCloth(rowData)} className="p-mr-2" />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCloth(rowData)} />
        </>
    );

    const imageTemplate = (rowData) => (
        <img src={`http://localhost:3000${rowData.image_path}`} alt="Foto" style={{ width: '7rem' }} />
    );

    const header = (
        <div className="p-d-flex p-jc-between p-ai-center">
            <h4>Roupas</h4>
            <div>
                <span className="p-input-icon-left p-mr-2">
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                </span>
                <Button label="Adicionar Roupa" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        </div>
    );

    const clothDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Confirmar" icon="pi pi-check" onClick={saveCloth} />
        </>
    );

    const deleteClothDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteCloth} />
        </>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable value={clothes} paginator first={currentPage * rowsPerPage} rows={rowsPerPage}
                    onPage={onPageChange} rowsPerPageOptions={[5,10,25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} ao {last} de {totalRecords}"
                    header={header} globalFilter={globalFilter} dataKey="id_cloth">
                    <Column field="item_name" header="Nome" sortable />
                    <Column field="category" header="Categoria" sortable />
                    <Column field="color" header="Cor" sortable />
                    <Column field="size" header="Tamanho" sortable />
                    <Column header="Foto" body={imageTemplate} />
                    <Column header="Ações" body={actionBodyTemplate} />
                </DataTable>
            </div>

            <Dialog visible={clothDialog} style={{ width: '32rem' }} header="Dados da Roupa" modal onHide={hideDialog} footer={clothDialogFooter}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="item_name">Nome</label>
                        <InputText id="item_name" value={cloth.item_name} onChange={(e) => onInputChange(e, 'item_name')} className={submitted && !cloth.item_name ? 'p-invalid' : ''} />
                        {submitted && !cloth.item_name && <small className="p-invalid">Nome é obrigatório.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="category">Categoria</label>
                        <Dropdown id="category" value={cloth.category} options={categoryOptions} onChange={(e) => onInputChange(e, 'category')} placeholder="Selecione a categoria" className={submitted && !cloth.category ? 'p-invalid' : ''} />
                        {submitted && !cloth.category && <small className="p-invalid">Categoria é obrigatória.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="color">Cor</label>
                        <InputText id="color" value={cloth.color} onChange={(e) => onInputChange(e, 'color')} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="size">Tamanho</label>
                        <Dropdown id="size" value={cloth.size} options={sizeOptions} onChange={(e) => onInputChange(e, 'size')} placeholder="Selecione o tamanho" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="image">Imagem</label>
                        <InputText type="file" id="image" accept="image/*" onChange={(e) => onInputChange(e, 'image')} />
                        {cloth.image_path && !imageFile && <img src={`http://localhost:3000${cloth.image_path}`} alt="preview" style={{ marginTop: '1rem', width: '7rem' }} />}
                        {imageFile && <img src={URL.createObjectURL(imageFile)} alt="preview" style={{ marginTop: '1rem', width: '7rem' }} />}
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteClothDialog} style={{ width: '32rem' }} header="Confirmar Exclusão" modal onHide={hideDeleteDialog} footer={deleteClothDialogFooter}>
                <div className="confirmation-content">
                    <span>Tem certeza que deseja excluir <b>{cloth.item_name}</b>?</span>
                </div>
            </Dialog>
        </div>
    );
}
