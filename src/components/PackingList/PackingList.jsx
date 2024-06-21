import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap'; // Import Row and Col from react-bootstrap
import PackingListItemCard from './PackingListItemCard';
import UserItems from './UserItems';

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
        dispatch({
            type: 'ADD_USER_ITEM',
            payload: newItem,
        });
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
                    <h2>Packing List</h2>
                    <Row>
                        {packingList.map((item) => (
                            <Col key={item.packinglist_id} xs={12} sm={6} md={4} lg={3}>
                                <PackingListItemCard item={item} />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <UserItems
                        userItems={userItems}
                        handleAddToPackingList={handleAddToPackingList}
                        handleDeleteUserItem={handleDeleteUserItem}
                        handleUpdateUserItem={handleUpdateUserItem}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2>Add New Item</h2>
                    <input
                        type='text'
                        value={newItem.item_name}
                        onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                        placeholder='Item Name'
                    />
                    <input
                        type='text'
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        placeholder='Category'
                    />
                    <button onClick={handleAddUserItem}>Add Item</button>
                </Col>
            </Row>
        </Container>
    );
};

export default PackingList;
