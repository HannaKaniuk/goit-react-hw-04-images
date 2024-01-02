import { useEffect, useCallback } from 'react';
import css from './Modal.module.css';

export const Modal = ({ largeImageURL, tags, onCloseModal }) => {
  const escapeCloseModal = useCallback(
    evt => {
      if (evt.code === 'Escape') {
        onCloseModal();
      }
    },
    [onCloseModal]
  );

  const backdropCloseModal = evt => {
    if (evt.target === evt.currentTarget) {
      onCloseModal();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', escapeCloseModal);
    return () => {
      window.removeEventListener('keydown', escapeCloseModal);
    };
  }, [onCloseModal, escapeCloseModal]);

  return (
    <div onClick={backdropCloseModal} className={css.overlay}>
      <div className={css.modal}>
        <img src={largeImageURL} alt={tags} />
      </div>
    </div>
  );
};
