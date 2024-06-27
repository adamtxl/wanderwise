import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import './UserItems.css';

const UserItems = ({ userItems, handleAddToPackingList, handleDeleteUserItem, handleUpdateUserItem }) => {
    const [editItemId, setEditItemId] = useState(null);
    const [editItemData, setEditItemData] = useState({ item_name: '', category: '' });
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const uniqueCategories = [...new Set(userItems.map(item => item.category))];
        setCategories(uniqueCategories);
    }, [userItems]);

    const handleEditClick = (item) => {
        setEditItemId(item.item_id);
        setEditItemData({ item_name: item.item_name, category: item.category });
    };

    const handleSaveClick = () => {
        handleUpdateUserItem({ ...editItemData, item_id: editItemId });
        setEditItemId(null);
        setEditItemData({ item_name: '', category: '' });
    };

    const filteredItems = selectedCategory === 'All' ? userItems : userItems.filter(item => item.category === selectedCategory);

    return (
        <div>
            <h2>User Items</h2>
            <Form.Group controlId="categorySelect">
                <Form.Label>Select Category</Form.Label>
                <Form.Control className="category-select" as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="All">All</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Row xs={1} sm={2} md={3} lg={12} > 
                {filteredItems.map((item) => (
                    <Card key={item.item_id} className="card-custom-margin">
                        <Card.Body>
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
                                    <i class="bi bi-floppy-fill"></i>
                                    </Button>
                                    <Button variant='danger' onClick={() => setEditItemId(null)}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                <Row>
                                <Col>
                                    <Card.Title>{item.item_name}
                                    </Card.Title>
                                    </Col>
                                    <Col>
                                    <Button variant='primary' onClick={() => handleAddToPackingList(item)}>
                                    <i class="bi bi-journal-plus"></i> 
                                    </Button>
                                    <Button variant='danger' onClick={() => handleDeleteUserItem(item.item_id)}>
                                    <i class="bi bi-x-lg"></i>
                                    </Button>
                                    <Button variant='secondary' onClick={() => handleEditClick(item)}>
                                    <i class="bi bi-pencil-square"></i>
                                    </Button>
                                    
                                    </Col>
                                    </Row>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                ))}
            </Row>
        </div>
    );
};

export default UserItems;