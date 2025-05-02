import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { useNavigate, useLocation } from 'react-router-dom';
import usersService from '../../services/users.service';

export default function ListarUsers() {
    console.log("AAAAAAAAAAA")
    let emptyUser = {
        name: "",
        email: "",
        phone: "",
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
        params.set('page', page + 1); // page começa em 0, então adicionamos 1 para a URL
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
        const pageFromURL = parseInt(params.get('page'), 10) || 1; // Padrão é 1 se não houver parâmetro
        const rowsFromURL = parseInt(params.get('rows'), 10) || 10;

        setCurrentPage(pageFromURL - 1); // pageFromURL começa em 1 na URL, mas em 0 na tabela
        setRowsPerPage(rowsFromURL);
        getUsers(); // Chama o serviço para buscar os dados
    }, [location.search]);

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

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

        if (user.id) {
            usersService.putUser(user.id, user).then((response) => {
                const savedUser = response.data;

                let _users = [...users];

                const index = findIndexById(user.id);
                _users[index] = savedUser; // Atualiza o usuário com os dados do backend
                toast.current.show({ severity: 'success', summary: 'Sucesso!', detail: 'Usuário Atualizado', life: 3000 });

                setUsers(_users);
                setUser(emptyUser);
            }).catch(error => {
                console.error("Erro ao salvar usuário", error);
            });
        } else {
            usersService.postUser(user).then((response) => {
                const savedUser = response.data;

                let _users = [...users];
                _users.push(savedUser); // Adiciona o novo usuário

                toast.current.show({ severity: 'success', summary: 'Sucesso!', detail: 'Usuário Cadastrado', life: 3000 });

                setUsers(_users);
                setUser(emptyUser);
            }).catch(error => {
                console.error("Erro ao salvar usuário", error);
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
        let _users = users.filter((val) => val.id !== user.id);

        setUsers(_users);
        setDeleteUserDialog(false);
        usersService.deleteUserById(user.id).then(() => toast.current.show({ severity: 'success', summary: 'Sucesso!', detail: 'Usuário deletado.', life: 3000 }));
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
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
            <div className="header-right">
                <Button label="Adicionar Usuário" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        </div>
    );

    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} className='btn-red-not-bg' />
            <Button label="Confirmar" icon="pi pi-check" onClick={saveUser} className='btn-orange' />
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
                    dataKey="id"
                    paginator
                    first={currentPage * rowsPerPage}
                    rows={rowsPerPage}
                    onPage={onPageChange}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} ao {last} de {totalRecords} usuários"
                >
                    <Column field="id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="name" header="Nome" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="email" header="Email" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="phone" header="Telefone" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column body={actionBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Dados do Usuário" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Nome</label>
                    <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={submitted && !user.name ? 'p-invalid' : ''} />
                    {submitted && !user.name && <small className="p-invalid">O nome é obrigatório.</small>}
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required className={submitted && !user.email ? 'p-invalid' : ''} />
                    {submitted && !user.email && <small className="p-invalid">O email é obrigatório.</small>}
                </div>

                <div className="field">
                    <label htmlFor="phone">Telefone</label>
                    <InputText id="phone" value={user.phone} onChange={(e) => onInputChange(e, 'phone')} />
                </div>
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <span>Você tem certeza que deseja excluir o usuário <b>{user.name}</b>?</span>
                </div>
            </Dialog>
        </div>
    );
}
