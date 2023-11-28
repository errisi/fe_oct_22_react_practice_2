import { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const albums = albumsFromServer.map((album) => {
  const user
    = usersFromServer.find(currentUser => currentUser.id === album.userId);

  const photo
    = photosFromServer.find(currentPhoto => (
      currentPhoto.albumId === album.id
    ));

  return {
    ...album,
    photo,
    user,
  };
});

const getFilteredAlbumsList = (
  list,
  user,
  input,
  selectedAlbums,
) => {
  let filteredAlbums = [...list];

  if (user) {
    filteredAlbums = filteredAlbums.filter(
      album => album.user === user,
    );
  }

  if (input) {
    filteredAlbums = filteredAlbums.filter(album => (
      (album.photo.title).toLowerCase().includes(input.toLowerCase())
    ));
  }

  if (selectedAlbums.length > 0) {
    filteredAlbums = filteredAlbums.filter(album => (
      selectedAlbums.includes(album.id)
    ));
  }

  return filteredAlbums;
};

// const getSortedAlbumsList = (list, sortBy, sortType) => {
//   const sortedAlbums = [...list];

//   if (sortBy && sortType) {
//     sortedAlbums.sort((a, b) => {
//       const aValue = a[sortBy];
//       const bValue = b[sortBy];
//       let result = 0;

//       switch (sortBy) {
//         case 'id':
//           result = aValue - bValue;
//           break;

//         case 'name':
//           result = aValue.localeCompare(bValue);
//           break;

//         case 'photo':
//           result = aValue.title.localeCompare(bValue.title);
//           break;

//         case 'user':
//           result = aValue.name.localeCompare(bValue.name);
//           break;

//         default:
//           break;
//       }

//       if (sortType === 'desc') {
//         result *= -1;
//       }

//       return result;
//     });
//   }
// };

export const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentInput, setCurrentInput] = useState('');
  const [currentAlbums, setCurrentAlbums] = useState([]);
  // const [sortBy, setSortBy] = useState('');
  // const [sortType, setSortType] = useState('');

  const filteredAlbumsList = getFilteredAlbumsList(
    albums,
    currentUser,
    currentInput,
    currentAlbums,
  );

  // const readyAlbumsList = getSortedAlbumsList(
  //   filteredAlbumsList,
  //   sortBy,
  //   sortType,
  // );

  // const handleSortType = (field) => {
  //   if (sortBy !== field) {
  //     sortType('asc');
  //     setSortBy(field);

  //     return;
  //   }
  // };

  const reset = () => {
    setCurrentUser(null);
    setCurrentInput('');
    setCurrentAlbums([]);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                className={cn({ 'is-active': !currentUser })}
                onClick={() => setCurrentUser(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  className={cn(
                    { 'is-active': currentUser === user },
                  )}
                  onClick={() => setCurrentUser(user)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={currentInput}
                  onChange={(event) => (
                    setCurrentInput(event.target.value)
                  )}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {currentInput ? (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setCurrentInput('')}
                    />
                  </span>
                ) : ('')}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={cn(
                  'button',
                  'is-success',
                  'mr-6',
                  { 'is-outlined': currentAlbums.length !== 0 },
                )}
                onClick={() => setCurrentAlbums([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  key={album.id}
                  className={cn(
                    'button',
                    'mr-2',
                    'my-1',
                    { 'is-info': currentAlbums.includes(album.id) },
                  )}
                  href="#/"
                  onClick={() => {
                    if (currentAlbums.includes(album.id)) {
                      setCurrentAlbums(
                        currentAlbums.filter(good => good !== album.id),
                      );
                    } else {
                      setCurrentAlbums(
                        [...currentAlbums, album.id],
                      );
                    }
                  }}
                >
                  {`${album.title.slice(0, 20)}...`}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={reset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredAlbumsList.length > 0 ? (
            <table
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Photo name

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Album name

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User name

                      <a href="#/">
                        <span className="icon">
                          <i className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAlbumsList.map(album => (
                  <tr>
                    <td className="has-text-weight-bold">
                      {album.id}
                    </td>

                    <td>{album.photo.title}</td>
                    <td>{album.title}</td>

                    <td
                      className={cn(
                        { 'has-text-link': album.user.sex === 'm' },
                        { 'has-text-danger': album.user.sex === 'f' },
                      )}
                    >
                      {album.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No photos matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
