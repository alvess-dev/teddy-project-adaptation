import React from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import profileImageFernando from '../../assets/profileFernando.jpg';
import profileImageLuis from '../../assets/profileLuis.jpg';
import profileImageAlves from '../../assets/profileAlves.jpg';
import 'primeflex/primeflex.css';
import { Button } from 'primereact/button';
import Curriculo from '../../assets/Curriculo_Kaya_Haufe.pdf'

export default function Sobre() {
  const header = <h1 className='mt-0'>Aplicação de Gestão de Empresas Externas e Parceiros</h1>;
  const footer = (
    <div className="flex flex-column align-items-center">
      <div className="pictures">
        <Avatar image={profileImageFernando} size="xlarge" shape="circle" />
        <Avatar image={profileImageLuis} size="xlarge" shape="circle" />
        <Avatar image={profileImageAlves} size="xlarge" shape="circle" />
      </div>
      <label className="mt-3">Desenvolvido por Fernando Ribeiro, Luis Goulart e Luis Rodrigues.</label>

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
          A equipe <strong>CreAite</strong> é formada por três jovens desenvolvedores da ETEC de Praia Grande, unidos por um objetivo em comum: transformar a maneira como as
          pessoas se vestem, utilizando a Inteligência Artificial como aliada para personalizar sugestões de roupas de acordo com o estilo e gosto de cada usuário.
          <strong> Fernando Ribeiro</strong> é um estudante de 17 anos com grande afinidade por desenvolvimento back-end e design digital. Proativo e sempre em busca de evoluir 
          conforme as necessidades do projeto, Fernando se destaca pelo domínio em linguagens como Java, C++ e Kotlin, além de sua dedicação em entregar soluções funcionais e 
          bem estruturadas.
          <strong> Luis Goulart</strong>, também com 17 anos, tem interesse especial por back-end, cibersegurança e design digital. Comprometido com o crescimento constante, 
          ele se mantém atualizado com as tecnologias envolvidas no projeto e trabalha para fortalecer a equipe com seus conhecimentos técnicos e visão crítica.
          <strong> Luis Rodrigues</strong>, de 17 anos, tem como principais áreas de atuação o back-end em Java, a cibersegurança e a lógica de programação. É reconhecido por 
          sua habilidade de resolver problemas com raciocínio lógico e clareza, além de comunicar e ensinar conceitos de forma ágil e eficiente.
          Juntos, os três formam a CreAite, uma equipe que acredita no poder da tecnologia para simplificar o cotidiano. O projeto em desenvolvimento propõe um aplicativo 
          inovador, que utiliza inteligência artificial para sugerir roupas com base nas preferências do usuário, unindo estilo, praticidade e personalização. A equipe aposta 
          em um futuro onde vestir-se bem será uma experiência inteligente e intuitiva.
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
            <li>Cadastro e edição de usuários e roupas</li>
            <li>Suporte a filtragem e busca global</li>
            <li>Paginação dinâmica para grandes volumes de dados</li>
            <li>Feedbacks interativos com Toasts para ações bem-sucedidas</li>
          </ul>
        </section>
      </Card>
    </div>
  );
}
