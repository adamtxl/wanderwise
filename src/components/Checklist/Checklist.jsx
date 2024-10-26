import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Form, Container, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ChecklistComponent = () => {
    const { tripId } = useParams();
    const dispatch = useDispatch();

    // Get the checklist items from Redux
    const checklist = useSelector((state) => state.checklistReducer || []);
    const [newItem, setNewItem] = useState('');
    const [editItemId, setEditItemId] = useState(null); // Track item being edited
    const [editedName, setEditedName] = useState(''); // Track name change during editing

    useEffect(() => {
        dispatch({ type: 'FETCH_CHECKLIST', payload: tripId });
    }, [dispatch, tripId]);

    const handleAddItem = () => {
        if (newItem.trim()) {
            dispatch({
                type: 'ADD_CHECKLIST_ITEM',
                payload: { trip_id: tripId, item_name: newItem, completed: false }
            });
            setNewItem(''); // Clear the input field after adding
        }
    };

    const handleToggleComplete = (checklistId, completed) => {
        dispatch({
            type: 'UPDATE_CHECKLIST_ITEM',
            payload: { checklistId, updatedItem: { completed: !completed, trip_id: tripId } }
        });
    };

    const handleDeleteItem = (checklistId) => {
        dispatch({
            type: 'DELETE_CHECKLIST_ITEM',
            payload: checklistId,
            trip_id: tripId
        });
    };

    const handleEditClick = (item) => {
        setEditItemId(item.checklist_id); // Set the item to be edited
        setEditedName(item.item_name);    // Set the current name to be edited
    };

    const handleSaveEdit = (checklistId) => {
        dispatch({
            type: 'UPDATE_CHECKLIST_ITEM',
            payload: { checklistId, updatedItem: { item_name: editedName, trip_id: tripId } }
        });
        setEditItemId(null); // Exit edit mode
    };

    return (
        <Container>
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Trip Checklist</Card.Title>
                    <Form.Control
                        type="text"
                        placeholder="Add a new task"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className="mb-3"
                    />
                    <Button onClick={handleAddItem} variant="primary">Add Task</Button>
                    <ListGroup className="mt-4">
                        {/* Mapping over the checklist */}
                        {checklist.length > 0 ? (
                            checklist.map((item) => (
                                <ListGroup.Item 
                                    key={item.checklist_id} 
                                    className="d-flex align-items-center justify-content-between"
                                    style={{
                                        textDecoration: item.completed ? 'line-through' : 'none',
                                        color: item.completed ? 'gray' : 'black',
                                        backgroundColor: item.completed ? '#A9A9A9' : 'white' // Dark gray background for completed items
                                    }}
                                >
                                    <div>
                                        {/* Toggle between display and edit mode */}
                                        {editItemId === item.checklist_id ? (
                                            <Form.Control
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="mb-2"
                                            />
                                        ) : (
                                            <>
                                                <Form.Check
                                                    type="checkbox"
                                                    label={item.item_name}
                                                    checked={item.completed}
                                                    onChange={() => handleToggleComplete(item.checklist_id, item.completed)}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Show buttons depending on edit mode */}
                                    <div>
                                        {editItemId === item.checklist_id ? (
                                            <Button variant="success" className="me-2" onClick={() => handleSaveEdit(item.checklist_id)}>
                                                Save
                                            </Button>
                                        ) : (
                                            <Button variant="warning" className="me-2" onClick={() => handleEditClick(item)}>
                                                Edit
                                            </Button>
                                        )}
                                        <Button variant="danger" onClick={() => handleDeleteItem(item.checklist_id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No checklist items found.</p>
                        )}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ChecklistComponent;