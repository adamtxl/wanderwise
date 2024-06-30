import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Col, Container, Button, FormControl } from 'react-bootstrap';
import PackingListItemCard from './PackingListItemCard';
import UserItems from './UserItems';
import './PackingList.css';

const PackingList = () => {
	const { tripId } = useParams();
	const dispatch = useDispatch();
	const packingList = useSelector((state) => state.packingList);
	const userItems = useSelector((state) => state.userItems);
	const [newItem, setNewItem] = useState({ item_name: '', category: '' });

	useEffect(() => {
		if (tripId) {
			dispatch({ type: 'FETCH_PACKING_LIST', payload: { tripId } });
		}
		dispatch({ type: 'FETCH_USER_ITEMS' });
	}, [dispatch, tripId]);

	const handleAddUserItem = () => {
		// Function to capitalize the first letter and lowercase the rest
		const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

		// Apply the transformation to the category field
		const updatedItem = {
			...newItem,
			category: capitalizeFirstLetter(newItem.category),
		};

		dispatch({
			type: 'ADD_USER_ITEM',
			payload: updatedItem,
		});

		// Reset newItem state
		setNewItem({ item_name: '', category: '' });
	};

	const handleAddToPackingList = (item) => {
		const packingListItem = {
			item_name: item.item_name,
			quantity: 1,
			packed: false,
			trip_id: tripId, // Ensure tripId is included in the payload
			packinglist_id: item.packinglist_id, // Ensure packinglist_id is included in the payload
		};
		dispatch({ type: 'ADD_PACKING_LIST_ITEM', payload: packingListItem });
	};

	const handleUpdateItem = (item) => {
		dispatch({ type: 'UPDATE_PACKING_LIST_ITEM', payload: item });
	};

	const handleDeleteItem = (packinglist_id) => {
		dispatch({ type: 'DELETE_PACKING_LIST_ITEM', payload: { packinglist_id, tripId } });
	};

	const handleDeleteUserItem = (itemId) => {
		dispatch({ type: 'DELETE_USER_ITEM', payload: itemId });
	};

	const handleUpdateUserItem = (item) => {
		dispatch({ type: 'UPDATE_USER_ITEM', payload: item });
	};

	return (
		<Container>
			<Row>
				<Col>
					<div className='border-container center'>
						<h3>Add New Item to Database</h3>
						<form onSubmit={handleAddUserItem}>
							<FormControl
								type='text'
								value={newItem.item_name}
								onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
								placeholder='Item Name'
								required
								className='rounded-input' // Custom class for styling
							/>
							<FormControl
								type='text'
								value={newItem.category}
								onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
								placeholder='Category'
								required
								className='rounded-input' // Custom class for styling
							/>
							<Button className='btn button-proceed mr-2 btn-xs op' type='submit'>
								<i class='bi bi-plus'></i>Item
							</Button>
						</form>
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className='border-container center'>
						<h3>Packing List</h3>
						<Row>
							{packingList.map((item) => (
								<Col key={item.packinglist_id} xs={12} sm={12} md={6} lg={4}>
									<PackingListItemCard item={item} />
								</Col>
							))}
						</Row>
					</div>
				</Col>
			</Row>
			<Row>
				<Col>
					<div className='border-container center'>
						<UserItems
							userItems={userItems}
							handleAddToPackingList={handleAddToPackingList}
							handleDeleteUserItem={handleDeleteUserItem}
							handleUpdateUserItem={handleUpdateUserItem}
						/>
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default PackingList;
