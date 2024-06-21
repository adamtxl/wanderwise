import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Form, Button } from 'react-bootstrap';

const PackingListItemCard = ({ item }) => {
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [editedItem, setEditedItem] = useState({ ...item });

    const handleToggleEditMode = () => {
        setEditMode(!editMode);
        setEditedItem({ ...item }); // Reset edited item state
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedItem({
            ...editedItem,
            [name]: name === 'packed' ? event.target.checked : value,
        });
    };

    const handleUpdateItem = () => {
        dispatch({ type: 'UPDATE_PACKING_LIST_ITEM', payload: editedItem });
        setEditMode(false);
    };

    const handleDeleteItem = () => {
        dispatch({ type: 'DELETE_PACKING_LIST_ITEM', payload: item.packinglist_id });
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                {editMode ? (
                    <Form>
                        <Form.Group controlId="item_name">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="item_name"
                                value={editedItem.item_name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="quantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={editedItem.quantity}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="packed">
                            <Form.Check
                                type="checkbox"
                                label="Packed"
                                name="packed"
                                checked={editedItem.packed}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="success" onClick={handleUpdateItem}>
                            Save
                        </Button>
                    </Form>
                ) : (
                    <>
                        <Card.Title>{item.item_name}</Card.Title>
                        <Card.Text>Quantity: {item.quantity}</Card.Text>
                        <Card.Text>Packed: {item.packed ? 'Yes' : 'No'}</Card.Text>
                    </>
                )}
                <div>
                    <Button variant="secondary" onClick={handleToggleEditMode}>
                        {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                    <Button variant="danger" onClick={handleDeleteItem}>
                        Delete
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PackingListItemCard;
