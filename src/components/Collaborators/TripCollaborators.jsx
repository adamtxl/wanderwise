import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

function TripCollaborators({ trip_id }) {
  const { collaborators, nonCollaborators } = useSelector((store) => store.collaboratorsReducer);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (trip_id) {
      dispatch({ type: 'FETCH_COLLABORATORS', payload: trip_id });
      dispatch({ type: 'FETCH_NON_COLLABORATORS', payload: trip_id });
    }
  }, [trip_id, dispatch]);

  const handleAddCollaborator = () => {
    if (selectedUser) {
      dispatch({ type: 'ADD_COLLABORATOR', payload: { tripId: trip_id, userId: selectedUser.value } });
      setSelectedUser(null);
      setInputValue('');
    }
  };

  const handleRemoveCollaborator = (userId) => {
    dispatch({ type: 'REMOVE_COLLABORATOR', payload: { tripId: trip_id, userId } });
  };

  const options = nonCollaborators.map((user) => ({
    value: user.id,
    label: user.username,
  }));

  const filteredOptions = inputValue.length >= 3 ? options : [];

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: 'rgba(255,255,255,0.06)',
      borderColor: state.isFocused ? '#c9a84c' : 'rgba(255,255,255,0.1)',
      borderRadius: '8px',
      boxShadow: 'none',
      '&:hover': { borderColor: '#c9a84c' },
    }),
    menu: (base) => ({
      ...base,
      background: '#0f2035',
      border: '1px solid rgba(201,168,76,0.2)',
      borderRadius: '8px',
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? 'rgba(201,168,76,0.12)' : 'transparent',
      color: '#f5f0e8',
      fontSize: '0.85rem',
      cursor: 'pointer',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#f5f0e8',
      fontSize: '0.85rem',
    }),
    input: (base) => ({
      ...base,
      color: '#f5f0e8',
      fontSize: '0.85rem',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(245,240,232,0.3)',
      fontSize: '0.85rem',
    }),
    clearIndicator: (base) => ({
      ...base,
      color: 'rgba(245,240,232,0.3)',
      '&:hover': { color: '#f5f0e8' },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: 'rgba(245,240,232,0.3)',
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: 'rgba(245,240,232,0.4)',
      fontSize: '0.82rem',
    }),
  };

  return (
    <div className="collab-wrapper">

      {/* Current collaborators */}
      {collaborators.length === 0 ? (
        <p className="collab-empty">No collaborators yet. Add someone below.</p>
      ) : (
        <ul className="collab-list">
          {collaborators.map((c, i) => (
            <li key={`${c.id}-${i}`} className="collab-item">
              <div className="collab-avatar">{c.username?.[0]?.toUpperCase()}</div>
              <span className="collab-name">{c.username}</span>
              <button className="collab-remove" onClick={() => handleRemoveCollaborator(c.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add collaborator */}
      <div className="collab-add">
        <div className="collab-add-label">Add Collaborator</div>
        <div className="collab-add-row">
          <div style={{ flex: 1 }}>
            <Select
              options={filteredOptions}
              onChange={setSelectedUser}
              value={selectedUser}
              placeholder="Type 3+ characters to search..."
              isClearable
              styles={selectStyles}
              inputValue={inputValue}
              onInputChange={(val) => setInputValue(val)}
              noOptionsMessage={() => inputValue.length < 3 ? 'Type to search users' : 'No users found'}
            />
          </div>
          <button
            className="collab-add-btn"
            onClick={handleAddCollaborator}
            disabled={!selectedUser}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripCollaborators;
