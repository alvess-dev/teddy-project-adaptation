import React from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import profileImage from '../../assets/profile.jpg';
import 'primeflex/primeflex.css';
import { Button } from 'primereact/button';
import Curriculo from '../../assets/Curriculo_Kaya_Haufe.pdf'

export default function Sobre() {
  const header = <h1 className='mt-0'>Aplicação de Gestão de Empresas Externas e Parceiros</h1>;
  const footer = (
    <div className="flex flex-column align-items-center">
      <Avatar image={profileImage} size="xlarge" shape="circle" />
      <label className="mt-3">Desenvolvido por Kayã Haufe.</label>

      <span className='mt-3'>
        <Button label="LinkedIn" icon="pi pi-linkedin" className="p-button-outlined linkedin-button mr-3" onClick={() => window.open('https://www.linkedin.com/in/kayahaufe')} />

        <a href={Curriculo} download="Curriculo_Kaya_Haufe.pdf">
          <Button label="Currículo" icon="pi pi-download" className="p-button-success" />
        </a>
      </span>
    </div>
  );

  return (
    <div className="sobre flex justify-content-center align-items-center">
      <Card title={header} footer={footer}>
        <section>
          <h2>Visão Geral</h2>
          <p>
            A aplicação de <strong>Gestão de Empresas Externas e Parceiros</strong> é uma solução voltada para o gerenciamento
            e administração de dados de empresas parceiras e colaboradores. O sistema permite que os usuários realizem o
            cadastro, edição e exclusão de empresas externas e parceiros, com funcionalidades adicionais como filtragem de dados,
            paginação e suporte a operações CRUD (Criar, Ler, Atualizar e Deletar).
          </p>
        </section>

        <section>
          <h2>Tecnologias Utilizadas</h2>
          <ul>
            <li>React para a construção da interface do usuário</li>
            <li>PrimeReact para componentes ricos e estilização</li>
            <li>Integração com APIs RESTful para CRUD de dados</li>
            <li>Login com armazenamento em cookie e local storage</li>
          </ul>
        </section>

        <section>
          <h2>Funcionalidades Principais</h2>
          <ul>
            <li>Cadastro e edição de empresas externas e parceiros</li>
            <li>Suporte a filtragem e busca global</li>
            <li>Paginação dinâmica para grandes volumes de dados</li>
            <li>Feedbacks interativos com Toasts para ações bem-sucedidas</li>
          </ul>
        </section>

        <section>
          <h2>Observação</h2>
          <ul>
            <li>Essa é a primeira vez que codifico em ReactJS. Programei 2 anos em AngularJS e depois fiquei 2 anos na infra (experiência adquirida no Banco Safra), portanto, sei que o código possui melhorias a serem feitas e não está no melhor clean code, mas isso se deve ao fato de nunca ter usado a linguagem e ter que desenvolver essa aplicação em 4 dias.</li>
          </ul>
        </section>
      </Card>
    </div>
  );
}
