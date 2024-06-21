import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Form } from 'react-bootstrap';

const PackingListItemCard = ({ item }) => {
	const dispatch = useDispatch();
	const [editMode, setEditMode] = useState(false);
	const [editedItem, setEditedItem] = useState({ ...item });

	const handleToggleEditMode = (event) => {
		event.stopPropagation();
		setEditMode(!editMode);
		setEditedItem({ ...item }); // Reset edited item state
	};
	console.log('edited item', editedItem);
	const handleInputChange = (event) => {
		event.stopPropagation(); // Stop event propagation for input fields
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
        console.log('item', item)
		dispatch({ type: 'DELETE_PACKING_LIST_ITEM', payload: item });
	};

	return (
		<Card
			className='packing-list-item-card'
			style={{ cursor: 'pointer', marginBottom: '10px' }}
			onClick={() => setEditMode(!editMode)}
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
								onClick={(event) => event.stopPropagation()} // Stop event propagation for input fields
								onFocus={(event) => event.stopPropagation()} // Stop event propagation when input fields gain focus
							/>
						</Form.Group>

						<Form.Group controlId='quantity'>
							<Form.Label>Quantity</Form.Label>
							<Form.Control
								type='number'
								name='quantity'
								value={editedItem.quantity}
								onChange={handleInputChange}
								onClick={(event) => event.stopPropagation()} // Stop event propagation for input fields
								onFocus={(event) => event.stopPropagation()} // Stop event propagation when input fields gain focus
							/>
						</Form.Group>

						<Form.Group controlId='packed'>
							<Form.Check
								type='checkbox'
								label='Packed'
								name='packed'
								checked={editedItem.packed}
								onChange={handleInputChange}
								onClick={(event) => event.stopPropagation()} // Stop event propagation for checkbox
                                onFocus={(event) => event.stopPropagation()}
							/>
						</Form.Group>
					</Form>
				) : (
					<>
						<Card.Title>{item.item_name}</Card.Title>
						<Card.Text>Quantity: {item.quantity}</Card.Text>
						<Card.Text>Packed: {item.packed ? 'Yes' : 'No'}</Card.Text>
					</>
				)}
				<div className='card-buttons'>
					{editMode ? (
						<button className='btn btn-primary' onClick={handleUpdateItem}>
							Save
						</button>
					) : (
						<button className='btn btn-secondary' onClick={handleToggleEditMode}>
							Edit
						</button>
					)}
					<button className='btn btn-danger' onClick={handleDeleteItem}>
						Delete
					</button>
				</div>
			</Card.Body>
		</Card>
	);
};

export default PackingListItemCard;
