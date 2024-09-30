import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

function TripCollaborators({ trip_id }) {
    const { collaborators, nonCollaborators } = useSelector((store) => store.collaboratorsReducer);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (trip_id) {
            dispatch({ type: 'FETCH_COLLABORATORS', payload: trip_id });
            dispatch({ type: 'FETCH_NON_COLLABORATORS', payload: trip_id });
            setLoading(true);
        }
    }, [trip_id, dispatch]);

    const handleAddCollaborator = () => {
        if (selectedUser) {
            dispatch({ type: 'ADD_COLLABORATOR', payload: { tripId: trip_id, userId: selectedUser.value } });
        }
    };

    const handleRemoveCollaborator = (userId) => {
        dispatch({ type: 'REMOVE_COLLABORATOR', payload: { tripId: trip_id, userId } });
    };

    const options = nonCollaborators.map((user) => ({
        value: user.id,
        label: user.username
    }));

    const filteredOptions = inputValue.length >= 3 ? options : [];

    const customStyles = {
        option: (provided) => ({
            ...provided,
            color: 'black',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'black',
        }),
    };

    return (
        <div>
            <h2>Collaborators</h2>
            <ul>
                {collaborators.map((collaborator, index) => (
                    <li key={`${collaborator.id}-${index}`}>
                        {collaborator.username}
                        <button onClick={() => handleRemoveCollaborator(collaborator.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <h3>Add Collaborator</h3>
            <Select
                options={filteredOptions}
                onChange={setSelectedUser}
                placeholder="Search for a user"
                isClearable
                styles={customStyles}
                inputValue={inputValue}
                onInputChange={(value) => setInputValue(value)}
            />
            <button onClick={handleAddCollaborator}>Add</button>
        </div>
    );
}

export default TripCollaborators;