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
		<div className='d-flex justify-content-between align-items-start '>
			<Card
				className={`packing-list-item-card ${item.packed ? 'bg-success text-white op' : 'lb-bg'}`}
				style={{ cursor: 'pointer', marginBottom: '.5em', flex: 1 }}
				onClick={handleTogglePacked}
			>
				<Card.Body className='d-flex justify-content-between align-items-center'>
					<div className='flex-grow-1 d-flex align-items-center'>
						{editMode ? (
							<Form inline>
								{/* Form inputs for editing */}
								<Form.Group controlId='item_name' className='mr-2 '>
									<Form.Control
										type='text'
										name='item_name'
										value={editedItem.item_name}
										onChange={handleInputChange}
									/>
								</Form.Group>
								<Form.Group controlId='quantity' className='mr-2'>
									<Form.Control
										type='number'
										name='quantity'
										value={editedItem.quantity}
										onChange={handleInputChange}
									/>
								</Form.Group>
								<Form.Group controlId='packed' className='mr-2'>
									<Form.Check
										type='checkbox'
										label='Packed'
										name='packed'
										checked={editedItem.packed}
										onChange={handleInputChange}
									/>
								</Form.Group>
							</Form>
						) : (
							<>
								<strong className='bigger'> {item.item_name} </strong> <span className='hidden'> - </span> <span className='smaller'><strong><em>Qty:</em></strong> {item.quantity} <strong><em> Packed: </em></strong> 
								{item.packed ? ' Yes' : ' No'}</span>
							</>
						)}
					</div>
					<div>
						{editMode ? (
							<Button className=' btn-primary btn-xs mr-2' onClick={handleUpdateItem}>
								<i class="bi bi-floppy-fill"></i>
							</Button>
						) : (
							<Button className=' btn-secondary btn-xs op mr-2' onClick={handleToggleEditMode}>
								<i class="bi bi-pencil-square"></i>
							</Button>
						)}
						<Button className='button-remove btn-xs' onClick={handleDeleteItem}>
                        <i class="bi bi-x-lg"></i>
						</Button>
					</div>
				</Card.Body>
			</Card>
		</div>
	);
};

export default PackingListItemCard;
