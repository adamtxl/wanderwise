import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Form, Button } from 'react-bootstrap';

const PackingListItemCard = ({ item }) => {
	const dispatch = useDispatch();
	const [editMode, setEditMode] = useState(false);
	const [editedItem, setEditedItem] = useState({ ...item });

	const handleToggleEditMode = (event) => {
		event.stopPropagation();
		setEditMode(!editMode);
		setEditedItem({ ...item });
	};

	const handleInputChange = (event) => {
		event.stopPropagation();
		const { name, value } = event.target;
		setEditedItem({
			...editedItem,
			[name]: name === 'packed' ? event.target.checked : value,
		});
	};

	const handleUpdateItem = (event) => {
		event.stopPropagation();
		dispatch({ type: 'UPDATE_PACKING_LIST_ITEM', payload: editedItem });
		setEditMode(false);
	};

	const handleDeleteItem = (event) => {
		event.stopPropagation();
		dispatch({ type: 'DELETE_PACKING_LIST_ITEM', payload: item });
	};

	const handleTogglePacked = () => {
		const updatedItem = { ...item, packed: !item.packed };
		dispatch({ type: 'UPDATE_PACKING_LIST_ITEM', payload: updatedItem });
	};

    return (
        <Card
            className={`packing-list-item-card ${item.packed ? 'bg-success text-white' : 'bg-light'}`}
            style={{ cursor: 'pointer', marginBottom: '2px' }}
            onClick={handleTogglePacked}
        >
            <Card.Body>
                {editMode ? (
                    <Form>
                        <Form.Group controlId='item_name'>
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type='text'
                                name='item_name'
                                value={editedItem.item_name}
                                onChange={handleInputChange}
                                onClick={(event) => event.stopPropagation()}
                                onFocus={(event) => event.stopPropagation()}
                            />
                        </Form.Group>

                        <Form.Group controlId='quantity'>
                            <Form.Label><strong>Quantity</strong></Form.Label>
                            <Form.Control
                                type='number'
                                name='quantity'
                                value={editedItem.quantity}
                                onChange={handleInputChange}
                                onClick={(event) => event.stopPropagation()}
                                onFocus={(event) => event.stopPropagation()}
                            />
                        </Form.Group>

                        <Form.Group controlId='packed'>
                            <Form.Check
                                type='checkbox'
                                label='Packed'
                                name='packed'
                                checked={editedItem.packed}
                                onChange={handleInputChange}
                                onClick={(event) => event.stopPropagation()}
                                onFocus={(event) => event.stopPropagation()}
                            />
                        </Form.Group>
                    </Form>
                ) : (
                    <>
                        <Card.Title className='compact-card-text'>{item.item_name}</Card.Title>
                        <Card.Text className='compact-card-text'><strong>Qty:</strong> {item.quantity}</Card.Text>
                        <Card.Text className='compact-card-text'><strong>Packed:</strong> {item.packed ? 'Yes' : 'No'}</Card.Text>
                    </>
                )}
                <div className='card-buttons'>
                    {editMode ? (
                        <Button className='btn btn-primary btn-sm' onClick={handleUpdateItem}>
                            Save
                        </Button>
                    ) : (
                        <Button className='btn btn-secondary btn-sm' onClick={handleToggleEditMode}>
                            Edit
                        </Button>
                    )}
                    <Button className='btn btn-danger btn-sm' onClick={handleDeleteItem}>
                        Delete
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PackingListItemCard;
