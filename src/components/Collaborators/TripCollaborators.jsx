import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function TripCollaborators({ trip_id }) {
    const { collaborators, nonCollaborators } = useSelector((store) => store.collaboratorsReducer);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'FETCH_COLLABORATORS', payload: trip_id });
        dispatch({ type: 'FETCH_NON_COLLABORATORS', payload: trip_id });
        setLoading(true);
    }, [trip_id]);

    const handleAddCollaborator = () => {
        dispatch({ type: 'ADD_COLLABORATOR', payload: { tripId: trip_id, userId: selectedUser } });
    };

    return (
        <div>
            <h2>Collaborators</h2>
            <ul>
                {collaborators.map((collaborator) => (
                    <li key={collaborator.id}>{collaborator.username}</li>
                ))}
            </ul>
            <h3>Add Collaborator</h3>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="" disabled>Select a user</option>
                {nonCollaborators.map((user) => (
                    <option key={user.id} value={user.id}>{user.username}</option>
                ))}
            </select>
            <button onClick={handleAddCollaborator}>Add</button>
        </div>
    );
}

export default TripCollaborators;