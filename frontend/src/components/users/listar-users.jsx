import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useNavigate, useLocation } from 'react-router-dom';
import usersService from '../../services/users.service';

export default function ListarUsers() {
    let emptyUser = {
        id_user: "",
        nickname: "",
        email: ""
    };

    const [users, setUsers] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const location = useLocation();

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

    const getUsers = () => {
        usersService.getUsers().then((data) => setUsers(data.data));
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const pageFromURL = parseInt(params.get('page'), 10) || 1;
        const rowsFromURL = parseInt(params.get('rows'), 10) || 10;

        setCurrentPage(pageFromURL - 1);
        setRowsPerPage(rowsFromURL);
        getUsers();
    }, [location.search]);

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const saveUser = () => {
        setSubmitted(true);
        setUserDialog(false);

        if (user.id_user) {
            usersService.putUser(user.id_user, user).then((response) => {
                const savedUser = response.data;
                let _users = [...users];
                const index = findIndexById(user.id_user);
                _users[index] = savedUser;
                toast.current.show({ severity: 'success', summary: 'Sucesso!', detail: 'Usuário Atualizado', life: 3000 });
                setUsers(_users);
                setUser(emptyUser);
            }).catch(error => {
                console.error("Erro ao atualizar usuário", error);
            });
        }
    };

    const editUser = (user) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        let _users = users.filter((val) => val.id_user !== user.id_user);

        setUsers(_users);
        setDeleteUserDialog(false);
        usersService.deleteUserById(user.id_user).then(() => 
            toast.current.show({ severity: 'success', summary: 'Sucesso!', detail: 'Usuário deletado.', life: 3000 })
        );
    };

    const findIndexById = (id) => {
        return users.findIndex((u) => u.id_user === id);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;
        setUser(_user);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" severity="warning" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="header-container">
            <div className="header-left">
                <h4 className="m-0">Usuários</h4>
                <div className="search-container">
                    <span className="p-input-icon-left">
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                    </span>
                </div>
            </div>
        </div>
    );

    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} className='btn-red-not-bg' />
            <Button label="Salvar" icon="pi pi-check" onClick={saveUser} className='btn-orange' />
        </React.Fragment>
    );

    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" outlined className='btn-orange-not-bg' onClick={hideDeleteUserDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteUser} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <DataTable
                    header={header}
                    globalFilter={globalFilter}
                    ref={dt}
                    value={users}
                    dataKey="id_user"
                    paginator
                    first={currentPage * rowsPerPage}
                    rows={rowsPerPage}
                    onPage={onPageChange}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} ao {last} de {totalRecords} usuários"
                >
                    <Column field="id_user" header="ID" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="nickname" header="Apelido" sortable style={{ minWidth: '14rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '14rem' }}></Column>
                    <Column body={actionBodyTemplate} style={{ minWidth: '10rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Editar Usuário" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nickname">Apelido</label>
                    <InputText id="nickname" value={user.nickname} onChange={(e) => onInputChange(e, 'nickname')} required autoFocus className={submitted && !user.nickname ? 'p-invalid' : ''} />
                    {submitted && !user.nickname && <small className="p-invalid">O apelido é obrigatório.</small>}
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required className={submitted && !user.email ? 'p-invalid' : ''} />
                    {submitted && !user.email && <small className="p-invalid">O email é obrigatório.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <span>Você tem certeza que deseja excluir o usuário <b>{user.nickname}</b>?</span>
                </div>
            </Dialog>
        </div>
    );
}
