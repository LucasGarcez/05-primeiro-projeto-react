import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import api from '../../services/api';
import { Title, Form, Repositories, Error } from './styles';
import logo from '../../assets/logo.svg';

interface Repository {
  nameWithOwner: string;
  description: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

const REPOSITORY = gql`
  query Repository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      nameWithOwner
      description
      owner {
        login
        avatarUrl
      }
    }
  }
`;

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  // const [owner, setOwner] = useState('');
  // const [name, setName] = useState('');

  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem(
      '@GithubExplorer:repositories',
    );
    return storageRepositories ? JSON.parse(storageRepositories) : [];
  });

  const [getRepository, { error, data }] = useLazyQuery(REPOSITORY);

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  useMemo(() => {
    if (data && data.repository) {
      setRepositories((repos) => [...repos, data.repository]);
    }
  }, [data]);

  if (error) {
    setInputError('Erro ao buscar repositório');
  }

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite autor/nome do repositório');
      return;
    }

    const [owner, name] = newRepo.split('/');

    getRepository({
      variables: {
        owner,
        name,
      },
    });
  }

  return (
    <>
      <img src={logo} alt="Git Explorer" />
      <Title>Explore repositórios no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(event) => setNewRepo(event.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.nameWithOwner}
            to={`/repository/${repository.nameWithOwner}`}
          >
            <img
              src={repository.owner.avatarUrl}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.nameWithOwner}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
