import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';




function TripCollaborators({ trip_id }) {
    const collaborators = useSelector((store) => store.collaboratorsReducer);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    console.log('collaborators', collaborators);
    console.log('trip_id', trip_id);

useEffect(() => {
  dispatch({ type: 'FETCH_COLLABORATORS', payload: trip_id });
  setLoading(true);
}, [trip_id]);

  return (
    <div>
        <h2>Collaborators</h2>
        <ul>
            {collaborators.map((collaborator) => (
            <li key={collaborator.id}>{collaborator.username}</li>
            ))}
        </ul>
    </div>
    );
}


export default TripCollaborators;