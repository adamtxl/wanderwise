import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Form, Container, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ChecklistComponent = () => {
    const { tripId } = useParams();
    const dispatch = useDispatch();

    const checklist = useSelector((state) => state.checklist || []);
    const [newItem, setNewItem] = useState('');

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
                        {checklist.map((item) => (
                            <ListGroup.Item key={item.checklist_id}>
                                <Form.Check
                                    type="checkbox"
                                    label={item.item_name}
                                    checked={item.completed}
                                    onChange={() => handleToggleComplete(item.checklist_id, item.completed)}
                                />
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteItem(item.checklist_id)}
                                    className="float-right"
                                >
                                    Delete
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ChecklistComponent;