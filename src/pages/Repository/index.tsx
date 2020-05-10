import React from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import { Header, RepositoryInfo, Issue } from './styles';
import logo from '../../assets/logo.svg';

const REPOSITORY_WITH_ISSUES = gql`
  query REPOSITORY_WITH_ISSUES($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      nameWithOwner
      stargazers {
        totalCount
      }
      forkCount
      description
      owner {
        login
        avatarUrl
      }
      issues(last: 5) {
        totalCount
        nodes {
          id
          title
          url
          author {
            login
          }
        }
      }
    }
  }
`;

interface RepositoryVars {
  owner: string;
  name: string;
}
interface RepositoryData {
  repository: Repository;
}
interface Repository {
  id: string;
  nameWithOwner: string;
  stargazers: {
    totalCount: number;
  };
  forkCount: number;
  description: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  issues: {
    totalCount: number;
    nodes: IssueNode[];
  };
}

interface IssueNode {
  id: string;
  title: string;
  url: string;
  author: {
    login: string;
  };
}

interface RepositoryParams {
  repository: string;
}
const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const [owner, name] = params.repository.split('/');

  const { loading, error, data } = useQuery<RepositoryData, RepositoryVars>(
    REPOSITORY_WITH_ISSUES,
    {
      variables: {
        owner,
        name,
      },
    },
  );

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error! {error.message}</p>;
  }
  const { repository } = data as RepositoryData;
  const { issues } = repository;

  return (
    <>
      <Header>
        <img src={logo} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>
      <RepositoryInfo>
        <header>
          <img src={repository.owner.avatarUrl} alt={repository.owner.login} />
          <div>
            <strong>{repository.nameWithOwner}</strong>
            <p>{repository.description}</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>{repository.stargazers.totalCount}</strong>
            <span>Stars</span>
          </li>
          <li>
            <strong>{repository.forkCount}</strong>
            <span>Forks</span>
          </li>
          <li>
            <strong>{issues.totalCount}</strong>
            <span>Issues</span>
          </li>
        </ul>
      </RepositoryInfo>

      <Issue>
        {issues.nodes.map((issue) => (
          <a key={issue.id} href={issue.url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.author.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issue>
    </>
  );
};

export default Repository;
