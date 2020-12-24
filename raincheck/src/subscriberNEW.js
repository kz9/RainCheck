import { Modal, Button } from 'antd';
import React, { Component, useState } from 'react';  //import React component
import { Form } from './formNew';

export const Subscribe = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" className="subscribe" onClick={showModal}>
        Subscribe
      </Button>
      <Modal title="Subscribe To Get Notified When It Rains" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form />
      </Modal>
    </>
  );
};