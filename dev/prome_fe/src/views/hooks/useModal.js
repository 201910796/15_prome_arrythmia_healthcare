import { useState } from 'react';

const useModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const toggleModal = () => {
        setIsModalVisible(prev => !prev);
    };

    return {
        isModalVisible,
        openModal,
        closeModal,
        toggleModal,
    };
};

export default useModal;
