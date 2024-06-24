import React, { useState } from 'react';
import { ListGroup, Button, Form } from 'react-bootstrap';

const UserItems = ({ userItems, handleAddToPackingList, handleDeleteUserItem, handleUpdateUserItem }) => {
	const [editItemId, setEditItemId] = useState(null);
	const [editItemData, setEditItemData] = useState({ item_name: '', category: '' });

	const handleEditClick = (item) => {
		setEditItemId(item.item_id);
		setEditItemData({ item_name: item.item_name, category: item.category });
	};

	const handleSaveClick = () => {
		handleUpdateUserItem({ ...editItemData, item_id: editItemId });
		setEditItemId(null);
		setEditItemData({ item_name: '', category: '' });
	};

	return (
		<div>
			<h2>User Items</h2>
			<ListGroup>
				{userItems.map((item) => (
					<ListGroup.Item key={item.item_id}>
						{editItemId === item.item_id ? (
							<>
								<Form.Control
									type='text'
									value={editItemData.item_name}
									onChange={(e) => setEditItemData({ ...editItemData, item_name: e.target.value })}
								/>
								<Form.Control
									type='text'
									value={editItemData.category}
									onChange={(e) => setEditItemData({ ...editItemData, category: e.target.value })}
								/>
								<Button variant='success' onClick={handleSaveClick}>
									Save
								</Button>
								<Button variant='secondary' onClick={() => setEditItemId(null)}>
									Cancel
								</Button>
							</>
						) : (
							<>
								{item.item_name} ({item.category}){''}
								<div className='text-right'>
									<Button variant='primary' onClick={() => handleAddToPackingList(item)}>
										Add to Packing List
									</Button>
								</div>
								<Button variant='danger' onClick={() => handleDeleteUserItem(item.item_id)}>
									Delete
								</Button>
								<Button variant='secondary' onClick={() => handleEditClick(item)}>
									Edit
								</Button>
							</>
						)}
					</ListGroup.Item>
				))}
			</ListGroup>
		</div>
	);
};

export default UserItems;
